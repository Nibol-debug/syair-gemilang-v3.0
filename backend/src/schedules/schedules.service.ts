import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateScheduleDto) {
    // 1. Check for Teacher Clash
    const teacherClash = await this.prisma.schedule.findFirst({
      where: {
        teacher_id: data.teacher_id,
        day: data.day,
        OR: [
          {
            start_time: { lte: data.start_time },
            end_time: { gt: data.start_time },
          },
          {
            start_time: { lt: data.end_time },
            end_time: { gte: data.end_time },
          },
        ],
      },
    });

    if (teacherClash) {
      throw new BadRequestException('Teacher already has a schedule at this time');
    }

    // 2. Check for Class Clash
    const classClash = await this.prisma.schedule.findFirst({
      where: {
        class_id: data.class_id,
        day: data.day,
        OR: [
          {
            start_time: { lte: data.start_time },
            end_time: { gt: data.start_time },
          },
          {
            start_time: { lt: data.end_time },
            end_time: { gte: data.end_time },
          },
        ],
      },
    });

    if (classClash) {
      throw new BadRequestException('Class already has a schedule at this time');
    }

    return this.prisma.schedule.create({ data });
  }

  async findAll(filters: { class_id?: string; teacher_id?: string; day?: string }) {
    return this.prisma.schedule.findMany({
      where: filters,
      include: {
        class: true,
        subject: true,
        teacher: true,
      },
      orderBy: [
        { day: 'asc' },
        { start_time: 'asc' },
      ],
    });
  }

  async remove(id: string) {
    return this.prisma.schedule.delete({ where: { id } });
  }
}
