import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
    // Get major_id and batch_id from class
    const studentClass = await this.prisma.class.findUnique({
      where: { id: createStudentDto.class_id },
    });

    if (!studentClass) {
      throw new NotFoundException(`Class with ID ${createStudentDto.class_id} not found`);
    }

    return this.prisma.student.create({
      data: {
        ...createStudentDto,
        major_id: studentClass.major_id,
        batch_id: studentClass.batch_id,
      },
    });
  }

  async findAll(pagination: PaginationDto, filters: { class_id?: string; major_id?: string; batch_id?: string }) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.student.findMany({
        where: filters,
        skip,
        take: limit,
        include: {
          class: true,
          major: true,
          batch: true,
        },
      }),
      this.prisma.student.count({ where: filters }),
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
      },
    });
    if (!student) throw new NotFoundException(`Student with ID ${id} not found`);
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const data: any = { ...updateStudentDto };

    if (updateStudentDto.class_id) {
      const studentClass = await this.prisma.class.findUnique({
        where: { id: updateStudentDto.class_id },
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
}
