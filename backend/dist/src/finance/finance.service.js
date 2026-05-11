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
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FinanceService = class FinanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createFee(createFeeDto) {
        return this.prisma.fee.create({
            data: createFeeDto,
        });
    }
    async findAllFees(pagination, filters) {
        const page = pagination.page || 1;
        const limit = pagination.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.search) {
            where.name = { contains: filters.search };
        }
        if (filters.type) {
            where.type = filters.type;
        }
        const [data, total] = await Promise.all([
            this.prisma.fee.findMany({
                where,
                skip,
                take: limit,
            }),
            this.prisma.fee.count({ where }),
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
    async findOneFee(id) {
        const fee = await this.prisma.fee.findUnique({
            where: { id },
        });
        if (!fee)
            throw new common_1.NotFoundException(`Fee with ID ${id} not found`);
        return fee;
    }
    async updateFee(id, updateFeeDto) {
        return this.prisma.fee.update({
            where: { id },
            data: updateFeeDto,
        });
    }
    async removeFee(id) {
        return this.prisma.fee.delete({
            where: { id },
        });
    }
    async createPayment(createPaymentDto) {
        return this.prisma.payment.create({
            data: {
                ...createPaymentDto,
                date: createPaymentDto.date ? new Date(createPaymentDto.date) : new Date(),
            },
            include: {
                student: true,
                fee: true,
            },
        });
    }
    async findAllPayments(pagination, filters) {
        const page = pagination.page || 1;
        const limit = pagination.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.search) {
            where.student = {
                full_name: { contains: filters.search }
            };
        }
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.student_id) {
            where.student_id = filters.student_id;
        }
        const [data, total] = await Promise.all([
            this.prisma.payment.findMany({
                where,
                skip,
                take: limit,
                include: {
                    student: true,
                    fee: true,
                },
                orderBy: {
                    date: 'desc'
                }
            }),
            this.prisma.payment.count({ where }),
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
    async findOnePayment(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: {
                student: true,
                fee: true,
            },
        });
        if (!payment)
            throw new common_1.NotFoundException(`Payment with ID ${id} not found`);
        return payment;
    }
    async updatePayment(id, updatePaymentDto) {
        const data = { ...updatePaymentDto };
        if (updatePaymentDto.date) {
            data.date = new Date(updatePaymentDto.date);
        }
        return this.prisma.payment.update({
            where: { id },
            data,
            include: {
                student: true,
                fee: true,
            },
        });
    }
    async removePayment(id) {
        return this.prisma.payment.delete({
            where: { id },
        });
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinanceService);
//# sourceMappingURL=finance.service.js.map