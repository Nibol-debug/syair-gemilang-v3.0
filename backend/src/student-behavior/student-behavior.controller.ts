import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { StudentBehaviorService } from './student-behavior.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateBehaviorDto, UpdateBehaviorDto } from './dto/student-behavior.dto';

@Controller('student-behavior')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentBehaviorController {
  constructor(private readonly studentBehaviorService: StudentBehaviorService) {}

  @Post()
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas')
  create(@Req() req: any, @Body() createData: CreateBehaviorDto) {
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new BadRequestException('User is not associated with an employee account');
    }
    return this.studentBehaviorService.create(createData, employeeId);
  }

  @Get()
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas', 'Siswa')
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('studentId') studentId?: string,
    @Query('assessorId') assessorId?: string,
  ) {
    return this.studentBehaviorService.findAll({ page, limit, studentId, assessorId });
  }

  @Get(':id')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas', 'Siswa')
  findOne(@Param('id') id: string) {
    return this.studentBehaviorService.findOne(id);
  }

  @Patch(':id')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas')
  update(@Param('id') id: string, @Body() updateData: UpdateBehaviorDto) {
    return this.studentBehaviorService.update(id, updateData);
  }

  @Delete(':id')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas')
  remove(@Param('id') id: string) {
    return this.studentBehaviorService.remove(id);
  }
}
