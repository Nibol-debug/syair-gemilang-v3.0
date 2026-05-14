import { PrismaService } from '../prisma/prisma.service';
import { CreateRemedialDto, ScheduleRemedialDto, UpdateRemedialScoreDto } from './dto/remedial.dto';
import { Prisma } from '@prisma/client';
export declare class RemedialService {
    private prisma;
    constructor(prisma: PrismaService);
    getStudentsNeedingRemedial(subjectId: string, classId?: string, semester?: number): Promise<{
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
            full_name: string;
            nis: string;
        };
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
        } | null;
    } & {
        id: string;
        status: string;
        created_at: Date;
        student_id: string;
        subject_id: string;
        exam_id: string | null;
        score_before: Prisma.Decimal;
        scheduled_at: Date | null;
        notes: string | null;
        score_after: Prisma.Decimal | null;
        completed_at: Date | null;
        updated_at: Date;
    }>;
    schedule(remedialId: string, data: ScheduleRemedialDto): Promise<{
        student: {
            id: string;
            full_name: string;
            status: string;
            major_id: string;
            nis: string;
            nik: string;
            gender: string;
            birth_place: string;
            birth_date: Date;
            address: string;
            phone: string;
            email: string;
            health_history: string | null;
            profile_picture: string | null;
            latitude: Prisma.Decimal | null;
            longitude: Prisma.Decimal | null;
            branch_id: string;
            class_id: string | null;
            batch_id: string;
            qr_code: string | null;
            created_at: Date;
            applicant_id: string | null;
        };
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
        } | null;
    } & {
        id: string;
        status: string;
        created_at: Date;
        student_id: string;
        subject_id: string;
        exam_id: string | null;
        score_before: Prisma.Decimal;
        scheduled_at: Date | null;
        notes: string | null;
        score_after: Prisma.Decimal | null;
        completed_at: Date | null;
        updated_at: Date;
    }>;
    updateScore(remedialId: string, data: UpdateRemedialScoreDto): Promise<{
        student: {
            id: string;
            full_name: string;
            status: string;
            major_id: string;
            nis: string;
            nik: string;
            gender: string;
            birth_place: string;
            birth_date: Date;
            address: string;
            phone: string;
            email: string;
            health_history: string | null;
            profile_picture: string | null;
            latitude: Prisma.Decimal | null;
            longitude: Prisma.Decimal | null;
            branch_id: string;
            class_id: string | null;
            batch_id: string;
            qr_code: string | null;
            created_at: Date;
            applicant_id: string | null;
        };
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
        status: string;
        created_at: Date;
        student_id: string;
        subject_id: string;
        exam_id: string | null;
        score_before: Prisma.Decimal;
        scheduled_at: Date | null;
        notes: string | null;
        score_after: Prisma.Decimal | null;
        completed_at: Date | null;
        updated_at: Date;
    }>;
    findAll(filters: {
        status?: string;
        subject_id?: string;
        student_id?: string;
    }): Promise<({
        student: {
            id: string;
            full_name: string;
            nis: string;
            class: {
                name: string;
            } | null;
        };
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
        } | null;
    } & {
        id: string;
        status: string;
        created_at: Date;
        student_id: string;
        subject_id: string;
        exam_id: string | null;
        score_before: Prisma.Decimal;
        scheduled_at: Date | null;
        notes: string | null;
        score_after: Prisma.Decimal | null;
        completed_at: Date | null;
        updated_at: Date;
    })[]>;
    findOne(id: string): Promise<{
        student: {
            id: string;
            full_name: string;
            nis: string;
            class: {
                id: string;
                major_id: string;
                name: string;
                batch_id: string;
                grade_level: number;
                homeroom_teacher_id: string | null;
                class_president_id: string | null;
            } | null;
            batch: {
                id: string;
                name: string;
                start_date: Date;
                end_date: Date;
                is_active: boolean;
            };
        };
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
        } | null;
    } & {
        id: string;
        status: string;
        created_at: Date;
        student_id: string;
        subject_id: string;
        exam_id: string | null;
        score_before: Prisma.Decimal;
        scheduled_at: Date | null;
        notes: string | null;
        score_after: Prisma.Decimal | null;
        completed_at: Date | null;
        updated_at: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        status: string;
        created_at: Date;
        student_id: string;
        subject_id: string;
        exam_id: string | null;
        score_before: Prisma.Decimal;
        scheduled_at: Date | null;
        notes: string | null;
        score_after: Prisma.Decimal | null;
        completed_at: Date | null;
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
