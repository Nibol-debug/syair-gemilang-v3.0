import { Controller, Get, Post, Body, Patch, Param, Query, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { CreateLeaveRequestDto } from './dto/create-leave.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { ActiveUser } from '../common/interfaces/active-user.interface';
import { GetUser } from '../auth/get-user.decorator';

@Controller('leaves')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Post()
  create(@Body() createLeaveRequestDto: CreateLeaveRequestDto, @GetUser() user: ActiveUser) {
    const leaveData = {
      ...createLeaveRequestDto,
      employee_id: createLeaveRequestDto.employee_id || user.employeeId,
    };
    return this.leavesService.create(leaveData);
  }

  @Post(':id/proof')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProof(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const fakeUrl = `/uploads/leaves/${id}/${file.originalname}`;
    return this.leavesService.updateProof(id, fakeUrl);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @Query('status') status?: string,
    @Query('employee_id') employee_id?: string,
  ) {
    return this.leavesService.findAll(pagination, { status, employee_id });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leavesService.findOne(id);
  }

  @Patch(':id/approve')
  @Roles('Administrator Utama', 'Kepala Sekolah')
  approve(@Param('id') id: string, @GetUser() user: ActiveUser) {
    return this.leavesService.approve(id, user.sub);
  }

  @Patch(':id/reject')
  @Roles('Administrator Utama', 'Kepala Sekolah')
  reject(@Param('id') id: string, @GetUser() user: ActiveUser) {
    return this.leavesService.reject(id, user.sub);
  }
}
