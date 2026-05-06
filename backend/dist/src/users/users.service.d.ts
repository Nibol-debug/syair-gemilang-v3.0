import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(username: string): Promise<({
        role: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        username: string;
        student_id: string | null;
        employee_id: string | null;
        password_hash: string;
        role_id: string;
    }) | null>;
    create(data: {
        username: string;
        password_hash: string;
        role_id: string;
    }): Promise<{
        id: string;
        username: string;
        student_id: string | null;
        employee_id: string | null;
        password_hash: string;
        role_id: string;
    }>;
}
