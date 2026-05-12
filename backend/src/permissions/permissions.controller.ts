import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @Roles('Administrator Utama')
  create(@Body() data: { name: string }) {
    return this.permissionsService.create(data);
  }

  @Get()
  @Roles('Administrator Utama')
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @Roles('Administrator Utama')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Delete(':id')
  @Roles('Administrator Utama')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
