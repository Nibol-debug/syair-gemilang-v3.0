import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles('Administrator Utama')
  create(@Body() data: { name: string }) {
    return this.rolesService.create(data);
  }

  @Get()
  @Roles('Administrator Utama')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Roles('Administrator Utama')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @Roles('Administrator Utama')
  update(@Param('id') id: string, @Body() data: { name?: string; permissionIds?: string[] }) {
    return this.rolesService.update(id, data);
  }
}
