import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalStudents,
      totalEmployees,
      applicantPPDB,
      ongoingExams,
      todayAttendance,
      totalPayments,
      totalFees,
      totalAssets,
      systemUsers,
    ] = await Promise.all([
      this.prisma.student.count({ where: { status: 'active' } }),
      this.prisma.employee.count(),
      this.prisma.applicant.count(),
      this.prisma.examSession.count({ where: { status: 'ongoing' } }),
      this.prisma.attendance.count({
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
          status: 'present',
        },
      }),
      this.prisma.payment.count({ where: { status: 'success' } }),
      this.prisma.fee.count(),
      this.prisma.asset.count(),
      this.prisma.user.count(),
    ]);

    const attendancePercentage = totalStudents > 0 ? (todayAttendance / totalStudents) * 100 : 0;
    const paymentPercentage = totalStudents > 0 ? (totalPayments / totalStudents) * 100 : 0;

    const majors = await this.prisma.major.findMany({
      include: { _count: { select: { students: true } } },
    });

    const majorDistribution = majors.map(m => ({
      name: m.code,
      value: m._count.students,
      color: this.getRandomColor(m.code),
    }));

    return {
      overview: {
        totalStudents,
        totalEmployees,
        applicantPPDB,
        ongoingExams,
        todayAttendance,
        attendancePercentage: Math.round(attendancePercentage),
        totalPayments,
        paymentPercentage: Math.round(paymentPercentage),
        totalAssets,
        systemUsers,
      },
      majorDistribution,
    };
  }

  private getRandomColor(seed: string) {
    const colors = ['#1e40af', '#173bab', '#3755c3', '#4f46e5', '#6366f1'];
    const index = seed.length % colors.length;
    return colors[index];
  }

  async getStudentStats() {
    const [total, male, female, active, alumni, moved] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.student.count({ where: { gender: 'L' } }),
      this.prisma.student.count({ where: { gender: 'P' } }),
      this.prisma.student.count({ where: { status: 'active' } }),
      this.prisma.student.count({ where: { status: 'alumni' } }),
      this.prisma.student.count({ where: { status: 'moved' } }),
    ]);

    return { total, male, female, active, alumni, moved };
  }
  async getEmployeeStats() {
    const [total, teachers, staff] = await Promise.all([
      this.prisma.employee.count(),
      this.prisma.employee.count({ where: { position: { contains: 'Guru' } } }),
      this.prisma.employee.count({ where: { NOT: { position: { contains: 'Guru' } } } }),
    ]);

    return { total, teachers, staff };
  }
}
