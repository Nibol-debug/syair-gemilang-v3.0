import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { AcademicCalendarService } from './academic-calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('academic-calendar')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AcademicCalendarController {
  constructor(private readonly academicCalendarService: AcademicCalendarService) {}

  @Post()
  @Roles('admin')
  create(@Body() createCalendarDto: CreateCalendarDto) {
    return this.academicCalendarService.create(createCalendarDto);
  }

  @Get()
  findAll() {
    return this.academicCalendarService.findAll();
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.academicCalendarService.remove(id);
  }
}
