import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreateFeeDto } from './dto/create-fee.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { FinanceQueryDto } from './dto/finance-query.dto';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';

@Controller('finance')
@UseInterceptors(AuditInterceptor)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  // Fees
  @Post('fees')
  createFee(@Body() createFeeDto: CreateFeeDto) {
    return this.financeService.createFee(createFeeDto);
  }

  @Get('fees')
  findAllFees(@Query() query: FinanceQueryDto) {
    const { page, limit, ...filters } = query;
    return this.financeService.findAllFees({ page, limit }, filters);
  }

  @Get('fees/:id')
  findOneFee(@Param('id') id: string) {
    return this.financeService.findOneFee(id);
  }

  @Patch('fees/:id')
  updateFee(@Param('id') id: string, @Body() updateFeeDto: UpdateFeeDto) {
    return this.financeService.updateFee(id, updateFeeDto);
  }

  @Delete('fees/:id')
  removeFee(@Param('id') id: string) {
    return this.financeService.removeFee(id);
  }

  // Payments
  @Post('payments')
  createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.financeService.createPayment(createPaymentDto);
  }

  @Get('payments')
  findAllPayments(@Query() query: FinanceQueryDto) {
    const { page, limit, ...filters } = query;
    return this.financeService.findAllPayments({ page, limit }, filters);
  }

  @Get('payments/:id')
  findOnePayment(@Param('id') id: string) {
    return this.financeService.findOnePayment(id);
  }

  @Patch('payments/:id')
  updatePayment(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.financeService.updatePayment(id, updatePaymentDto);
  }

  @Delete('payments/:id')
  removePayment(@Param('id') id: string) {
    return this.financeService.removePayment(id);
  }
}
