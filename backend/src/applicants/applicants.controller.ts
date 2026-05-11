import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('applicants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicantsController {
  constructor(private readonly applicantsService: ApplicantsService) {}

  @Post()
  @Roles('admin', 'kepala_sekolah')
  create(@Body() data: any) {
    return this.applicantsService.create(data);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.applicantsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicantsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'kepala_sekolah')
  update(@Param('id') id: string, @Body() data: any) {
    return this.applicantsService.update(id, data);
  }

  @Patch(':id/verify')
  @Roles('admin', 'kepala_sekolah')
  verify(@Param('id') id: string, @Body('status') status: string) {
    return this.applicantsService.verify(id, status);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.applicantsService.remove(id);
  }
}
