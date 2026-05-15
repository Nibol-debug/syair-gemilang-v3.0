import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentBehaviorService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    page?: number;
    limit?: number;
    studentId?: string;
    assessorId?: string;
  }) {
    const { page = 1, limit = 10, studentId, assessorId } = params;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (studentId) where.student_id = studentId;
    if (assessorId) where.assessor_id = assessorId;

    const [items, total] = await Promise.all([
      this.prisma.studentBehaviorAssessment.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          student: { select: { full_name: true, nis: true } },
          assessor: { select: { full_name: true } }
        },
        orderBy: { date: 'desc' }
      }),
      this.prisma.studentBehaviorAssessment.count({ where })
    ]);

    return {
      data: items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  async findOne(id: string) {
    const assessment = await this.prisma.studentBehaviorAssessment.findUnique({
      where: { id },
      include: {
        student: { select: { full_name: true, nis: true } },
        assessor: { select: { full_name: true } }
      }
    });

    if (!assessment) throw new NotFoundException('Assessment not found');
    return assessment;
  }

  async create(data: any, assessorId: string) {
    const overallScore = (Number(data.attitude) + Number(data.ethics) + Number(data.manners)) / 3;
    return this.prisma.studentBehaviorAssessment.create({
      data: {
        student_id: data.student_id,
        assessor_id: assessorId,
        date: data.date ? new Date(data.date) : new Date(),
        attitude: Number(data.attitude),
        ethics: Number(data.ethics),
        manners: Number(data.manners),
        overallScore: overallScore,
        notes: data.notes
      }
    });
  }

  async update(id: string, data: any) {
    const existing = await this.findOne(id);
    const attitude = data.attitude !== undefined ? Number(data.attitude) : existing.attitude;
    const ethics = data.ethics !== undefined ? Number(data.ethics) : existing.ethics;
    const manners = data.manners !== undefined ? Number(data.manners) : existing.manners;
    const overallScore = (attitude + ethics + manners) / 3;

    const updateData: any = {
      attitude,
      ethics,
      manners,
      overallScore,
      notes: data.notes !== undefined ? data.notes : existing.notes
    };
    
    if (data.date) {
      updateData.date = new Date(data.date);
    }
    if (data.student_id) {
      updateData.student_id = data.student_id;
    }

    return this.prisma.studentBehaviorAssessment.update({
      where: { id },
      data: updateData
    });
  }

  async remove(id: string) {
    return this.prisma.studentBehaviorAssessment.delete({
      where: { id }
    });
  }
}
