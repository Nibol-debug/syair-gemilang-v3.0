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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StudentsService = class StudentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createStudentDto) {
        const studentClass = await this.prisma.class.findUnique({
            where: { id: createStudentDto.class_id },
        });
        if (!studentClass) {
            throw new common_1.NotFoundException(`Class with ID ${createStudentDto.class_id} not found`);
        }
        return this.prisma.student.create({
            data: {
                ...createStudentDto,
                major_id: studentClass.major_id,
                batch_id: studentClass.batch_id,
            },
        });
    }
    async findAll(pagination, filters) {
        const page = pagination.page || 1;
        const limit = pagination.limit || 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.student.findMany({
                where: filters,
                skip,
                take: limit,
                include: {
                    class: true,
                    major: true,
                    batch: true,
                },
            }),
            this.prisma.student.count({ where: filters }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                last_page: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const student = await this.prisma.student.findUnique({
            where: { id },
            include: {
                class: true,
                major: true,
                batch: true,
                parents: true,
            },
        });
        if (!student)
            throw new common_1.NotFoundException(`Student with ID ${id} not found`);
        return student;
    }
    async update(id, updateStudentDto) {
        const data = { ...updateStudentDto };
        if (updateStudentDto.class_id) {
            const studentClass = await this.prisma.class.findUnique({
                where: { id: updateStudentDto.class_id },
            });
            if (!studentClass)
                throw new common_1.NotFoundException('Class not found');
            data.major_id = studentClass.major_id;
            data.batch_id = studentClass.batch_id;
        }
        return this.prisma.student.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return this.prisma.student.delete({
            where: { id },
        });
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentsService);
//# sourceMappingURL=students.service.js.map