import { Controller, Get, Param, Query, UseGuards, StreamableFile } from '@nestjs/common';
import { ReportCardsService } from './report-cards.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('report-cards')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportCardsController {
  constructor(private readonly reportCardsService: ReportCardsService) {}

  /**
   * GET /report-cards/student/:studentId/semester/:semester
   * Get data rapor (JSON format)
   */
  @Get('student/:studentId/semester/:semester')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas', 'Siswa', 'Orang Tua')
  getReportCardData(
    @Param('studentId') studentId: string,
    @Param('semester') semester: number
  ) {
    return this.reportCardsService.getReportCardData(studentId, parseInt(semester.toString()));
  }

  /**
   * GET /report-cards/student/:studentId/semester/:semester/pdf
   * Download rapor (PDF format)
   */
  @Get('student/:studentId/semester/:semester/pdf')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas', 'Siswa', 'Orang Tua')
  async downloadReportCard(
    @Param('studentId') studentId: string,
    @Param('semester') semester: number
  ): Promise<StreamableFile> {
    return this.reportCardsService.generateReportCard(studentId, parseInt(semester.toString()));
  }

  /**
   * GET /report-cards/class/:classId/semester/:semester
   * Get semua rapor untuk satu kelas
   */
  @Get('class/:classId/semester/:semester')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas')
  async getClassReportCards(
    @Param('classId') classId: string,
    @Param('semester') semester: number
  ) {
    const students = await this.reportCardsService['prisma'].student.findMany({
      where: { class_id: classId },
      include: {
        final_grades: {
          where: { semester: parseInt(semester.toString()) },
          include: { subject: true }
        }
      }
    });

    return students.map(student => ({
      student_id: student.id,
      nis: student.nis,
      full_name: student.full_name,
      has_report_card: student.final_grades.length > 0,
      subject_count: student.final_grades.length,
    }));
  }
}
