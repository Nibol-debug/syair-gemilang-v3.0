import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StartExamDto, SubmitAnswerDto, LogViolationDto } from './dto/exam-session.dto';

@Injectable()
export class ExamSessionsService {
  constructor(private prisma: PrismaService) {}

  async startExam(studentId: string, examId: string, data: StartExamDto) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: { questions: true }
    });

    if (!exam) throw new NotFoundException('Exam not found');

    // 1. Check Token
    if (exam.token !== data.token) {
      throw new BadRequestException('Invalid exam token');
    }

    // 2. Check Student Major
    const student = await this.prisma.student.findUnique({
      where: { id: studentId }
    });
    if (!student) throw new NotFoundException('Student not found');
    
    if (student.major_id !== exam.major_id) {
      throw new ForbiddenException('You are not allowed to take this exam (Major mismatch)');
    }

    // 3. Check Time
    const now = new Date();
    if (now < exam.start_time || now > exam.end_time) {
      throw new BadRequestException('Exam is not currently active');
    }

    // 4. Check Existing Session
    const existing = await this.prisma.examSession.findFirst({
      where: { student_id: studentId, exam_id: examId }
    });
    if (existing) {
      if (existing.status === 'submitted') throw new BadRequestException('You have already submitted this exam');
      return existing; // Resume
    }

    return this.prisma.examSession.create({
      data: {
        exam_id: examId,
        student_id: studentId,
        status: 'ongoing',
        device_id: data.device_id,
      }
    });
  }

  async submitAnswer(sessionId: string, data: SubmitAnswerDto) {
    const existing = await this.prisma.studentAnswer.findFirst({
      where: { session_id: sessionId, question_id: data.question_id }
    });

    if (existing) {
      return this.prisma.studentAnswer.update({
        where: { id: existing.id },
        data: { answer: data.answer },
      });
    }

    return this.prisma.studentAnswer.create({
      data: {
        session_id: sessionId,
        question_id: data.question_id,
        answer: data.answer,
      }
    });
  }

  async logViolation(sessionId: string, data: LogViolationDto) {
    return this.prisma.examLog.create({
      data: {
        session_id: sessionId,
        type: data.type,
      }
    });
  }

  async finalizeExam(sessionId: string) {
    const session = await this.prisma.examSession.findUnique({
      where: { id: sessionId },
      include: {
        exam: {
          include: {
            questions: { include: { options: true } }
          }
        },
        answers: true
      }
    });

    if (!session) throw new NotFoundException('Session not found');
    if (session.status === 'submitted') throw new BadRequestException('Exam already submitted');

    // AUTO GRADING MCQ
    let score = 0;
    let totalMcq = 0;

    session.exam.questions.forEach((q) => {
      if (q.type === 'mcq') {
        totalMcq++;
        const studentAnswer = session.answers.find((a) => a.question_id === q.id);
        const correctOption = q.options.find((o) => o.is_correct);
        
        if (studentAnswer && correctOption && studentAnswer.answer === correctOption.option_text) {
          score++;
        }
      }
    });

    const finalScore = totalMcq > 0 ? (score / totalMcq) * 100 : 0;

    // Update Session Status
    await this.prisma.examSession.update({
      where: { id: sessionId },
      data: { status: 'submitted', end_time: new Date() }
    });

    // PUSH TO GRADES TABLE
    const student = await this.prisma.student.findUnique({ where: { id: session.student_id } });
    if (!student) throw new NotFoundException('Student not found');

    await this.prisma.grade.create({
      data: {
        student_id: session.student_id,
        subject_id: session.exam.subject_id,
        exam_id: session.exam.id,
        type: 'cbt',
        score: finalScore,
        weight: 1.0,
        major_id: session.exam.major_id,
        batch_id: student.batch_id,
      }
    });

    return { score: finalScore, total_correct: score, total_questions: totalMcq };
  }
}
