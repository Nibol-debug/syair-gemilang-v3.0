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
  @Roles('admin', 'guru')
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradesService.create(createGradeDto);
  }

  @Get('student/:id')
  findByStudent(@Param('id') studentId: string, @Query() pagination: PaginationDto) {
    return this.gradesService.findByStudent(studentId, pagination);
  }

  @Post('finalize')
  @Roles('admin', 'guru')
  finalize(@Body() finalizeGradeDto: FinalizeGradeDto) {
    return this.gradesService.finalizeGrade(finalizeGradeDto);
  }

  @Get('final/:student_id')
  getFinalReport(@Param('student_id') studentId: string) {
    return this.gradesService.getFinalReport(studentId);
  }
}
