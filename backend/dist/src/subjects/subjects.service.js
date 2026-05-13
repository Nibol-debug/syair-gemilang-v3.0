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
exports.SubjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SubjectsService = class SubjectsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.subject.create({ data });
    }
    async findAll(pagination, major_id) {
        const page = pagination.page || 1;
        const limit = pagination.limit || 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.subject.findMany({
                where: { major_id },
                skip,
                take: limit,
                include: { major: true },
            }),
            this.prisma.subject.count({ where: { major_id } }),
        ]);
        return {
            data,
            meta: { total, page, limit, last_page: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const subject = await this.prisma.subject.findUnique({
            where: { id },
            include: { major: true },
        });
        if (!subject)
            throw new common_1.NotFoundException('Subject not found');
        return subject;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.subject.update({
            where: { id },
            data,
            include: { major: true },
        });
    }
    async remove(id) {
        return this.prisma.subject.delete({ where: { id } });
    }
};
exports.SubjectsService = SubjectsService;
exports.SubjectsService = SubjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubjectsService);
//# sourceMappingURL=subjects.service.js.map