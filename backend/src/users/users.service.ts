import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    roleId?: string;
  }) {
    const { page = 1, limit = 10, search, roleId } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { username: { contains: search } },
        { student: { full_name: { contains: search } } },
        { employee: { full_name: { contains: search } } },
      ];
    }

    if (roleId) {
      where.role_id = roleId;
    }

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          role: true,
          student: {
            select: { full_name: true, email: true }
          },
          employee: {
            select: { full_name: true }
          }
        },
        orderBy: { username: 'asc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      include: { 
        role: true,
      },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        student: true,
        employee: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: { username: string; password_hash: string; role_id: string; student_id?: string; employee_id?: string }) {
    const hashedPassword = await bcrypt.hash(data.password_hash, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        password_hash: hashedPassword,
      },
    });
  }

  async update(id: string, data: { username?: string; password?: string; role_id?: string }) {
    const updateData: any = { ...data };
    
    if (data.password) {
      updateData.password_hash = await bcrypt.hash(data.password, 10);
      delete updateData.password;
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getDevices(userId: string) {
    return this.prisma.userDevice.findMany({
      where: { user_id: userId },
    });
  }

  async toggleDeviceStatus(userId: string, deviceId: string, isActive: boolean) {
    const device = await this.prisma.userDevice.findFirst({
      where: { user_id: userId, id: deviceId },
    });
    
    if (!device) throw new NotFoundException('Device not found for this user');

    return this.prisma.userDevice.update({
      where: { id: deviceId },
      data: { is_active: isActive },
    });
  }
}
