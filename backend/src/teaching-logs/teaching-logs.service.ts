import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeachingLogDto } from './dto/create-teaching-log.dto';

@Injectable()
export class TeachingLogsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTeachingLogDto) {
    return this.prisma.teachingLog.create({ data });
  }

  async findAll(filters: { teacher_id?: string; class_id?: string }) {
    return this.prisma.teachingLog.findMany({
      where: filters,
      include: {
        teacher: true,
        class: true,
        subject: true,
      },
      orderBy: { date: 'desc' },
    });
  }
}
