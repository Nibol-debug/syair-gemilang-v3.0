import { AuditLogsService } from './audit-logs.service';
export declare class AuditLogsController {
    private readonly auditLogsService;
    constructor(auditLogsService: AuditLogsService);
    findAll(page?: number, limit?: number, module?: string, action?: string): Promise<{
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
