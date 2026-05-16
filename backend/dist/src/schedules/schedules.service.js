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
exports.SchedulesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SchedulesService = class SchedulesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkClash(data, excludeId) {
        if (!data.teacher_id || !data.class_id || !data.day || !data.start_time || !data.end_time)
            return;
        const whereTeacher = {
            teacher_id: data.teacher_id,
            day: data.day,
            OR: [
                { start_time: { lte: data.start_time }, end_time: { gt: data.start_time } },
                { start_time: { lt: data.end_time }, end_time: { gte: data.end_time } },
            ],
        };
        if (excludeId)
            whereTeacher.id = { not: excludeId };
        const teacherClash = await this.prisma.schedule.findFirst({ where: whereTeacher });
        if (teacherClash) {
            throw new common_1.BadRequestException('Teacher already has a schedule at this time');
        }
        const whereClass = {
            class_id: data.class_id,
            day: data.day,
            OR: [
                { start_time: { lte: data.start_time }, end_time: { gt: data.start_time } },
                { start_time: { lt: data.end_time }, end_time: { gte: data.end_time } },
            ],
        };
        if (excludeId)
            whereClass.id = { not: excludeId };
        const classClash = await this.prisma.schedule.findFirst({ where: whereClass });
        if (classClash) {
            throw new common_1.BadRequestException('Class already has a schedule at this time');
        }
    }
    async create(data) {
        await this.checkClash(data);
        return this.prisma.schedule.create({
            data,
            include: { class: true, subject: true, teacher: true },
        });
    }
    async findAll(filters) {
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
    async findOne(id) {
        const schedule = await this.prisma.schedule.findUnique({
            where: { id },
            include: { class: true, subject: true, teacher: true },
        });
        if (!schedule)
            throw new common_1.NotFoundException('Schedule not found');
        return schedule;
    }
    async update(id, data) {
        await this.findOne(id);
        await this.checkClash(data, id);
        return this.prisma.schedule.update({
            where: { id },
            data,
            include: { class: true, subject: true, teacher: true },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.schedule.delete({ where: { id } });
    }
};
exports.SchedulesService = SchedulesService;
exports.SchedulesService = SchedulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SchedulesService);
//# sourceMappingURL=schedules.service.js.map