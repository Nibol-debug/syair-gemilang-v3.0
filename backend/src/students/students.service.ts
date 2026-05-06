import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import * as QRCode from 'qrcode';
import * as ExcelJS from 'exceljs';
import type { Response } from 'express';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
    const { parents, ...studentData } = createStudentDto;

    // Get major_id and batch_id from class
    const studentClass = await this.prisma.class.findUnique({
      where: { id: studentData.class_id },
    });

    if (!studentClass) {
      throw new NotFoundException(`Class with ID ${studentData.class_id} not found`);
    }

    // Generate QR Code content (NIS)
    const qrCodeBase64 = await QRCode.toDataURL(studentData.nis);

    return this.prisma.student.create({
      data: {
        ...studentData,
        major_id: studentClass.major_id,
        batch_id: studentClass.batch_id,
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

  async findAll(pagination: PaginationDto, filters: { class_id?: string; major_id?: string; batch_id?: string; search?: string }) {
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
        parents: true,
        histories: true,
      },
    });
    if (!student) throw new NotFoundException(`Student with ID ${id} not found`);
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const { parents, ...studentData } = updateStudentDto;
    const data: any = { ...studentData };

    if (studentData.class_id) {
      const studentClass = await this.prisma.class.findUnique({
        where: { id: studentData.class_id },
      });
      if (!studentClass) throw new NotFoundException('Class not found');
      data.major_id = studentClass.major_id;
      data.batch_id = studentClass.batch_id;
    }

    return this.prisma.student.update({
      where: { id },
      data,
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
      }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');

    worksheet.columns = [
      { header: 'NIS', key: 'nis', width: 15 },
      { header: 'Full Name', key: 'full_name', width: 30 },
      { header: 'Class', key: 'class', width: 15 },
      { header: 'Major', key: 'major', width: 15 },
      { header: 'Status', key: 'status', width: 10 },
    ];

    students.forEach(s => {
      worksheet.addRow({
        nis: s.nis,
        full_name: s.full_name,
        class: s.class.name,
        major: s.major.name,
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
      const className = row.getCell(3).value?.toString();
      const email = row.getCell(4).value?.toString() || `${nis}@school.com`;

      if (nis && full_name && className) {
        const studentClass = await this.prisma.class.findFirst({ where: { name: className } });
        if (studentClass) {
          await this.prisma.student.upsert({
            where: { nis },
            update: { full_name, class_id: studentClass.id },
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
