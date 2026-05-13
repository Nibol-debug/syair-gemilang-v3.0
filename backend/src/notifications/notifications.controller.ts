import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @Roles('Administrator Utama')
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Post('broadcast')
  @Roles('Administrator Utama')
  broadcast(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.broadcast(createNotificationDto);
  }

  @Get()
  findAll(@Req() req: any, @Query() pagination: PaginationDto) {
    const user_id = req.user.sub;
    return this.notificationsService.findAll(user_id, pagination);
  }

  @Get('unread')
  findUnread(@Req() req: any, @Query('limit') limit?: string) {
    const user_id = req.user.sub;
    return this.notificationsService.findUnread(user_id, limit ? parseInt(limit, 10) : 5);
  }

  @Get('unread-count')
  findUnreadCount(@Req() req: any) {
    const user_id = req.user.sub;
    return this.notificationsService.findUnreadCount(user_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id/mark-as-read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Post('mark-all-as-read')
  markAllAsRead(@Req() req: any) {
    const user_id = req.user.sub;
    return this.notificationsService.markAllAsRead(user_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }

  @Delete()
  removeAll(@Req() req: any) {
    const user_id = req.user.sub;
    return this.notificationsService.removeAll(user_id);
  }
}
