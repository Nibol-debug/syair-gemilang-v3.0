"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const QRCode = __importStar(require("qrcode"));
let ApplicantsService = class ApplicantsService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(data) {
        const applicant = await this.prisma.applicant.create({
            data: {
                ...data,
                birth_date: new Date(data.birth_date),
            },
        });
        const adminUsers = await this.prisma.user.findMany({
            where: { role: { name: 'Administrator Utama' } },
        });
        await Promise.all(adminUsers.map((user) => this.notificationsService.createForUser(user.id, 'Pendaftar Baru', `${applicant.full_name} telah mendaftar sebagai siswa baru.`, 'ppdb', '/ppdb-admin')));
        return applicant;
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
    async acceptApplicant(id) {
        const applicant = await this.prisma.applicant.findUnique({
            where: { id },
            include: { major: true, student: true },
        });
        if (!applicant)
            throw new common_1.NotFoundException('Applicant not found');
        if (applicant.student)
            throw new Error('Applicant already converted to student');
        const activeBatch = await this.prisma.batch.findFirst({
            where: { is_active: true },
        });
        if (!activeBatch)
            throw new Error('No active batch found');
        const tempNis = 'REG-PENDING-' + applicant.id.substring(0, 8);
        const qrCodeBase64 = await QRCode.toDataURL(tempNis);
        const student = await this.prisma.student.create({
            data: {
                nik: applicant.nik || 'TEMP-' + applicant.id.substring(0, 8),
                nis: tempNis,
                full_name: applicant.full_name,
                gender: applicant.gender,
                birth_place: applicant.birth_place,
                birth_date: applicant.birth_date,
                address: applicant.address,
                latitude: applicant.latitude,
                longitude: applicant.longitude,
                phone: applicant.phone,
                email: applicant.email,
                status: 'pending_payment',
                major_id: applicant.major_id,
                branch_id: applicant.major.branch_id,
                batch_id: activeBatch.id,
                applicant_id: applicant.id,
                qr_code: qrCodeBase64,
                parents: {
                    create: {
                        father_name: applicant.father_name || '-',
                        mother_name: applicant.mother_name || '-',
                        phone: applicant.phone,
                        address: applicant.address,
                    }
                },
                histories: {
                    create: {
                        type: 'masuk',
                        description: 'Pendaftar diterima, menunggu pembayaran daftar ulang',
                        date: new Date(),
                    }
                }
            },
        });
        let fee = await this.prisma.fee.findFirst({
            where: { name: 'Biaya Daftar Ulang' },
        });
        if (!fee) {
            fee = await this.prisma.fee.create({
                data: {
                    name: 'Biaya Daftar Ulang',
                    amount: 1500000,
                    type: 'once',
                    description: 'Biaya daftar ulang untuk pendaftar baru',
                },
            });
        }
        await this.prisma.payment.create({
            data: {
                student_id: student.id,
                fee_id: fee.id,
                amount: fee.amount,
                method: 'transfer',
                status: 'pending',
            },
        });
        return this.prisma.applicant.update({
            where: { id },
            data: { status: 'accepted' },
        });
    }
};
exports.ApplicantsService = ApplicantsService;
exports.ApplicantsService = ApplicantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], ApplicantsService);
//# sourceMappingURL=applicants.service.js.map