import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PayrollsService } from './payrolls.service';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('payrolls')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PayrollsController {
  constructor(private readonly payrollsService: PayrollsService) {}

  @Post()
  @Roles('Administrator Utama', 'Bendahara')
  create(@Body() createPayrollDto: CreatePayrollDto) {
    return this.payrollsService.create(createPayrollDto);
  }

  @Post('generate')
  @Roles('Administrator Utama', 'Bendahara')
  generate(
    @Query('month') month: string,
    @Query('year') year: string,
    @Query('deduction_rate') deductionRate?: string,
  ) {
    return this.payrollsService.generatePayroll(
      parseInt(month),
      parseInt(year),
      deductionRate ? parseInt(deductionRate) : undefined,
    );
  }

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @Query('employee_id') employee_id?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.payrollsService.findAll(pagination, {
      employee_id,
      month: month ? parseInt(month) : undefined,
      year: year ? parseInt(year) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payrollsService.findOne(id);
  }

  @Patch(':id/pay')
  @Roles('Administrator Utama', 'Bendahara')
  markAsPaid(@Param('id') id: string) {
    return this.payrollsService.markAsPaid(id);
  }

  @Patch(':id')
  @Roles('Administrator Utama', 'Bendahara')
  update(@Param('id') id: string, @Body() updatePayrollDto: any) {
    return this.payrollsService.update(id, updatePayrollDto);
  }

  @Delete(':id')
  @Roles('Administrator Utama')
  remove(@Param('id') id: string) {
    return this.payrollsService.remove(id);
  }
}
