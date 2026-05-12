import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, Patch, Delete } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('exams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @Roles('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas')
  create(@Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @Query('major_id') major_id?: string,
    @Query('subject_id') subject_id?: string,
  ) {
    return this.examsService.findAll(pagination, { major_id, subject_id });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examsService.findOne(id);
  }

  @Get(':id/questions')
  async getQuestions(@Param('id') id: string) {
    const exam = await this.examsService.findOne(id);
    // Hide correct options for students
    return exam.questions.map(q => ({
      ...q,
      options: q.options.map(o => ({ id: o.id, option_text: o.option_text }))
    }));
  }

  // Questions management
  @Post(':id/questions')
  @Roles('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas')
  addQuestion(@Param('id') id: string, @Body() data: any) {
    return this.examsService.addQuestion(id, data);
  }

  @Patch('questions/:questionId')
  @Roles('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas')
  updateQuestion(@Param('questionId') questionId: string, @Body() data: any) {
    return this.examsService.updateQuestion(questionId, data);
  }

  @Delete('questions/:questionId')
  @Roles('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas')
  removeQuestion(@Param('questionId') questionId: string) {
    return this.examsService.deleteQuestion(questionId);
  }
}
