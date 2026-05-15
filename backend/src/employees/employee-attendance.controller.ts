import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
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

  @Get('monthly')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Bendahara')
  getMonthlyAttendance(@Query('month') month: string) {
    return this.employeesService.getMonthlyAttendance(month || new Date().toISOString().slice(0, 7));
  }

  @Post('self')
  @Roles('Guru Mata Pelajaran', 'Wali Kelas', 'Bendahara', 'Staf Sarpras', 'Administrator Utama')
  recordSelfAttendance(@Req() req: any) {
    const employeeId = req.user.employee_id;
    if (!employeeId) {
      throw new Error('Akun Anda tidak terhubung dengan data pegawai.');
    }
    return this.employeesService.recordSelfAttendance(employeeId);
  }

  @Post('bulk')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Bendahara')
  recordBulkAttendance(@Body() body: { date: string, attendances: any[] }) {
    return this.employeesService.recordBulkAttendance(body.date, body.attendances);
  }
}
