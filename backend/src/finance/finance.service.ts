import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeeDto } from './dto/create-fee.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  // Fees
  async createFee(createFeeDto: CreateFeeDto) {
    return this.prisma.fee.create({
      data: createFeeDto,
    });
  }

  async findAllFees(pagination: PaginationDto, filters: { search?: string; type?: string }) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
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

  async findOneFee(id: string) {
    const fee = await this.prisma.fee.findUnique({
      where: { id },
    });
    if (!fee) throw new NotFoundException(`Fee with ID ${id} not found`);
    return fee;
  }

  async updateFee(id: string, updateFeeDto: UpdateFeeDto) {
    return this.prisma.fee.update({
      where: { id },
      data: updateFeeDto,
    });
  }

  async removeFee(id: string) {
    return this.prisma.fee.delete({
      where: { id },
    });
  }

  // Payments
  async createPayment(createPaymentDto: CreatePaymentDto) {
    return this.prisma.payment.create({
      data: {
        ...createPaymentDto,
        date: createPaymentDto.date ? new Date(createPaymentDto.date) : new Date(),
      },
      include: {
        student: true,
        fee: true,
      },
    });
  }

  async findAllPayments(pagination: PaginationDto, filters: { search?: string; status?: string; student_id?: string }) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
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

  async findOnePayment(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        student: true,
        fee: true,
      },
    });
    if (!payment) throw new NotFoundException(`Payment with ID ${id} not found`);
    return payment;
  }

  async updatePayment(id: string, updatePaymentDto: UpdatePaymentDto) {
    const data: any = { ...updatePaymentDto };
    if (updatePaymentDto.date) {
      data.date = new Date(updatePaymentDto.date);
    }
    return this.prisma.payment.update({
      where: { id },
      data,
      include: {
        student: true,
        fee: true,
      },
    });
  }

  async removePayment(id: string) {
    return this.prisma.payment.delete({
      where: { id },
    });
  }
}
