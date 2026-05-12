import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: createEmployeeDto,
    });
  }

  async findAll(pagination: PaginationDto, filters: { major_id?: string; search?: string }) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { ...filters };
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

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        major: true,
        documents: true,
        attendance: true,
      },
    });
    if (!employee) throw new NotFoundException(`Employee with ID ${id} not found`);
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    return this.prisma.employee.update({
      where: { id },
      data: updateEmployeeDto,
    });
  }

  async remove(id: string) {
    return this.prisma.employee.delete({
      where: { id },
    });
  }

  async addDocument(employeeId: string, fileUrl: string, type: string) {
    return this.prisma.employeeDocument.create({
      data: {
        employee_id: employeeId,
        file_url: fileUrl,
        type: type,
      },
    });
  }

  async getAttendanceByDate(dateStr: string) {
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
      status: emp.attendance[0]?.status || '', // Get status for that specific day if exists
    }));
  }

  async recordBulkAttendance(dateStr: string, records: { employee_id: string; status: string }[]) {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    // Filter out records without status
    const validRecords = records.filter(r => r.status);

    return this.prisma.$transaction(async (tx) => {
      // 1. Delete existing records for these employees on this date
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

      // 2. Create new records
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
}
