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
exports.BatchesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BatchesService = class BatchesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createBatchDto) {
        return this.prisma.batch.create({
            data: createBatchDto,
        });
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.batch.findMany({
                skip,
                take: limit,
                orderBy: { start_date: 'desc' },
            }),
            this.prisma.batch.count(),
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
        const batch = await this.prisma.batch.findUnique({
            where: { id },
        });
        if (!batch)
            throw new common_1.NotFoundException(`Batch with ID ${id} not found`);
        return batch;
    }
    async update(id, updateBatchDto) {
        const batch = await this.findOne(id);
        if (batch.is_active === true && updateBatchDto.is_active === false) {
            await this.prisma.student.updateMany({
                where: { batch_id: id, status: 'active' },
                data: { status: 'alumni' },
            });
        }
        return this.prisma.batch.update({
            where: { id },
            data: updateBatchDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.batch.delete({
            where: { id },
        });
    }
};
exports.BatchesService = BatchesService;
exports.BatchesService = BatchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BatchesService);
//# sourceMappingURL=batches.service.js.map