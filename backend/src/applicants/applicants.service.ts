import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicantDto } from './dto/create-applicant.dto';

@Injectable()
export class ApplicantsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateApplicantDto) {
    return this.prisma.applicant.create({
      data: {
        ...data,
        birth_date: new Date(data.birth_date),
      },
    });
  }

  async findAll(query: any) {
    const { page = 1, limit = 10, search, status } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
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

  async findOne(id: string) {
    const applicant = await this.prisma.applicant.findUnique({ 
      where: { id },
      include: {
        major: true,
      }
    });
    if (!applicant) throw new NotFoundException(`Applicant with ID ${id} not found`);
    return applicant;
  }

  async update(id: string, data: any) {
    return this.prisma.applicant.update({
      where: { id },
      data: {
        ...data,
        birth_date: data.birth_date ? new Date(data.birth_date) : undefined,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.applicant.delete({ where: { id } });
  }

  async verify(id: string, status: string) {
    return this.update(id, { status });
  }
}
