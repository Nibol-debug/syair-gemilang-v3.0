import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class SubjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateSubjectDto): Promise<{
        id: string;
        major_id: string | null;
        name: string;
        passing_grade: number;
        hours_per_week: number | null;
        competency_standards: string | null;
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
            passing_grade: number;
            hours_per_week: number | null;
            competency_standards: string | null;
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
        passing_grade: number;
        hours_per_week: number | null;
        competency_standards: string | null;
    }>;
    update(id: string, data: UpdateSubjectDto): Promise<{
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
        passing_grade: number;
        hours_per_week: number | null;
        competency_standards: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        major_id: string | null;
        name: string;
        passing_grade: number;
        hours_per_week: number | null;
        competency_standards: string | null;
    }>;
}
