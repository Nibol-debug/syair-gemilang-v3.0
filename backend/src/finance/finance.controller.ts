import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UseGuards, BadRequestException } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreateFeeDto } from './dto/create-fee.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { FinanceQueryDto } from './dto/finance-query.dto';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('finance')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  // Fees
  @Post('fees')
  @Roles('Administrator Utama', 'Bendahara')
  createFee(@Body() createFeeDto: CreateFeeDto) {
    return this.financeService.createFee(createFeeDto);
  }

  @Get('fees')
  @Roles('Administrator Utama', 'Bendahara', 'Kepala Sekolah')
  findAllFees(@Query() query: FinanceQueryDto) {
    const { page, limit, ...filters } = query;
    return this.financeService.findAllFees({ page, limit }, filters);
  }

  @Get('fees/:id')
  @Roles('Administrator Utama', 'Bendahara', 'Kepala Sekolah')
  findOneFee(@Param('id') id: string) {
    return this.financeService.findOneFee(id);
  }

  @Patch('fees/:id')
  @Roles('Administrator Utama', 'Bendahara')
  updateFee(@Param('id') id: string, @Body() updateFeeDto: UpdateFeeDto) {
    return this.financeService.updateFee(id, updateFeeDto);
  }

  @Delete('fees/:id')
  @Roles('Administrator Utama', 'Bendahara')
  removeFee(@Param('id') id: string) {
    return this.financeService.removeFee(id);
  }

  // Payments
  @Post('payments')
  @Roles('Administrator Utama', 'Bendahara')
  createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.financeService.createPayment(createPaymentDto);
  }

  @Get('payments')
  @Roles('Administrator Utama', 'Bendahara', 'Kepala Sekolah')
  findAllPayments(@Query() query: FinanceQueryDto) {
    const { page, limit, ...filters } = query;
    return this.financeService.findAllPayments({ page, limit }, filters);
  }

  @Get('payments/:id')
  @Roles('Administrator Utama', 'Bendahara', 'Kepala Sekolah')
  findOnePayment(@Param('id') id: string) {
    return this.financeService.findOnePayment(id);
  }

  @Patch('payments/:id')
  @Roles('Administrator Utama', 'Bendahara')
  updatePayment(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.financeService.updatePayment(id, updatePaymentDto);
  }

  @Delete('payments/:id')
  @Roles('Administrator Utama', 'Bendahara')
  removePayment(@Param('id') id: string) {
    return this.financeService.removePayment(id);
  }

  @Post('remind')
  @Roles('Administrator Utama', 'Bendahara')
  sendPaymentReminders() {
    return this.financeService.sendPaymentReminders();
  }
}
