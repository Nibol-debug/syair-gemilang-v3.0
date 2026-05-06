import { PrismaService } from '../prisma/prisma.service';
import { CreateGradeDto, FinalizeGradeDto } from './dto/grade.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Prisma } from '@prisma/client';
export declare class GradesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateGradeDto): Promise<{
        id: string;
        student_id: string;
        major_id: string;
        batch_id: string;
        created_at: Date;
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
                name: string;
                major_id: string | null;
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
            student_id: string;
            major_id: string;
            batch_id: string;
            created_at: Date;
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
        student_id: string;
        major_id: string;
        batch_id: string;
        description: string | null;
        subject_id: string;
        semester: number;
        final_score: Prisma.Decimal;
        grade_letter: string;
        is_passed: boolean;
    }>;
    getFinalReport(studentId: string): Promise<({
        subject: {
            id: string;
            name: string;
            major_id: string | null;
        };
    } & {
        id: string;
        student_id: string;
        major_id: string;
        batch_id: string;
        description: string | null;
        subject_id: string;
        semester: number;
        final_score: Prisma.Decimal;
        grade_letter: string;
        is_passed: boolean;
    })[]>;
}
