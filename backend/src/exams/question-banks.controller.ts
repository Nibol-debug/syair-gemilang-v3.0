import { Controller, Get, Post, Body, Param, Query, UseGuards, Patch, Delete } from '@nestjs/common';
import { QuestionBanksService } from './question-banks.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('question-banks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuestionBanksController {
  constructor(private readonly questionBanksService: QuestionBanksService) {}

  @Post()
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas')
  create(@Body() data: any) {
    return this.questionBanksService.create(data);
  }

  @Get()
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas')
  findAll(
    @Query() pagination: PaginationDto,
    @Query('major_id') major_id?: string,
    @Query('subject_id') subject_id?: string,
    @Query('search') search?: string,
  ) {
    return this.questionBanksService.findAll(pagination, { major_id, subject_id, search });
  }

  @Get(':id')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas')
  findOne(@Param('id') id: string) {
    return this.questionBanksService.findOne(id);
  }

  @Patch(':id')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas')
  update(@Param('id') id: string, @Body() data: any) {
    return this.questionBanksService.update(id, data);
  }

  @Delete(':id')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas')
  remove(@Param('id') id: string) {
    return this.questionBanksService.remove(id);
  }

  @Post('import-to-exam/:examId')
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas')
  importToExam(@Param('examId') examId: string, @Body('question_bank_ids') questionBankIds: string[]) {
    return this.questionBanksService.importToExam(examId, questionBankIds);
  }
}
