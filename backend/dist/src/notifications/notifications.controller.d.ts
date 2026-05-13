import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    create(createNotificationDto: CreateNotificationDto): Promise<{
        id: string;
        created_at: Date;
        type: string;
        user_id: string | null;
        link: string | null;
        title: string;
        message: string;
        is_read: boolean;
    }>;
    broadcast(createNotificationDto: CreateNotificationDto): Promise<{
        success: boolean;
        count: number;
    }>;
    findAll(req: any, pagination: PaginationDto): Promise<{
        data: {
            id: string;
            created_at: Date;
            type: string;
            user_id: string | null;
            link: string | null;
            title: string;
            message: string;
            is_read: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            last_page: number;
        };
    }>;
    findUnread(req: any, limit?: string): Promise<{
        id: string;
        created_at: Date;
        type: string;
        user_id: string | null;
        link: string | null;
        title: string;
        message: string;
        is_read: boolean;
    }[]>;
    findUnreadCount(req: any): Promise<{
        count: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        created_at: Date;
        type: string;
        user_id: string | null;
        link: string | null;
        title: string;
        message: string;
        is_read: boolean;
    }>;
    markAsRead(id: string): Promise<{
        id: string;
        created_at: Date;
        type: string;
        user_id: string | null;
        link: string | null;
        title: string;
        message: string;
        is_read: boolean;
    }>;
    markAllAsRead(req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
    remove(id: string): Promise<{
        id: string;
        created_at: Date;
        type: string;
        user_id: string | null;
        link: string | null;
        title: string;
        message: string;
        is_read: boolean;
    }>;
    removeAll(req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
