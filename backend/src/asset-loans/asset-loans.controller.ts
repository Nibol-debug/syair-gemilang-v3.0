import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AssetLoansService } from './asset-loans.service';
import { CreateAssetLoanDto } from './dto/create-asset-loan.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { ActiveUser } from '../common/interfaces/active-user.interface';
import { GetUser } from '../auth/get-user.decorator';

@Controller('asset-loans')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssetLoansController {
  constructor(private readonly assetLoansService: AssetLoansService) {}

  @Post()
  create(@Body() createAssetLoanDto: CreateAssetLoanDto) {
    return this.assetLoansService.create(createAssetLoanDto);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @Query('employee_id') employee_id?: string,
    @Query('asset_id') asset_id?: string,
    @Query('status') status?: string,
  ) {
    return this.assetLoansService.findAll(pagination, { employee_id, asset_id, status });
  }

  @Get('my-loans')
  getMyLoans(
    @GetUser() user: ActiveUser,
    @Query() pagination: PaginationDto,
  ) {
    return this.assetLoansService.findAll(pagination, { employee_id: user.sub });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetLoansService.findOne(id);
  }

  @Patch(':id/return')
  returnAsset(
    @Param('id') id: string,
    @Body('condition') condition: string,
  ) {
    return this.assetLoansService.returnAsset(id, condition);
  }

  @Get('check/:employeeId')
  checkActiveLoans(@Param('employeeId') employeeId: string) {
    return this.assetLoansService.checkActiveLoans(employeeId);
  }

  @Patch(':id')
  @Roles('Administrator Utama', 'Staf Sarpras')
  update(@Param('id') id: string, @Body() updateAssetLoanDto: any) {
    return this.assetLoansService.update(id, updateAssetLoanDto);
  }

  @Delete(':id')
  @Roles('Administrator Utama')
  remove(@Param('id') id: string) {
    return this.assetLoansService.remove(id);
  }
}
