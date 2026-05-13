import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateExamDto) {
    const { questions, ...examData } = data;

    return this.prisma.exam.create({
      data: {
        ...examData,
        questions: questions ? {
          create: questions.map((q) => ({
            type: q.type,
            question_text: q.question_text,
            difficulty: q.difficulty,
            options: q.options ? {
              create: q.options
            } : undefined
          }))
        } : undefined
      },
      include: {
        questions: {
          include: { options: true }
        }
      }
    });
  }

  async findAll(pagination: PaginationDto, filters: { major_id?: string; subject_id?: string; search?: string }) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.major_id) where.major_id = filters.major_id;
    if (filters.subject_id) where.subject_id = filters.subject_id;
    if (filters.search) {
      where.title = { contains: filters.search };
    }

    const [data, total] = await Promise.all([
      this.prisma.exam.findMany({
        where,
        skip,
        take: limit,
        orderBy: { start_time: 'desc' },
        include: {
          subject: true,
          major: true,
          _count: { select: { questions: true, sessions: true } }
        },
      }),
      this.prisma.exam.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, last_page: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: {
        subject: true,
        major: true,
        questions: {
          include: { options: true }
        },
        _count: { select: { sessions: true } }
      },
    });
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async update(id: string, data: any) {
    return this.prisma.exam.update({
      where: { id },
      data,
      include: { subject: true, major: true }
    });
  }

  async remove(id: string) {
    // Delete cascade: answers -> sessions -> logs -> questions -> options
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: { sessions: { include: { answers: true, logs: true } }, questions: { include: { options: true, answers: true } } }
    });
    if (!exam) throw new NotFoundException('Exam not found');

    // Delete in order to avoid FK constraints
    for (const session of exam.sessions) {
      await this.prisma.studentAnswer.deleteMany({ where: { session_id: session.id } });
      await this.prisma.examLog.deleteMany({ where: { session_id: session.id } });
    }
    await this.prisma.examSession.deleteMany({ where: { exam_id: id } });
    
    for (const q of exam.questions) {
      await this.prisma.studentAnswer.deleteMany({ where: { question_id: q.id } });
      await this.prisma.questionOption.deleteMany({ where: { question_id: q.id } });
    }
    await this.prisma.question.deleteMany({ where: { exam_id: id } });
    
    // Delete related grades
    await this.prisma.grade.deleteMany({ where: { exam_id: id } });

    return this.prisma.exam.delete({ where: { id } });
  }

  // --- Stats for Dashboard ---
  async getStats() {
    const now = new Date();

    const [totalExams, activeExams, ongoingSessions, todayViolations, totalQuestions] = await Promise.all([
      this.prisma.exam.count(),
      this.prisma.exam.count({
        where: {
          start_time: { lte: now },
          end_time: { gte: now }
        }
      }),
      this.prisma.examSession.count({
        where: { status: 'ongoing' }
      }),
      this.prisma.examLog.count({
        where: {
          timestamp: {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate())
          }
        }
      }),
      this.prisma.question.count()
    ]);

    return { totalExams, activeExams, ongoingSessions, todayViolations, totalQuestions };
  }

  // --- Monitoring: Get all sessions for an exam ---
  async getMonitoring(examId: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: { subject: true, major: true }
    });
    if (!exam) throw new NotFoundException('Exam not found');

    const sessions = await this.prisma.examSession.findMany({
      where: { exam_id: examId },
      include: {
        student: { select: { id: true, full_name: true, nis: true, class: { select: { name: true } } } },
        applicant: { select: { id: true, full_name: true } },
        _count: { select: { answers: true, logs: true } }
      },
      orderBy: { start_time: 'desc' }
    });

    return { exam, sessions };
  }

  // --- Recent violations ---
  async getRecentViolations(limit = 10) {
    return this.prisma.examLog.findMany({
      take: limit,
      orderBy: { timestamp: 'desc' },
      include: {
        session: {
          include: {
            student: { select: { full_name: true, nis: true, class: { select: { name: true } } } },
            applicant: { select: { full_name: true } },
            exam: { select: { title: true } }
          }
        }
      }
    });
  }

  // Questions Management
  async addQuestion(examId: string, data: any) {
    const { options, ...questionData } = data;
    return this.prisma.question.create({
      data: {
        ...questionData,
        exam: { connect: { id: examId } },
        options: options ? {
          create: options
        } : undefined
      },
      include: { options: true }
    });
  }

  async updateQuestion(questionId: string, data: any) {
    const { options, ...questionData } = data;

    // If options are provided, we delete old ones and create new ones.
    if (options) {
      await this.prisma.questionOption.deleteMany({
        where: { question_id: questionId }
      });
    }

    return this.prisma.question.update({
      where: { id: questionId },
      data: {
        ...questionData,
        options: options ? {
          create: options
        } : undefined
      },
      include: { options: true }
    });
  }

  async deleteQuestion(questionId: string) {
    // Delete answers and options first
    await this.prisma.studentAnswer.deleteMany({ where: { question_id: questionId } });
    await this.prisma.questionOption.deleteMany({ where: { question_id: questionId } });
    return this.prisma.question.delete({
      where: { id: questionId }
    });
  }
}
