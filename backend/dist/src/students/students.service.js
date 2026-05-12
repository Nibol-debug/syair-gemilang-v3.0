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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const QRCode = __importStar(require("qrcode"));
const ExcelJS = __importStar(require("exceljs"));
let StudentsService = class StudentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createStudentDto) {
        const { parents, ...studentData } = createStudentDto;
        if (studentData.class_id) {
            const selectedClass = await this.prisma.class.findUnique({
                where: { id: studentData.class_id },
                include: { major: true }
            });
            if (!selectedClass) {
                throw new common_1.NotFoundException(`Class with ID ${studentData.class_id} not found`);
            }
            studentData.major_id = selectedClass.major_id;
            studentData.batch_id = selectedClass.batch_id;
            studentData.branch_id = selectedClass.major.branch_id;
        }
        const qrCodeBase64 = await QRCode.toDataURL(studentData.nis);
        return this.prisma.student.create({
            data: {
                ...studentData,
                qr_code: qrCodeBase64,
                parents: parents ? {
                    create: parents
                } : undefined,
                histories: {
                    create: {
                        type: 'masuk',
                        description: 'Siswa baru terdaftar',
                        date: new Date(),
                    }
                }
            },
            include: {
                parents: true,
                histories: true,
            }
        });
    }
    async findAll(pagination, filters) {
        const page = pagination.page || 1;
        const limit = pagination.limit || 10;
        const skip = (page - 1) * limit;
        const where = { ...filters };
        if (filters.search) {
            where.OR = [
                { full_name: { contains: filters.search } },
                { nis: { contains: filters.search } },
            ];
            delete where.search;
        }
        const [data, total] = await Promise.all([
            this.prisma.student.findMany({
                where,
                skip,
                take: limit,
                include: {
                    class: true,
                    major: true,
                    batch: true,
                    branch: true,
                    parents: true,
                },
            }),
            this.prisma.student.count({ where }),
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
                branch: true,
                parents: true,
                histories: true,
            },
        });
        if (!student)
            throw new common_1.NotFoundException(`Student with ID ${id} not found`);
        return student;
    }
    async update(id, updateStudentDto) {
        const { parents, ...studentData } = updateStudentDto;
        const currentStudent = await this.prisma.student.findUnique({ where: { id } });
        if (!currentStudent)
            throw new common_1.NotFoundException(`Student with ID ${id} not found`);
        const data = { ...studentData };
        if (studentData.class_id) {
            const selectedClass = await this.prisma.class.findUnique({
                where: { id: studentData.class_id },
                include: { major: true }
            });
            if (!selectedClass) {
                throw new common_1.NotFoundException(`Class with ID ${studentData.class_id} not found`);
            }
            data.major_id = selectedClass.major_id;
            data.batch_id = selectedClass.batch_id;
            data.branch_id = selectedClass.major.branch_id;
        }
        if (studentData.nis && studentData.nis !== currentStudent.nis) {
            data.qr_code = await QRCode.toDataURL(studentData.nis);
        }
        if (parents) {
            data.parents = {
                deleteMany: {},
                create: parents,
            };
        }
        if (studentData.status && studentData.status !== currentStudent.status) {
            data.histories = {
                create: {
                    type: studentData.status,
                    description: `Status diubah dari ${currentStudent.status} ke ${studentData.status}`,
                    date: new Date(),
                }
            };
        }
        return this.prisma.student.update({
            where: { id },
            data,
            include: { parents: true, histories: true, branch: true }
        });
    }
    async remove(id) {
        return this.prisma.student.delete({
            where: { id },
        });
    }
    async exportToExcel(res) {
        const students = await this.prisma.student.findMany({
            include: {
                class: true,
                major: true,
                batch: true,
                branch: true,
            }
        });
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Students');
        worksheet.columns = [
            { header: 'NIS', key: 'nis', width: 15 },
            { header: 'Full Name', key: 'full_name', width: 30 },
            { header: 'Branch', key: 'branch', width: 15 },
            { header: 'Class', key: 'class', width: 15 },
            { header: 'Major', key: 'major', width: 25 },
            { header: 'Batch', key: 'batch', width: 10 },
            { header: 'Status', key: 'status', width: 10 },
        ];
        students.forEach(s => {
            worksheet.addRow({
                nis: s.nis,
                full_name: s.full_name,
                branch: s.branch?.name || '-',
                class: s.class?.name || '-',
                major: s.major?.name || '-',
                batch: s.batch?.name || '-',
                status: s.status,
            });
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    }
    async importFromExcel(file) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);
        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
            throw new Error('Worksheet not found');
        }
        const rows = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1)
                rows.push(row);
        });
        let count = 0;
        for (const row of rows) {
            const nis = row.getCell(1).value?.toString();
            const full_name = row.getCell(2).value?.toString();
            const branchName = row.getCell(3).value?.toString();
            const className = row.getCell(4).value?.toString();
            const email = row.getCell(5).value?.toString() || `${nis}@school.com`;
            if (nis && full_name && className) {
                const studentClass = await this.prisma.class.findFirst({
                    where: { name: className },
                    include: { major: true }
                });
                if (studentClass) {
                    await this.prisma.student.upsert({
                        where: { nis },
                        update: {
                            full_name,
                            branch_id: studentClass.major.branch_id,
                            class_id: studentClass.id,
                            major_id: studentClass.major_id,
                            batch_id: studentClass.batch_id
                        },
                        create: {
                            nis,
                            nik: nis,
                            full_name,
                            email,
                            gender: 'L',
                            birth_place: '-',
                            birth_date: new Date(),
                            address: '-',
                            phone: '-',
                            branch_id: studentClass.major.branch_id,
                            class_id: studentClass.id,
                            major_id: studentClass.major_id,
                            batch_id: studentClass.batch_id,
                            status: 'active',
                            qr_code: await QRCode.toDataURL(nis),
                        }
                    });
                    count++;
                }
            }
        }
        return { imported: count };
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentsService);
//# sourceMappingURL=students.service.js.map