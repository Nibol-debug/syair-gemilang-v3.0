import { PrismaService } from '../prisma/prisma.service';
export declare class AuditLogsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(params: {
        page?: number;
        limit?: number;
        module?: string;
        action?: string;
    }): Promise<{
        items: ({
            user: {
                username: string;
            };
        } & {
            id: string;
            created_at: Date;
            data: import("@prisma/client/runtime/library").JsonValue;
            user_id: string;
            action: string;
            module: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
