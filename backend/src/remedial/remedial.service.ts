import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRemedialDto, ScheduleRemedialDto, UpdateRemedialScoreDto } from './dto/remedial.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RemedialService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get daftar siswa yang perlu remedial untuk mata pelajaran tertentu
   */
  async getStudentsNeedingRemedial(subjectId: string, classId?: string, semester?: number) {
    const where: any = {
      subject_id: subjectId,
      is_passed: false,
    };

    if (semester) {
      where.semester = semester;
    }

    const finalGrades = await this.prisma.finalGrade.findMany({
      where,
      include: {
        student: {
          include: {
            class: true,
            batch: true
          }
        },
        subject: true
      }
    });

    // Filter by class if provided
    let filtered = finalGrades;
    if (classId) {
      filtered = finalGrades.filter(g => g.student.class_id === classId);
    }

    // Get existing remedial records
    const studentIds = filtered.map(g => g.student_id);
    const existingRemedials = await this.prisma.remedial.findMany({
      where: {
        student_id: { in: studentIds },
        subject_id: subjectId,
      },
      orderBy: { created_at: 'desc' }
    });

    return filtered.map(grade => {
      const existingRemedial = existingRemedials.find(r => r.student_id === grade.student_id);
      return {
        id: grade.id,
        final_grade_id: grade.id,
        student_id: grade.student_id,
        nis: grade.student.nis,
        full_name: grade.student.full_name,
        class_name: grade.student.class?.name || '-',
        final_score: Number(grade.final_score),
        grade_letter: grade.grade_letter,
        needs_remedial: !grade.is_passed,
        remedial_status: existingRemedial?.status || 'pending',
        remedial_id: existingRemedial?.id,
        score_after: existingRemedial?.score_after ? Number(existingRemedial.score_after) : null,
        scheduled_at: existingRemedial?.scheduled_at,
      };
    });
  }

  /**
   * Create remedial record untuk siswa
   */
  async create(data: CreateRemedialDto) {
    // Verify student exists
    const student = await this.prisma.student.findUnique({
      where: { id: data.student_id }
    });
    if (!student) throw new NotFoundException('Student not found');

    // Verify subject exists
    const subject = await this.prisma.subject.findUnique({
      where: { id: data.subject_id }
    });
    if (!subject) throw new NotFoundException('Subject not found');

    // Check if exam exists if provided
    if (data.exam_id) {
      const exam = await this.prisma.exam.findUnique({
        where: { id: data.exam_id }
      });
      if (!exam) throw new NotFoundException('Exam not found');
    }

    // Check if there's already an active remedial
    const existing = await this.prisma.remedial.findFirst({
      where: {
        student_id: data.student_id,
        subject_id: data.subject_id,
        status: { in: ['pending', 'scheduled'] }
      }
    });

    if (existing) {
      throw new BadRequestException('Student already has an active remedial for this subject');
    }

    return this.prisma.remedial.create({
      data: {
        student_id: data.student_id,
        subject_id: data.subject_id,
        exam_id: data.exam_id,
        status: data.scheduled_at ? 'scheduled' : 'pending',
        score_before: new Prisma.Decimal(data.score_before),
        scheduled_at: data.scheduled_at ? new Date(data.scheduled_at) : null,
        notes: data.notes,
      },
      include: {
        student: { select: { id: true, full_name: true, nis: true } },
        subject: true,
        exam: true
      }
    });
  }

  /**
   * Schedule remedial exam
   */
  async schedule(remedialId: string, data: ScheduleRemedialDto) {
    const remedial = await this.prisma.remedial.findUnique({
      where: { id: remedialId }
    });

    if (!remedial) throw new NotFoundException('Remedial record not found');

    // Verify exam exists
    const exam = await this.prisma.exam.findUnique({
      where: { id: data.exam_id }
    });

    if (!exam) throw new NotFoundException('Exam not found');

    return this.prisma.remedial.update({
      where: { id: remedialId },
      data: {
        exam_id: data.exam_id,
        scheduled_at: new Date(data.scheduled_at),
        status: 'scheduled',
      },
      include: {
        student: true,
        subject: true,
        exam: true
      }
    });
  }

  /**
   * Update nilai setelah remedial
   */
  async updateScore(remedialId: string, data: UpdateRemedialScoreDto) {
    const remedial = await this.prisma.remedial.findUnique({
      where: { id: remedialId }
    });

    if (!remedial) throw new NotFoundException('Remedial record not found');

    const updated = await this.prisma.remedial.update({
      where: { id: remedialId },
      data: {
        score_after: new Prisma.Decimal(data.score_after),
        status: 'completed',
        completed_at: new Date(),
        notes: data.notes ? `${remedial.notes || ''}\n${data.notes}`.trim() : remedial.notes,
      },
      include: {
        student: true,
        subject: true
      }
    });

    // Update final grade if score improved
    if (data.score_after > Number(remedial.score_before)) {
      await this.prisma.finalGrade.updateMany({
        where: {
          student_id: remedial.student_id,
          subject_id: remedial.subject_id,
        },
        data: {
          is_passed: data.score_after >= 75,
          grade_letter: this.calculateGradeLetter(data.score_after),
        }
      });
    }

    return updated;
  }

  /**
   * Get all remedial records with filters
   */
  async findAll(filters: { status?: string; subject_id?: string; student_id?: string }) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.subject_id) where.subject_id = filters.subject_id;
    if (filters.student_id) where.student_id = filters.student_id;

    return this.prisma.remedial.findMany({
      where,
      include: {
        student: {
          select: { id: true, full_name: true, nis: true, class: { select: { name: true } } }
        },
        subject: true,
        exam: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  /**
   * Get remedial by ID
   */
  async findOne(id: string) {
    const remedial = await this.prisma.remedial.findUnique({
      where: { id },
      include: {
        student: {
          select: { id: true, full_name: true, nis: true, class: true, batch: true }
        },
        subject: true,
        exam: true
      }
    });

    if (!remedial) throw new NotFoundException('Remedial record not found');
    return remedial;
  }

  /**
   * Delete remedial record
   */
  async remove(id: string) {
    const remedial = await this.prisma.remedial.findUnique({
      where: { id }
    });

    if (!remedial) throw new NotFoundException('Remedial record not found');

    return this.prisma.remedial.delete({
      where: { id }
    });
  }

  /**
   * Get remedial statistics
   */
  async getStats() {
    const [total, pending, scheduled, completed] = await Promise.all([
      this.prisma.remedial.count(),
      this.prisma.remedial.count({ where: { status: 'pending' } }),
      this.prisma.remedial.count({ where: { status: 'scheduled' } }),
      this.prisma.remedial.count({ where: { status: 'completed' } }),
    ]);

    // Calculate success rate
    const completedRemedials = await this.prisma.remedial.findMany({
      where: { status: 'completed' },
      select: { score_before: true, score_after: true }
    });

    const improvedCount = completedRemedials.filter(r => 
      r.score_after && Number(r.score_after) > Number(r.score_before)
    ).length;

    const passCount = completedRemedials.filter(r => 
      r.score_after && Number(r.score_after) >= 75
    ).length;

    return {
      total,
      pending,
      scheduled,
      completed,
      improved_count: improvedCount,
      pass_count: passCount,
      improvement_rate: completed > 0 
        ? Math.round((improvedCount / completed) * 100 * 100) / 100 
        : 0,
      pass_rate: completed > 0 
        ? Math.round((passCount / completed) * 100 * 100) / 100 
        : 0,
    };
  }

  private calculateGradeLetter(score: number): string {
    if (score >= 85) return 'A';
    if (score >= 75) return 'B';
    if (score >= 65) return 'C';
    if (score >= 50) return 'D';
    return 'E';
  }
}
