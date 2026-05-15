import { PrismaService } from '../prisma/prisma.service';
import { CreateRemedialDto, ScheduleRemedialDto, UpdateRemedialScoreDto } from './dto/remedial.dto';
import { Prisma } from '@prisma/client';
export declare class RemedialService {
    private prisma;
    constructor(prisma: PrismaService);
    getStudentsNeedingRemedial(subjectId?: string, classId?: string, semester?: number): Promise<{
        id: string;
        final_grade_id: string;
        student_id: string;
        nis: string;
        full_name: string;
        class_name: string;
        final_score: number;
        grade_letter: string;
        needs_remedial: boolean;
        remedial_status: string;
        remedial_id: string | undefined;
        score_after: number | null;
        scheduled_at: Date | null | undefined;
    }[]>;
    create(data: CreateRemedialDto): Promise<{
        student: {
            id: string;
            nis: string;
            full_name: string;
        };
        subject: {
            id: string;
            major_id: string | null;
            name: string;
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
        student_id: string;
        subject_id: string;
        status: string;
        created_at: Date;
        exam_id: string | null;
        score_before: Prisma.Decimal;
        score_after: Prisma.Decimal | null;
        scheduled_at: Date | null;
        completed_at: Date | null;
        notes: string | null;
        updated_at: Date;
    }>;
    schedule(remedialId: string, data: ScheduleRemedialDto): Promise<{
        student: {
            id: string;
            batch_id: string;
            major_id: string;
            nis: string;
            nik: string;
            full_name: string;
            gender: string;
            birth_place: string;
            birth_date: Date;
            address: string;
            phone: string;
            email: string;
            status: string;
            health_history: string | null;
            profile_picture: string | null;
            latitude: Prisma.Decimal | null;
            longitude: Prisma.Decimal | null;
            branch_id: string;
            class_id: string | null;
            qr_code: string | null;
            created_at: Date;
            applicant_id: string | null;
        };
        subject: {
            id: string;
            major_id: string | null;
            name: string;
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
        student_id: string;
        subject_id: string;
        status: string;
        created_at: Date;
        exam_id: string | null;
        score_before: Prisma.Decimal;
        score_after: Prisma.Decimal | null;
        scheduled_at: Date | null;
        completed_at: Date | null;
        notes: string | null;
        updated_at: Date;
    }>;
    updateScore(remedialId: string, data: UpdateRemedialScoreDto): Promise<{
        student: {
            id: string;
            batch_id: string;
            major_id: string;
            nis: string;
            nik: string;
            full_name: string;
            gender: string;
            birth_place: string;
            birth_date: Date;
            address: string;
            phone: string;
            email: string;
            status: string;
            health_history: string | null;
            profile_picture: string | null;
            latitude: Prisma.Decimal | null;
            longitude: Prisma.Decimal | null;
            branch_id: string;
            class_id: string | null;
            qr_code: string | null;
            created_at: Date;
            applicant_id: string | null;
        };
        subject: {
            id: string;
            major_id: string | null;
            name: string;
            hours_per_week: number | null;
            passing_grade: number;
            competency_standards: string | null;
        };
    } & {
        id: string;
        student_id: string;
        subject_id: string;
        status: string;
        created_at: Date;
        exam_id: string | null;
        score_before: Prisma.Decimal;
        score_after: Prisma.Decimal | null;
        scheduled_at: Date | null;
        completed_at: Date | null;
        notes: string | null;
        updated_at: Date;
    }>;
    findAll(filters: {
        status?: string;
        subject_id?: string;
        student_id?: string;
    }): Promise<({
        student: {
            id: string;
            class: {
                name: string;
            } | null;
            nis: string;
            full_name: string;
        };
        subject: {
            id: string;
            major_id: string | null;
            name: string;
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
        student_id: string;
        subject_id: string;
        status: string;
        created_at: Date;
        exam_id: string | null;
        score_before: Prisma.Decimal;
        score_after: Prisma.Decimal | null;
        scheduled_at: Date | null;
        completed_at: Date | null;
        notes: string | null;
        updated_at: Date;
    })[]>;
    findOne(id: string): Promise<{
        student: {
            id: string;
            batch: {
                id: string;
                name: string;
                start_date: Date;
                end_date: Date;
                is_active: boolean;
            };
            class: {
                id: string;
                batch_id: string;
                major_id: string;
                name: string;
                grade_level: number;
                homeroom_teacher_id: string | null;
                class_president_id: string | null;
            } | null;
            nis: string;
            full_name: string;
        };
        subject: {
            id: string;
            major_id: string | null;
            name: string;
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
        student_id: string;
        subject_id: string;
        status: string;
        created_at: Date;
        exam_id: string | null;
        score_before: Prisma.Decimal;
        score_after: Prisma.Decimal | null;
        scheduled_at: Date | null;
        completed_at: Date | null;
        notes: string | null;
        updated_at: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        student_id: string;
        subject_id: string;
        status: string;
        created_at: Date;
        exam_id: string | null;
        score_before: Prisma.Decimal;
        score_after: Prisma.Decimal | null;
        scheduled_at: Date | null;
        completed_at: Date | null;
        notes: string | null;
        updated_at: Date;
    }>;
    getStats(): Promise<{
        total: number;
        pending: number;
        scheduled: number;
        completed: number;
        improved_count: number;
        pass_count: number;
        improvement_rate: number;
        pass_rate: number;
    }>;
    private calculateGradeLetter;
}
