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
exports.ApplicantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ApplicantsService = class ApplicantsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.applicant.create({
            data: {
                ...data,
                birth_date: new Date(data.birth_date),
            },
        });
    }
    async findAll(query) {
        const { page = 1, limit = 10, search, status } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { full_name: { contains: search } },
                { email: { contains: search } },
            ];
        }
        if (status) {
            where.status = status;
        }
        const [data, total] = await Promise.all([
            this.prisma.applicant.findMany({
                where,
                skip,
                take: Number(limit),
                include: {
                    major: true,
                },
                orderBy: { created_at: 'desc' },
            }),
            this.prisma.applicant.count({ where }),
        ]);
        return {
            data,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                last_page: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const applicant = await this.prisma.applicant.findUnique({
            where: { id },
            include: {
                major: true,
            }
        });
        if (!applicant)
            throw new common_1.NotFoundException(`Applicant with ID ${id} not found`);
        return applicant;
    }
    async update(id, data) {
        return this.prisma.applicant.update({
            where: { id },
            data: {
                ...data,
                birth_date: data.birth_date ? new Date(data.birth_date) : undefined,
            },
        });
    }
    async remove(id) {
        return this.prisma.applicant.delete({ where: { id } });
    }
    async verify(id, status) {
        return this.update(id, { status });
    }
};
exports.ApplicantsService = ApplicantsService;
exports.ApplicantsService = ApplicantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApplicantsService);
//# sourceMappingURL=applicants.service.js.map