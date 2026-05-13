import { PrismaService } from '../prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class ClassesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createClassDto: CreateClassDto): Promise<{
        id: string;
        major_id: string;
        name: string;
        batch_id: string;
        grade_level: number;
        homeroom_teacher_id: string | null;
    }>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: ({
            major: {
                branch: {
                    id: string;
                    name: string;
                    created_at: Date;
                };
            } & {
                id: string;
                name: string;
                branch_id: string;
                created_at: Date;
                code: string;
            };
            batch: {
                id: string;
                name: string;
                start_date: Date;
                end_date: Date;
                is_active: boolean;
            };
            homeroom_teacher: {
                id: string;
                full_name: string;
                education: string;
                position: string;
                join_date: Date;
                status: string;
                major_id: string | null;
            } | null;
        } & {
            id: string;
            major_id: string;
            name: string;
            batch_id: string;
            grade_level: number;
            homeroom_teacher_id: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        major: {
            id: string;
            name: string;
            branch_id: string;
            created_at: Date;
            code: string;
        };
        batch: {
            id: string;
            name: string;
            start_date: Date;
            end_date: Date;
            is_active: boolean;
        };
        homeroom_teacher: {
            id: string;
            full_name: string;
            education: string;
            position: string;
            join_date: Date;
            status: string;
            major_id: string | null;
        } | null;
    } & {
        id: string;
        major_id: string;
        name: string;
        batch_id: string;
        grade_level: number;
        homeroom_teacher_id: string | null;
    }>;
    findStudents(id: string): Promise<{
        id: string;
        full_name: string;
        nis: string;
        gender: string;
        profile_picture: string | null;
    }[]>;
    update(id: string, updateClassDto: UpdateClassDto): Promise<{
        id: string;
        major_id: string;
        name: string;
        batch_id: string;
        grade_level: number;
        homeroom_teacher_id: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        major_id: string;
        name: string;
        batch_id: string;
        grade_level: number;
        homeroom_teacher_id: string | null;
    }>;
}
