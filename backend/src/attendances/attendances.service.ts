import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BulkCreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendancesService {
  constructor(private prisma: PrismaService) {}

  async bulkCreate(data: BulkCreateAttendanceDto) {
    const records = data.attendances.map((a) => ({
      schedule_id: data.schedule_id,
      date: data.date,
      student_id: a.student_id,
      status: a.status,
    }));

    return this.prisma.attendance.createMany({
      data: records,
    });
  }

  async findByClass(classId: string, date: Date) {
    return this.prisma.attendance.findMany({
      where: {
        date,
        schedule: { class_id: classId },
      },
      include: {
        student: true,
        schedule: {
          include: { subject: true },
        },
      },
    });
  }
}
