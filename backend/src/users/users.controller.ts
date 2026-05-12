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
  UseInterceptors 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('roleId') roleId?: string,
  ) {
    return this.usersService.findAll({ page, limit, search, roleId });
  }

  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @Roles('admin')
  create(@Body() data: any) {
    return this.usersService.create(data);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() data: any) {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get(':id/devices')
  @Roles('admin')
  getDevices(@Param('id') id: string) {
    return this.usersService.getDevices(id);
  }

  @Patch(':id/devices/:deviceId')
  @Roles('admin')
  toggleDevice(
    @Param('id') id: string,
    @Param('deviceId') deviceId: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.usersService.toggleDeviceStatus(id, deviceId, isActive);
  }
}
