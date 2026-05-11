"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StatsService = class StatsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const [totalStudents, totalEmployees, applicantPPDB, ongoingExams, todayAttendance, totalPayments, totalFees, totalAssets, systemUsers,] = await Promise.all([
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
    getRandomColor(seed) {
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
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StatsService);
//# sourceMappingURL=stats.service.js.map