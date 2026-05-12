import { PrismaService } from '../prisma/prisma.service';
export declare class BranchesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        name: string;
    }): Promise<{
        id: string;
        name: string;
        created_at: Date;
    }>;
    findAll(): Promise<({
        _count: {
            majors: number;
            students: number;
        };
    } & {
        id: string;
        name: string;
        created_at: Date;
    })[]>;
    findOne(id: string): Promise<{
        majors: {
            id: string;
            name: string;
            branch_id: string;
            created_at: Date;
            code: string;
        }[];
    } & {
        id: string;
        name: string;
        created_at: Date;
    }>;
    update(id: string, data: {
        name: string;
    }): Promise<{
        id: string;
        name: string;
        created_at: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        created_at: Date;
    }>;
}
