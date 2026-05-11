import { GradesService } from './grades.service';
import { CreateGradeDto, FinalizeGradeDto } from './dto/grade.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class GradesController {
    private readonly gradesService;
    constructor(gradesService: GradesService);
    create(createGradeDto: CreateGradeDto): Promise<{
        id: string;
        major_id: string;
        batch_id: string;
        created_at: Date;
        student_id: string;
        type: string;
        subject_id: string;
        exam_id: string | null;
        score: import("@prisma/client/runtime/library").Decimal;
        weight: import("@prisma/client/runtime/library").Decimal;
    }>;
    findByStudent(studentId: string, pagination: PaginationDto): Promise<{
        data: ({
            subject: {
                id: string;
                major_id: string | null;
                name: string;
            };
            exam: {
                id: string;
                major_id: string;
                subject_id: string;
                start_time: Date;
                end_time: Date;
                title: string;
                duration: number;
                token: string;
            } | null;
        } & {
            id: string;
            major_id: string;
            batch_id: string;
            created_at: Date;
            student_id: string;
            type: string;
            subject_id: string;
            exam_id: string | null;
            score: import("@prisma/client/runtime/library").Decimal;
            weight: import("@prisma/client/runtime/library").Decimal;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            last_page: number;
        };
    }>;
    finalize(finalizeGradeDto: FinalizeGradeDto): Promise<{
        id: string;
        major_id: string;
        batch_id: string;
        student_id: string;
        description: string | null;
        subject_id: string;
        semester: number;
        final_score: import("@prisma/client/runtime/library").Decimal;
        grade_letter: string;
        is_passed: boolean;
    }>;
    getFinalReport(studentId: string): Promise<({
        subject: {
            id: string;
            major_id: string | null;
            name: string;
        };
    } & {
        id: string;
        major_id: string;
        batch_id: string;
        student_id: string;
        description: string | null;
        subject_id: string;
        semester: number;
        final_score: import("@prisma/client/runtime/library").Decimal;
        grade_letter: string;
        is_passed: boolean;
    })[]>;
    findByClass(classId: string, subjectId: string): Promise<{
        id: string;
        nis: string;
        full_name: string;
        cbt_score: number | import("@prisma/client/runtime/library").Decimal;
        assignment_score: number | import("@prisma/client/runtime/library").Decimal;
        final_score: import("@prisma/client/runtime/library").Decimal;
        status: string;
    }[]>;
}
