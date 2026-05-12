import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentQueryDto } from './dto/student-query.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  findAll(@Query() query: StudentQueryDto) {
    const { page, limit, ...filters } = query;
    return this.studentsService.findAll({ page, limit }, filters);
  }

  @Get('export')
  export(@Res() res: Response) {
    return this.studentsService.exportToExcel(res);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  import(@UploadedFile() file: Express.Multer.File) {
    return this.studentsService.importFromExcel(file);
  }

  @Post('upload-photo')
  @UseInterceptors(FileInterceptor('photo', {
    dest: './uploads/profiles',
  }))
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    return { 
      url: `/uploads/profiles/${file.filename}` 
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
