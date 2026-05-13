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

  async getSummary(class_id?: string, month?: string) {
    const where: any = {};
    if (class_id) {
      where.schedule = { class_id };
    }
    if (month) {
      const [year, m] = month.split('-').map(Number);
      where.date = {
        gte: new Date(year, m - 1, 1),
        lt: new Date(year, m, 1),
      };
    }

    const attendances = await this.prisma.attendance.findMany({
      where,
      select: { status: true },
    });

    const total = attendances.length;
    const hadir = attendances.filter((a) => a.status === 'hadir').length;
    const sakit = attendances.filter((a) => a.status === 'sakit').length;
    const izin = attendances.filter((a) => a.status === 'izin').length;
    const alfa = attendances.filter((a) => a.status === 'alfa').length;

    return { total, hadir, sakit, izin, alfa };
  }

  async findBySchedule(scheduleId: string, date: Date) {
    return this.prisma.attendance.findMany({
      where: {
        schedule_id: scheduleId,
        date,
      },
      include: {
        student: true,
        schedule: {
          include: { subject: true, class: true, teacher: true },
        },
      },
    });
  }
}
