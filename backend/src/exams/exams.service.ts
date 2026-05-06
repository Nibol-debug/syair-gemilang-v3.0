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

  async findAll(pagination: PaginationDto, filters: { major_id?: string; subject_id?: string }) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.exam.findMany({
        where: filters,
        skip,
        take: limit,
        include: {
          subject: true,
          major: true,
          _count: { select: { questions: true } }
        },
      }),
      this.prisma.exam.count({ where: filters }),
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
        }
      },
    });
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }
}
