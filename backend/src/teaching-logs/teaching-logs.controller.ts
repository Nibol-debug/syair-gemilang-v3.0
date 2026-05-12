import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { TeachingLogsService } from './teaching-logs.service';
import { CreateTeachingLogDto } from './dto/create-teaching-log.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('teaching-log')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeachingLogsController {
  constructor(private readonly teachingLogsService: TeachingLogsService) {}

  @Post()
  @Roles('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas')
  create(@Body() createTeachingLogDto: CreateTeachingLogDto) {
    return this.teachingLogsService.create(createTeachingLogDto);
  }

  @Get()
  @Roles('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas')
  findAll(@Query('teacher_id') teacher_id?: string, @Query('class_id') class_id?: string) {
    return this.teachingLogsService.findAll({ teacher_id, class_id });
  }
}
