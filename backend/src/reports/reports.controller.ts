import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  @Roles('Administrator Utama', 'Kepala Sekolah')
  getSummary() {
    return this.reportsService.getSummary();
  }

  @Get('attendance')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas')
  getAttendanceReport(@Query('month') month?: string) {
    return this.reportsService.getAttendanceReport(month);
  }

  @Get('finance')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Bendahara')
  getFinanceReport(@Query('month') month?: string) {
    return this.reportsService.getFinanceReport(month);
  }

  @Get('academic')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran')
  getAcademicReport() {
    return this.reportsService.getAcademicReport();
  }
}
