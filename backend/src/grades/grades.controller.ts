import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreateGradeDto, FinalizeGradeDto } from './dto/grade.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('grades')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  @Roles('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas')
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradesService.create(createGradeDto);
  }

  @Get('student/:id')
  findByStudent(@Param('id') studentId: string, @Query() pagination: PaginationDto) {
    return this.gradesService.findByStudent(studentId, pagination);
  }

  @Post('finalize')
  @Roles('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas')
  finalize(@Body() finalizeGradeDto: FinalizeGradeDto) {
    return this.gradesService.finalizeGrade(finalizeGradeDto);
  }

  @Get('final/:student_id')
  getFinalReport(@Param('student_id') studentId: string) {
    return this.gradesService.getFinalReport(studentId);
  }

  @Get('class/:class_id')
  findByClass(@Param('class_id') classId: string, @Query('subject_id') subjectId: string) {
    return this.gradesService.findByClass(classId, subjectId);
  }

  /**
   * GET /grades/parent/:student_id
   * Portal orang tua untuk melihat nilai anak
   */
  @Get('parent/:student_id')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas', 'Siswa', 'Orang Tua')
  getParentPortalData(@Param('student_id') studentId: string) {
    return this.gradesService.getParentPortalData(studentId);
  }
}
