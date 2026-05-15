import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { RemedialService } from './remedial.service';
import { CreateRemedialDto, ScheduleRemedialDto, UpdateRemedialScoreDto } from './dto/remedial.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('remedial')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RemedialController {
  constructor(private readonly remedialService: RemedialService) {}

  /**
   * GET /remedial/needs
   * Daftar siswa yang perlu remedial untuk mapel tertentu
   */
  @Get('needs')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas')
  getStudentsNeedingRemedial(
    subjectId?: string,
    @Query('subject_id') subjectId: string,
    @Query('class_id') classId?: string,
    @Query('semester') semester?: number
  ) {
    return this.remedialService.getStudentsNeedingRemedial(
    subjectId?: string,
      subjectId,
      classId,
      semester ? parseInt(semester.toString()) : undefined
    );
  }

  /**
   * GET /remedial/stats
   * Statistik remedial
   */
  @Get('stats')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas')
  getStats() {
    return this.remedialService.getStats();
  }

  /**
   * GET /remedial
   * List semua remedial dengan filter
   */
  @Get()
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas')
  findAll(
    @Query('status') status?: string,
    @Query('subject_id') subjectId?: string,
    @Query('student_id') studentId?: string
  ) {
    return this.remedialService.findAll({ status, subject_id: subjectId, student_id: studentId });
  }

  /**
   * GET /remedial/:id
   * Detail remedial
   */
  @Get(':id')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas')
  findOne(@Param('id') id: string) {
    return this.remedialService.findOne(id);
  }

  /**
   * POST /remedial
   * Create remedial record
   */
  @Post()
  @Roles('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas')
  create(@Body() createRemedialDto: CreateRemedialDto) {
    return this.remedialService.create(createRemedialDto);
  }

  /**
   * PUT /remedial/:id/schedule
   * Jadwal remedial
   */
  @Put(':id/schedule')
  @Roles('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas')
  schedule(@Param('id') id: string, @Body() data: ScheduleRemedialDto) {
    return this.remedialService.schedule(id, data);
  }

  /**
   * PUT /remedial/:id/score
   * Update nilai setelah remedial
   */
  @Put(':id/score')
  @Roles('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas')
  updateScore(@Param('id') id: string, @Body() data: UpdateRemedialScoreDto) {
    return this.remedialService.updateScore(id, data);
  }

  /**
   * DELETE /remedial/:id
   * Hapus remedial record
   */
  @Delete(':id')
  @Roles('Administrator Utama')
  remove(@Param('id') id: string) {
    return this.remedialService.remove(id);
  }
}
