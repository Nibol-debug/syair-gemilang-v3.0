import { GradesService } from './grades.service';
import { CreateGradeDto, FinalizeGradeDto, FinalizeClassGradeDto, UpdateGradeComponentDto } from './dto/grade.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class GradesController {
    private readonly gradesService;
    constructor(gradesService: GradesService);
    getGradeComponents(): Promise<{
        id: string;
        name: string;
        weight_percentage: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    updateGradeComponent(updateGradeComponentDto: UpdateGradeComponentDto): Promise<{
        id: string;
        name: string;
        weight_percentage: import("@prisma/client/runtime/library").Decimal;
    }>;
    create(createGradeDto: CreateGradeDto): Promise<{
        id: string;
        major_id: string;
        batch_id: string;
        created_at: Date;
        applicant_id: string | null;
        student_id: string | null;
        type: string;
        subject_id: string;
        score: import("@prisma/client/runtime/library").Decimal;
        exam_id: string | null;
        weight: import("@prisma/client/runtime/library").Decimal;
    }>;
    findByStudent(studentId: string, pagination: PaginationDto): Promise<{
        data: ({
            subject: {
                id: string;
                major_id: string | null;
                name: string;
                passing_grade: number;
                hours_per_week: number | null;
                competency_standards: string | null;
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
                violation_limit: number;
            } | null;
        } & {
            id: string;
            major_id: string;
            batch_id: string;
            created_at: Date;
            applicant_id: string | null;
            student_id: string | null;
            type: string;
            subject_id: string;
            score: import("@prisma/client/runtime/library").Decimal;
            exam_id: string | null;
            weight: import("@prisma/client/runtime/library").Decimal;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            last_page: number;
        };
    }>;
    finalize(finalizeGradeDto: FinalizeGradeDto): Promise<any>;
    finalizeClass(finalizeClassGradeDto: FinalizeClassGradeDto): Promise<{
        message: string;
        finalized_count: number;
    }>;
    getFinalReport(studentId: string): Promise<({
        subject: {
            id: string;
            major_id: string | null;
            name: string;
            passing_grade: number;
            hours_per_week: number | null;
            competency_standards: string | null;
        };
    } & {
        id: string;
        major_id: string;
        batch_id: string;
        student_id: string;
        description: string | null;
        subject_id: string;
        semester: number;
        competencies_achieved: string | null;
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
    getParentPortalData(studentId: string): Promise<{
        student: {
            id: string;
            nis: string;
            full_name: string;
            class_name: string | undefined;
            major_name: string;
            batch_name: string;
        };
        summary: {
            total_subjects: number;
            passed_subjects: number;
            average_score: number;
            pass_percentage: number;
        };
        chart_data: {
            semester: string;
            average: number;
            semester_num: number;
        }[];
        recent_grades: {
            subject_name: string;
            type: string;
            score: number;
            date: Date;
        }[];
        all_grades: {
            subject_name: string;
            final_score: number;
            grade_letter: string;
            is_passed: boolean;
            semester: number;
            description: string | null;
        }[];
    }>;
}
