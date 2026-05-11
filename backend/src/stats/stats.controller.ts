import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  getDashboardStats() {
    return this.statsService.getDashboardStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('students')
  getStudentStats() {
    return this.statsService.getStudentStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('employees')
  getEmployeeStats() {
    return this.statsService.getEmployeeStats();
  }
}
