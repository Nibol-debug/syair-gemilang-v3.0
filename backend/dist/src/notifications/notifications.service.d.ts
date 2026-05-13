import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    findAll(user_id: string, pagination: PaginationDto): Promise<{
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
    findUnreadCount(user_id: string): Promise<{
        count: number;
    }>;
    findUnread(user_id: string, limit?: number): Promise<{
        id: string;
        created_at: Date;
        type: string;
        user_id: string | null;
        link: string | null;
        title: string;
        message: string;
        is_read: boolean;
    }[]>;
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
    markAllAsRead(user_id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
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
    removeAll(user_id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    createForUser(user_id: string, title: string, message: string, type: string, link?: string): Promise<{
        id: string;
        created_at: Date;
        type: string;
        user_id: string | null;
        link: string | null;
        title: string;
        message: string;
        is_read: boolean;
    }>;
}
