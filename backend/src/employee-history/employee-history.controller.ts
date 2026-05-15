import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { EmployeeHistoryService } from './employee-history.service';
import { CreateEmployeeHistoryDto } from './dto/create-employee-history.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('employee-history')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeeHistoryController {
  constructor(private readonly employeeHistoryService: EmployeeHistoryService) {}

  @Post()
  @Roles('Administrator Utama', 'Kepala Sekolah')
  create(@Body() createEmployeeHistoryDto: CreateEmployeeHistoryDto) {
    return this.employeeHistoryService.create(createEmployeeHistoryDto);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @Query('employee_id') employee_id?: string,
    @Query('type') type?: string,
  ) {
    return this.employeeHistoryService.findAll(pagination, { employee_id, type });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeHistoryService.findOne(id);
  }

  @Patch(':id')
  @Roles('Administrator Utama', 'Kepala Sekolah')
  update(@Param('id') id: string, @Body() updateEmployeeHistoryDto: any) {
    return this.employeeHistoryService.update(id, updateEmployeeHistoryDto);
  }

  @Delete(':id')
  @Roles('Administrator Utama')
  remove(@Param('id') id: string) {
    return this.employeeHistoryService.remove(id);
  }
}
