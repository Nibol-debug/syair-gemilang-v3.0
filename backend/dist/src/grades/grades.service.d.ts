import { PrismaService } from '../prisma/prisma.service';
import { CreateGradeDto, FinalizeGradeDto } from './dto/grade.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Prisma } from '@prisma/client';
export declare class GradesService {
    private prisma;
    constructor(prisma: PrismaService);
    private generateDescription;
    create(data: CreateGradeDto): Promise<{
        id: string;
        major_id: string;
        batch_id: string;
        created_at: Date;
        applicant_id: string | null;
        student_id: string | null;
        type: string;
        subject_id: string;
        exam_id: string | null;
        score: Prisma.Decimal;
        weight: Prisma.Decimal;
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
            applicant_id: string | null;
            student_id: string | null;
            type: string;
            subject_id: string;
            exam_id: string | null;
            score: Prisma.Decimal;
            weight: Prisma.Decimal;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            last_page: number;
        };
    }>;
    finalizeGrade(data: FinalizeGradeDto): Promise<{
        id: string;
        major_id: string;
        batch_id: string;
        student_id: string;
        description: string | null;
        subject_id: string;
        semester: number;
        competencies_achieved: string | null;
        final_score: Prisma.Decimal;
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
        competencies_achieved: string | null;
        final_score: Prisma.Decimal;
        grade_letter: string;
        is_passed: boolean;
    })[]>;
    findByClass(classId: string, subjectId: string): Promise<{
        id: string;
        nis: string;
        full_name: string;
        cbt_score: number | Prisma.Decimal;
        assignment_score: number | Prisma.Decimal;
        final_score: Prisma.Decimal;
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
