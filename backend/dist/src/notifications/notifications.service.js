"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationsService = class NotificationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createNotificationDto) {
        return this.prisma.notification.create({
            data: createNotificationDto,
        });
    }
    async broadcast(createNotificationDto) {
        const users = await this.prisma.user.findMany({
            select: { id: true },
        });
        const notifications = await Promise.all(users.map((user) => this.prisma.notification.create({
            data: {
                ...createNotificationDto,
                user_id: user.id,
            },
        })));
        return { success: true, count: notifications.length };
    }
    async findAll(user_id, pagination) {
        const page = pagination.page || 1;
        const limit = pagination.limit || 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.notification.findMany({
                where: { user_id },
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
            }),
            this.prisma.notification.count({ where: { user_id } }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                last_page: Math.ceil(total / limit),
            },
        };
    }
    async findUnreadCount(user_id) {
        const count = await this.prisma.notification.count({
            where: {
                user_id,
                is_read: false,
            },
        });
        return { count };
    }
    async findUnread(user_id, limit = 5) {
        return this.prisma.notification.findMany({
            where: {
                user_id,
                is_read: false,
            },
            take: limit,
            orderBy: { created_at: 'desc' },
        });
    }
    async findOne(id) {
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });
        if (!notification) {
            throw new common_1.NotFoundException(`Notification with ID ${id} not found`);
        }
        return notification;
    }
    async markAsRead(id) {
        const notification = await this.findOne(id);
        return this.prisma.notification.update({
            where: { id },
            data: { is_read: true },
        });
    }
    async markAllAsRead(user_id) {
        return this.prisma.notification.updateMany({
            where: {
                user_id,
                is_read: false,
            },
            data: {
                is_read: true,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.notification.delete({
            where: { id },
        });
    }
    async removeAll(user_id) {
        return this.prisma.notification.deleteMany({
            where: { user_id },
        });
    }
    async createForUser(user_id, title, message, type, link) {
        return this.prisma.notification.create({
            data: {
                user_id,
                title,
                message,
                type,
                link,
            },
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map