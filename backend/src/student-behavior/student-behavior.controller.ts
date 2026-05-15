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
  async create(@Req() req: any, @Body() createData: CreateBehaviorDto) {
    let employeeId = req.user.employeeId;
    
    // Fallback: if no employeeId, try to find employee record by userId
    if (!employeeId) {
      employeeId = await this.studentBehaviorService.findEmployeeByUserId(req.user.userId);
      if (!employeeId) {
        throw new BadRequestException('User tidak memiliki akun pegawai. Hubungi administrator untuk menghubungkan akun Anda dengan data pegawai.');
      }
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
    @Query('classId') classId?: string,
    @Query('majorId') majorId?: string,
    @Query('batchId') batchId?: string,
  ) {
    return this.studentBehaviorService.findAll({ page, limit, studentId, assessorId, classId, majorId, batchId });
  }

  @Get('summary')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas')
  getSummary(
    @Query('classId') classId?: string,
    @Query('majorId') majorId?: string,
    @Query('batchId') batchId?: string,
  ) {
    return this.studentBehaviorService.getSummary({ classId, majorId, batchId });
  }

  @Get('student/:studentId')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas', 'Siswa')
  findByStudent(@Param('studentId') studentId: string) {
    return this.studentBehaviorService.findByStudentId(studentId);
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
