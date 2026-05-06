import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';

@Injectable()
export class AcademicCalendarService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCalendarDto) {
    return this.prisma.academicCalendar.create({ data });
  }

  async findAll() {
    return this.prisma.academicCalendar.findMany({
      orderBy: { date: 'asc' },
    });
  }

  async remove(id: string) {
    return this.prisma.academicCalendar.delete({ where: { id } });
  }
}
