import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { BulkCreateAttendanceDto } from './dto/create-attendance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post()
  @Roles('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas')
  bulkCreate(@Body() data: BulkCreateAttendanceDto) {
    return this.attendancesService.bulkCreate(data);
  }

  @Get('class/:id')
  @Roles('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas')
  findByClass(@Param('id') classId: string, @Query('date') date: string) {
    return this.attendancesService.findByClass(classId, new Date(date));
  }
}
