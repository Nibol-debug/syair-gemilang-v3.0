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
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let EmployeesService = class EmployeesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createEmployeeDto) {
        return this.prisma.$transaction(async (tx) => {
            const employee = await tx.employee.create({
                data: createEmployeeDto,
            });
            try {
                let roleName = 'Guru Mata Pelajaran';
                const posLower = createEmployeeDto.position?.toLowerCase() || '';
                if (posLower.includes('bendahara') || posLower.includes('tu')) {
                    roleName = 'Bendahara';
                }
                else if (posLower.includes('sarpras') || posLower.includes('inventaris')) {
                    roleName = 'Staf Sarpras';
                }
                else if (posLower.includes('kepala')) {
                    roleName = 'Kepala Sekolah';
                }
                else if (posLower.includes('wali')) {
                    roleName = 'Wali Kelas';
                }
                const role = await tx.role.findUnique({ where: { name: roleName } });
                if (role) {
                    const baseName = createEmployeeDto.full_name
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, '')
                        .substring(0, 15);
                    const suffix = Math.floor(10 + Math.random() * 90);
                    const username = `${baseName}${suffix}`;
                    const hashedPassword = await bcrypt.hash('rgi123', 10);
                    await tx.user.create({
                        data: {
                            username,
                            password_hash: hashedPassword,
                            role_id: role.id,
                            employee_id: employee.id,
                        },
                    });
                }
            }
            catch (err) {
                console.error('Auto-create user for employee failed:', err);
            }
            return employee;
        });
    }
    async findAll(pagination, filters) {
        const page = pagination.page || 1;
        const limit = pagination.limit || 10;
        const skip = (page - 1) * limit;
        const where = { ...filters };
        if (filters.search) {
            where.full_name = { contains: filters.search };
            delete where.search;
        }
        const [data, total] = await Promise.all([
            this.prisma.employee.findMany({
                where,
                skip,
                take: limit,
                include: {
                    major: true,
                },
            }),
            this.prisma.employee.count({ where }),
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
        const employee = await this.prisma.employee.findUnique({
            where: { id },
            include: {
                major: true,
                documents: true,
                attendance: true,
            },
        });
        if (!employee)
            throw new common_1.NotFoundException(`Employee with ID ${id} not found`);
        return employee;
    }
    async update(id, updateEmployeeDto) {
        return this.prisma.employee.update({
            where: { id },
            data: updateEmployeeDto,
        });
    }
    async remove(id) {
        return this.prisma.employee.delete({
            where: { id },
        });
    }
    async addDocument(employeeId, fileUrl, type) {
        return this.prisma.employeeDocument.create({
            data: {
                employee_id: employeeId,
                file_url: fileUrl,
                type: type,
            },
        });
    }
    async getAttendanceByDate(dateStr) {
        const date = new Date(dateStr);
        date.setHours(0, 0, 0, 0);
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        const employees = await this.prisma.employee.findMany({
            include: {
                attendance: {
                    where: {
                        date: {
                            gte: date,
                            lt: nextDay,
                        },
                    },
                },
                major: true,
            },
            orderBy: { full_name: 'asc' },
        });
        return employees.map(emp => ({
            id: emp.id,
            full_name: emp.full_name,
            position: emp.position,
            major: emp.major?.code || 'STAF',
            status: emp.attendance[0]?.status || '',
        }));
    }
    async recordBulkAttendance(dateStr, records) {
        const date = new Date(dateStr);
        date.setHours(0, 0, 0, 0);
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        const validRecords = records.filter(r => r.status);
        return this.prisma.$transaction(async (tx) => {
            await tx.employeeAttendance.deleteMany({
                where: {
                    date: {
                        gte: date,
                        lt: nextDay,
                    },
                    employee_id: {
                        in: validRecords.map(r => r.employee_id)
                    }
                }
            });
            if (validRecords.length > 0) {
                await tx.employeeAttendance.createMany({
                    data: validRecords.map(r => ({
                        employee_id: r.employee_id,
                        status: r.status,
                        date: date,
                    }))
                });
            }
            return { count: validRecords.length };
        });
    }
    async recordSelfAttendance(employeeId) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        const existing = await this.prisma.employeeAttendance.findFirst({
            where: {
                employee_id: employeeId,
                date: {
                    gte: date,
                    lt: nextDay,
                },
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Anda sudah melakukan presensi hari ini.');
        }
        return this.prisma.employeeAttendance.create({
            data: {
                employee_id: employeeId,
                status: 'Hadir',
                date: date,
            },
        });
    }
    async getMonthlyAttendance(monthStr) {
        const [year, month] = monthStr.split('-').map(Number);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        const attendances = await this.prisma.employeeAttendance.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        const employees = await this.prisma.employee.findMany({
            include: { major: true }
        });
        return employees.map(emp => {
            const empAtt = attendances.filter(a => a.employee_id === emp.id);
            return {
                id: emp.id,
                full_name: emp.full_name,
                position: emp.position,
                major: emp.major?.code || 'STAF',
                hadir: empAtt.filter(a => a.status === 'Hadir').length,
                izin: empAtt.filter(a => a.status === 'Izin' || a.status === 'Sakit').length,
                alpa: empAtt.filter(a => a.status === 'Alpa').length,
                total_days: empAtt.length,
            };
        });
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map