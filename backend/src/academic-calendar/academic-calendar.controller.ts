import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { AcademicCalendarService } from './academic-calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('academic-calendar')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AcademicCalendarController {
  constructor(private readonly academicCalendarService: AcademicCalendarService) {}

  @Post()
  @Roles('Administrator Utama')
  create(@Body() createCalendarDto: CreateCalendarDto) {
    return this.academicCalendarService.create(createCalendarDto);
  }

  @Get()
  findAll() {
    return this.academicCalendarService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.academicCalendarService.findOne(id);
  }

  @Patch(':id')
  @Roles('Administrator Utama')
  update(@Param('id') id: string, @Body() updateCalendarDto: UpdateCalendarDto) {
    return this.academicCalendarService.update(id, updateCalendarDto);
  }

  @Delete(':id')
  @Roles('Administrator Utama')
  remove(@Param('id') id: string) {
    return this.academicCalendarService.remove(id);
  }
}
