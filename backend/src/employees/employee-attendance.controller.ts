import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('employee-attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeeAttendanceController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get('daily')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Bendahara')
  getDailyAttendance(@Query('date') date: string) {
    return this.employeesService.getAttendanceByDate(date || new Date().toISOString());
  }

  @Post('bulk')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Bendahara')
  recordBulkAttendance(@Body() body: { date: string, attendances: any[] }) {
    return this.employeesService.recordBulkAttendance(body.date, body.attendances);
  }
}
