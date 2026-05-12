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
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EmployeesService = class EmployeesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createEmployeeDto) {
        return this.prisma.employee.create({
            data: createEmployeeDto,
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
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map