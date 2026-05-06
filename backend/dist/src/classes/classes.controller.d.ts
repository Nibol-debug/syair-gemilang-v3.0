import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
    create(createClassDto: CreateClassDto): Promise<{
        id: string;
        name: string;
        grade_level: number;
        major_id: string;
        batch_id: string;
        homeroom_teacher_id: string | null;
    }>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: ({
            major: {
                id: string;
                name: string;
                created_at: Date;
                code: string;
            };
            batch: {
                id: string;
                name: string;
                year_start: number;
                year_end: number;
                is_active: boolean;
            };
            homeroom_teacher: {
                id: string;
                full_name: string;
                status: string;
                major_id: string | null;
                education: string;
                position: string;
                join_date: Date;
            } | null;
        } & {
            id: string;
            name: string;
            grade_level: number;
            major_id: string;
            batch_id: string;
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
            created_at: Date;
            code: string;
        };
        batch: {
            id: string;
            name: string;
            year_start: number;
            year_end: number;
            is_active: boolean;
        };
        homeroom_teacher: {
            id: string;
            full_name: string;
            status: string;
            major_id: string | null;
            education: string;
            position: string;
            join_date: Date;
        } | null;
    } & {
        id: string;
        name: string;
        grade_level: number;
        major_id: string;
        batch_id: string;
        homeroom_teacher_id: string | null;
    }>;
    update(id: string, updateClassDto: UpdateClassDto): Promise<{
        id: string;
        name: string;
        grade_level: number;
        major_id: string;
        batch_id: string;
        homeroom_teacher_id: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        grade_level: number;
        major_id: string;
        batch_id: string;
        homeroom_teacher_id: string | null;
    }>;
}
