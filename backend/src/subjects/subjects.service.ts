import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSubjectDto) {
    return this.prisma.subject.create({ data });
  }

  async findAll(pagination: PaginationDto, major_id?: string) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.subject.findMany({
        where: { major_id },
        skip,
        take: limit,
        include: { major: true },
      }),
      this.prisma.subject.count({ where: { major_id } }),
    ]);

    return {
      data,
      meta: { total, page, limit, last_page: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: { major: true },
    });
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }

  async remove(id: string) {
    return this.prisma.subject.delete({ where: { id } });
  }
}
