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
exports.MajorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MajorsService = class MajorsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createMajorDto) {
        return this.prisma.major.create({
            data: createMajorDto,
        });
    }
    async findAll(paginationDto, branchId) {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (branchId) {
            where.branch_id = branchId;
        }
        const [data, total] = await Promise.all([
            this.prisma.major.findMany({
                where,
                skip,
                take: limit,
                include: { branch: true },
                orderBy: { created_at: 'desc' },
            }),
            this.prisma.major.count({ where }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const major = await this.prisma.major.findUnique({
            where: { id },
        });
        if (!major)
            throw new common_1.NotFoundException(`Major with ID ${id} not found`);
        return major;
    }
    async update(id, updateMajorDto) {
        await this.findOne(id);
        return this.prisma.major.update({
            where: { id },
            data: updateMajorDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.major.delete({
            where: { id },
        });
    }
};
exports.MajorsService = MajorsService;
exports.MajorsService = MajorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MajorsService);
//# sourceMappingURL=majors.service.js.map