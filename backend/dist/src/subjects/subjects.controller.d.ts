import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class SubjectsController {
    private readonly subjectsService;
    constructor(subjectsService: SubjectsService);
    create(createSubjectDto: CreateSubjectDto): Promise<{
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
    update(id: string, updateSubjectDto: UpdateSubjectDto): Promise<{
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
