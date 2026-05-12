import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MajorsService } from './majors.service';
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('majors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MajorsController {
  constructor(private readonly majorsService: MajorsService) {}

  @Post()
  @Roles('Administrator Utama', 'Kepala Sekolah')
  create(@Body() createMajorDto: CreateMajorDto) {
    return this.majorsService.create(createMajorDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.majorsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.majorsService.findOne(id);
  }

  @Patch(':id')
  @Roles('Administrator Utama', 'Kepala Sekolah')
  update(@Param('id') id: string, @Body() updateMajorDto: UpdateMajorDto) {
    return this.majorsService.update(id, updateMajorDto);
  }

  @Delete(':id')
  @Roles('Administrator Utama', 'Kepala Sekolah')
  remove(@Param('id') id: string) {
    return this.majorsService.remove(id);
  }
}
