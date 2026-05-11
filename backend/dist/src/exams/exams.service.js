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
exports.ExamsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExamsService = class ExamsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const { questions, ...examData } = data;
        return this.prisma.exam.create({
            data: {
                ...examData,
                questions: questions ? {
                    create: questions.map((q) => ({
                        type: q.type,
                        question_text: q.question_text,
                        difficulty: q.difficulty,
                        options: q.options ? {
                            create: q.options
                        } : undefined
                    }))
                } : undefined
            },
            include: {
                questions: {
                    include: { options: true }
                }
            }
        });
    }
    async findAll(pagination, filters) {
        const page = pagination.page || 1;
        const limit = pagination.limit || 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.exam.findMany({
                where: filters,
                skip,
                take: limit,
                include: {
                    subject: true,
                    major: true,
                    _count: { select: { questions: true } }
                },
            }),
            this.prisma.exam.count({ where: filters }),
        ]);
        return {
            data,
            meta: { total, page, limit, last_page: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const exam = await this.prisma.exam.findUnique({
            where: { id },
            include: {
                subject: true,
                major: true,
                questions: {
                    include: { options: true }
                }
            },
        });
        if (!exam)
            throw new common_1.NotFoundException('Exam not found');
        return exam;
    }
    async addQuestion(examId, data) {
        const { options, ...questionData } = data;
        return this.prisma.question.create({
            data: {
                ...questionData,
                exam: { connect: { id: examId } },
                options: options ? {
                    create: options
                } : undefined
            },
            include: { options: true }
        });
    }
    async updateQuestion(questionId, data) {
        const { options, ...questionData } = data;
        if (options) {
            await this.prisma.questionOption.deleteMany({
                where: { question_id: questionId }
            });
        }
        return this.prisma.question.update({
            where: { id: questionId },
            data: {
                ...questionData,
                options: options ? {
                    create: options
                } : undefined
            },
            include: { options: true }
        });
    }
    async deleteQuestion(questionId) {
        return this.prisma.question.delete({
            where: { id: questionId }
        });
    }
};
exports.ExamsService = ExamsService;
exports.ExamsService = ExamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExamsService);
//# sourceMappingURL=exams.service.js.map