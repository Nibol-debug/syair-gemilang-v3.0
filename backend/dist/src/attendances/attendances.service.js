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
exports.AttendancesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AttendancesService = class AttendancesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async bulkCreate(data) {
        await this.prisma.attendance.deleteMany({
            where: {
                schedule_id: data.schedule_id,
                date: data.date,
            },
        });
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
    async findByClass(classId, date) {
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
    async getSummary(class_id, month) {
        const where = {};
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
    async findBySchedule(scheduleId, date) {
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
};
exports.AttendancesService = AttendancesService;
exports.AttendancesService = AttendancesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendancesService);
//# sourceMappingURL=attendances.service.js.map