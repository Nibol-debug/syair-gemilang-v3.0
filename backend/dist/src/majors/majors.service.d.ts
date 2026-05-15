import { PrismaService } from '../prisma/prisma.service';
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class MajorsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createMajorDto: CreateMajorDto): Promise<{
        id: string;
        code: string;
        name: string;
        created_at: Date;
        branch_id: string;
    }>;
    findAll(paginationDto: PaginationDto, branchId?: string): Promise<{
        data: ({
            branch: {
                id: string;
                name: string;
                created_at: Date;
            };
        } & {
            id: string;
            code: string;
            name: string;
            created_at: Date;
            branch_id: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        code: string;
        name: string;
        created_at: Date;
        branch_id: string;
    }>;
    update(id: string, updateMajorDto: UpdateMajorDto): Promise<{
        id: string;
        code: string;
        name: string;
        created_at: Date;
        branch_id: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        code: string;
        name: string;
        created_at: Date;
        branch_id: string;
    }>;
}
