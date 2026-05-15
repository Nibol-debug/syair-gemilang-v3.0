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
        type: string;
        score: import("@prisma/client/runtime/library").Decimal;
        weight: import("@prisma/client/runtime/library").Decimal;
        created_at: Date;
        student_id: string | null;
        applicant_id: string | null;
        subject_id: string;
        exam_id: string | null;
        batch_id: string;
        major_id: string;
    }>;
    findByStudent(studentId: string, pagination: PaginationDto): Promise<{
        data: ({
            subject: {
                id: string;
                name: string;
                major_id: string | null;
                hours_per_week: number | null;
                passing_grade: number;
                competency_standards: string | null;
            };
            exam: {
                id: string;
                subject_id: string;
                major_id: string;
                title: string;
                duration: number;
                token: string;
                start_time: Date;
                end_time: Date;
            } | null;
        } & {
            id: string;
            type: string;
            score: import("@prisma/client/runtime/library").Decimal;
            weight: import("@prisma/client/runtime/library").Decimal;
            created_at: Date;
            student_id: string | null;
            applicant_id: string | null;
            subject_id: string;
            exam_id: string | null;
            batch_id: string;
            major_id: string;
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
            name: string;
            major_id: string | null;
            hours_per_week: number | null;
            passing_grade: number;
            competency_standards: string | null;
        };
    } & {
        id: string;
        student_id: string;
        subject_id: string;
        batch_id: string;
        major_id: string;
        final_score: import("@prisma/client/runtime/library").Decimal;
        grade_letter: string;
        is_passed: boolean;
        description: string | null;
        competencies_achieved: string | null;
        semester: number;
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
