import { Controller, Get, Post, Body, Param, Query, Delete, Patch, UseGuards } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { BulkCreateAttendanceDto, CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
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

  @Get('summary')
  @Roles('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas', 'Kepala Sekolah')
  getSummary(@Query('class_id') class_id?: string, @Query('month') month?: string) {
    return this.attendancesService.getSummary(class_id, month);
  }

  @Get('schedule/:id')
  @Roles('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas')
  findBySchedule(@Param('id') scheduleId: string, @Query('date') date: string) {
    return this.attendancesService.findBySchedule(scheduleId, new Date(date));
  }

  @Patch(':id')
  @Roles('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas')
  update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendancesService.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  @Roles('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas')
  remove(@Param('id') id: string) {
    return this.attendancesService.remove(id);
  }
}
