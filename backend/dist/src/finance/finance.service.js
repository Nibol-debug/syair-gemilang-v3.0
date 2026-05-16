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
const notifications_service_1 = require("../notifications/notifications.service");
const students_service_1 = require("../students/students.service");
let FinanceService = class FinanceService {
    prisma;
    studentsService;
    notificationsService;
    constructor(prisma, studentsService, notificationsService) {
        this.prisma = prisma;
        this.studentsService = studentsService;
        this.notificationsService = notificationsService;
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
        const paymentCount = await this.prisma.payment.count({
            where: { fee_id: id },
        });
        if (paymentCount > 0) {
            throw new common_1.ConflictException(`Fee memiliki ${paymentCount} pembayaran terkait. Hapus pembayaran terlebih dahulu.`);
        }
        return this.prisma.fee.delete({
            where: { id },
        });
    }
    async createPayment(createPaymentDto) {
        const paymentDate = createPaymentDto.date ? new Date(createPaymentDto.date) : new Date();
        paymentDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(paymentDate);
        nextDay.setDate(paymentDate.getDate() + 1);
        const existingPayment = await this.prisma.payment.findFirst({
            where: {
                student_id: createPaymentDto.student_id,
                fee_id: createPaymentDto.fee_id,
                date: {
                    gte: paymentDate,
                    lt: nextDay,
                },
            },
        });
        if (existingPayment) {
            throw new Error('Pembayaran untuk siswa dan jenis biaya ini pada tanggal yang sama sudah ada.');
        }
        const payment = await this.prisma.payment.create({
            data: {
                ...createPaymentDto,
                date: paymentDate,
            },
            include: {
                student: true,
                fee: true,
            },
        });
        try {
            const user = await this.prisma.user.findFirst({
                where: { student_id: payment.student_id },
            });
            if (user) {
                await this.notificationsService.createForUser(user.id, 'Pembayaran Baru', `Pembayaran ${payment.fee.name} sebesar Rp ${Number(payment.amount).toLocaleString()} telah dicatatkan.`, 'payment', '/finance');
            }
        }
        catch (err) {
            console.error('Failed to create notification for payment:', err);
        }
        return payment;
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
        const currentPayment = await this.prisma.payment.findUnique({
            where: { id },
            include: { student: true, fee: true },
        });
        if (!currentPayment)
            throw new common_1.NotFoundException(`Payment with ID ${id} not found`);
        const updatedPayment = await this.prisma.payment.update({
            where: { id },
            data,
            include: {
                student: true,
                fee: true,
            },
        });
        try {
            if (currentPayment.status !== 'success' && updatedPayment.status === 'success') {
                const user = await this.prisma.user.findFirst({
                    where: { student_id: updatedPayment.student_id },
                });
                if (user) {
                    await this.notificationsService.createForUser(user.id, 'Pembayaran Berhasil', `Pembayaran ${updatedPayment.fee.name} sebesar Rp ${Number(updatedPayment.amount).toLocaleString()} telah berhasil dikonfirmasi.`, 'payment', '/finance');
                }
            }
        }
        catch (err) {
            console.error('Failed to create notification for payment status change:', err);
        }
        if (updatedPayment.status === 'success' && updatedPayment.fee.name === 'Biaya Daftar Ulang') {
            await this.studentsService.finalizeRegistration(updatedPayment.student_id);
        }
        return updatedPayment;
    }
    async removePayment(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
        });
        if (!payment)
            throw new common_1.NotFoundException(`Payment with ID ${id} not found`);
        return this.prisma.payment.delete({
            where: { id },
        });
    }
    async sendPaymentReminders() {
        const pendingPayments = await this.prisma.payment.findMany({
            where: { status: 'pending' },
            include: { student: true, fee: true },
        });
        let notified = 0;
        for (const payment of pendingPayments) {
            const user = await this.prisma.user.findFirst({
                where: { student_id: payment.student_id },
            });
            if (user) {
                await this.notificationsService.createForUser(user.id, 'Pengingat Pembayaran', `Pembayaran ${payment.fee.name} sebesar Rp ${Number(payment.amount).toLocaleString()} masih tertunggak. Segera lunasi.`, 'payment', '/finance');
                notified++;
            }
        }
        return { notified, total_pending: pendingPayments.length };
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        students_service_1.StudentsService,
        notifications_service_1.NotificationsService])
], FinanceService);
//# sourceMappingURL=finance.service.js.map