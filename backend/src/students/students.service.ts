import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import * as QRCode from 'qrcode';
import * as ExcelJS from 'exceljs';
import * as bcrypt from 'bcrypt';
import type { Response } from 'express';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async finalizeRegistration(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: { applicant: true, major: true, batch: true },
    });

    if (!student) throw new NotFoundException('Student not found');
    if (student.status === 'active') return student;

    // Generate real NIS: e.g., BatchYear + MajorCode + RandomSuffix
    const year = student.batch.start_date.getFullYear().toString().substring(2);
    const majorCode = student.major.code.replace(/[^A-Z]/g, '').substring(0, 3);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    const finalNis = `${year}${majorCode}${randomSuffix}`;

    // Create User account
    const hashedPassword = await bcrypt.hash('rgi123', 10);
    const studentRole = await this.prisma.role.findUnique({ where: { name: 'Siswa' } });
    
    if (studentRole) {
      await this.prisma.user.upsert({
        where: { username: finalNis },
        update: {
          student_id: student.id,
          role_id: studentRole.id,
        },
        create: {
          username: finalNis,
          password_hash: hashedPassword,
          role_id: studentRole.id,
          student_id: student.id,
        },
      });
    }

    // Update Student
    const updatedStudent = await this.prisma.student.update({
      where: { id },
      data: {
        nis: finalNis,
        status: 'active',
        qr_code: await QRCode.toDataURL(finalNis),
        histories: {
          create: {
            type: 'active',
            description: 'Pendaftaran difinalisasi. NIS diterbitkan.',
            date: new Date(),
          }
        }
      },
    });

    // Update Applicant status
    if (student.applicant_id) {
      await this.prisma.applicant.update({
        where: { id: student.applicant_id },
        data: { status: 'registered' },
      });
    }

    return updatedStudent;
  }

  async create(createStudentDto: CreateStudentDto) {
    const { parents, ...studentData } = createStudentDto;

    // Force major_id and batch_id to follow class if class_id is provided
    if (studentData.class_id) {
      const selectedClass = await this.prisma.class.findUnique({
        where: { id: studentData.class_id },
        include: { major: true }
      });
      
      if (!selectedClass) {
        throw new NotFoundException(`Class with ID ${studentData.class_id} not found`);
      }

      studentData.major_id = selectedClass.major_id;
      studentData.batch_id = selectedClass.batch_id;
      studentData.branch_id = selectedClass.major.branch_id;
    }

    // If still missing required IDs, try to fill from first available
    if (!studentData.branch_id || !studentData.major_id || !studentData.batch_id) {
      // Try to get defaults from the first available class or major
      const firstClass = await this.prisma.class.findFirst({ include: { major: true } });
      if (firstClass) {
        if (!studentData.branch_id) studentData.branch_id = firstClass.major.branch_id;
        if (!studentData.major_id) studentData.major_id = firstClass.major_id;
        if (!studentData.batch_id) studentData.batch_id = firstClass.batch_id;
      } else {
        // Fallback: get first branch, major, batch separately
        if (!studentData.branch_id) {
          const branch = await this.prisma.branch.findFirst();
          if (branch) studentData.branch_id = branch.id;
        }
        if (!studentData.major_id) {
          const major = await this.prisma.major.findFirst();
          if (major) studentData.major_id = major.id;
        }
        if (!studentData.batch_id) {
          const batch = await this.prisma.batch.findFirst();
          if (batch) studentData.batch_id = batch.id;
        }
      }
    }

    // Generate QR Code content (NIS)
    const qrCodeBase64 = await QRCode.toDataURL(studentData.nis);

    return this.prisma.$transaction(async (tx) => {
      const student = await tx.student.create({
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
        } as any,
        include: {
          parents: true,
          histories: true,
        }
      });

      // Auto-create user account for student
      try {
        const studentRole = await tx.role.findUnique({ where: { name: 'Siswa' } });
        if (studentRole) {
          const hashedPassword = await bcrypt.hash('rgi123', 10);
          await tx.user.upsert({
            where: { username: studentData.nis },
            update: {
              student_id: student.id,
              role_id: studentRole.id,
            },
            create: {
              username: studentData.nis,
              password_hash: hashedPassword,
              role_id: studentRole.id,
              student_id: student.id,
            },
          });
        }
      } catch (err) {
        console.error('Auto-create user for student failed:', err);
      }

      return student;
    });
  }

  async findAll(pagination: PaginationDto, filters: { class_id?: string; major_id?: string; batch_id?: string; branch_id?: string; search?: string }) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { ...filters };
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

  async findOne(id: string) {
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
    if (!student) throw new NotFoundException(`Student with ID ${id} not found`);
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const { parents, ...studentData } = updateStudentDto;
    
    // Get current student to check status change
    const currentStudent = await this.prisma.student.findUnique({ where: { id } });
    if (!currentStudent) throw new NotFoundException(`Student with ID ${id} not found`);

    const data: any = { ...studentData };

    // Force major_id and batch_id to follow class if class_id is provided or changed
    if (studentData.class_id) {
      const selectedClass = await this.prisma.class.findUnique({
        where: { id: studentData.class_id },
        include: { major: true }
      });
      
      if (!selectedClass) {
        throw new NotFoundException(`Class with ID ${studentData.class_id} not found`);
      }

      data.major_id = selectedClass.major_id;
      data.batch_id = selectedClass.batch_id;
      data.branch_id = selectedClass.major.branch_id;
    }

    // Regenerate QR Code if NIS changed
    if (studentData.nis && studentData.nis !== currentStudent.nis) {
      data.qr_code = await QRCode.toDataURL(studentData.nis);
    }

    if (parents) {
      data.parents = {
        deleteMany: {},
        create: parents,
      };
    }

    // Add history if status changed
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

  async remove(id: string) {
    return this.prisma.student.delete({
      where: { id },
    });
  }

  async exportToExcel(res: Response) {
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

  async importFromExcel(file: Express.Multer.File) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer as any);
    const worksheet = workbook.getWorksheet(1);
    
    if (!worksheet) {
      throw new Error('Worksheet not found');
    }

    const rows: ExcelJS.Row[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) rows.push(row);
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
}
