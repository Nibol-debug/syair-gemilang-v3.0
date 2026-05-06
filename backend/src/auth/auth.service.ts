import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && await bcrypt.compare(pass, user.password_hash)) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerDevice(userId: string, deviceId: string) {
    // Check if device already registered for this user
    const existing = await this.prisma.userDevice.findFirst({
      where: { user_id: userId, device_id: deviceId },
    });

    if (existing) {
      return this.prisma.userDevice.update({
        where: { id: existing.id },
        data: { is_active: true },
      });
    }

    return this.prisma.userDevice.create({
      data: {
        user_id: userId,
        device_id: deviceId,
        is_active: true,
      },
    });
  }
}
