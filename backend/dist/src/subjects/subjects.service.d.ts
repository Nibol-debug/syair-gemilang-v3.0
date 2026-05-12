import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class SubjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateSubjectDto): Promise<{
        id: string;
        major_id: string | null;
        name: string;
    }>;
    findAll(pagination: PaginationDto, major_id?: string): Promise<{
        data: ({
            major: {
                id: string;
                name: string;
                branch_id: string;
                created_at: Date;
                code: string;
            } | null;
        } & {
            id: string;
            major_id: string | null;
            name: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            last_page: number;
        };
    }>;
    findOne(id: string): Promise<{
        major: {
            id: string;
            name: string;
            branch_id: string;
            created_at: Date;
            code: string;
        } | null;
    } & {
        id: string;
        major_id: string | null;
        name: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        major_id: string | null;
        name: string;
    }>;
}
