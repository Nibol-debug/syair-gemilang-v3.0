import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { GradeAnalysisService } from './grade-analysis.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('grade-analysis')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GradeAnalysisController {
  constructor(private readonly gradeAnalysisService: GradeAnalysisService) {}

  /**
   * GET /grade-analysis/exam/:examId/statistics
   * Statistik lengkap untuk sebuah ujian
   */
  @Get('exam/:examId/statistics')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas')
  getExamStatistics(@Param('examId') examId: string) {
    return this.gradeAnalysisService.getExamStatistics(examId);
  }

  /**
   * GET /grade-analysis/exam/:examId/review
   * Daftar soal yang perlu ditinjau ulang
   */
  @Get('exam/:examId/review')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas')
  getQuestionsForReview(@Param('examId') examId: string) {
    return this.gradeAnalysisService.getQuestionsForReview(examId);
  }

  /**
   * GET /grade-analysis/class/:classId/subject/:subjectId
   * Analisis nilai per kelas untuk mata pelajaran tertentu
   */
  @Get('class/:classId/subject/:subjectId')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas')
  getClassSubjectAnalysis(
    @Param('classId') classId: string,
    @Param('subjectId') subjectId: string,
    @Query('batch_id') batchId?: string
  ) {
    return this.gradeAnalysisService.getClassSubjectAnalysis(classId, subjectId, batchId);
  }
}
