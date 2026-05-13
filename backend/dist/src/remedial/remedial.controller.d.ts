import { RemedialService } from './remedial.service';
import { CreateRemedialDto, ScheduleRemedialDto, UpdateRemedialScoreDto } from './dto/remedial.dto';
export declare class RemedialController {
    private readonly remedialService;
    constructor(remedialService: RemedialService);
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
    findAll(status?: string, subjectId?: string, studentId?: string): Promise<({
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
        score_before: import("@prisma/client/runtime/library").Decimal;
        scheduled_at: Date | null;
        notes: string | null;
        score_after: import("@prisma/client/runtime/library").Decimal | null;
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
        score_before: import("@prisma/client/runtime/library").Decimal;
        scheduled_at: Date | null;
        notes: string | null;
        score_after: import("@prisma/client/runtime/library").Decimal | null;
        completed_at: Date | null;
        updated_at: Date;
    }>;
    create(createRemedialDto: CreateRemedialDto): Promise<{
        student: {
            id: string;
            full_name: string;
            nis: string;
        };
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
        status: string;
        created_at: Date;
        student_id: string;
        subject_id: string;
        exam_id: string | null;
        score_before: import("@prisma/client/runtime/library").Decimal;
        scheduled_at: Date | null;
        notes: string | null;
        score_after: import("@prisma/client/runtime/library").Decimal | null;
        completed_at: Date | null;
        updated_at: Date;
    }>;
    schedule(id: string, data: ScheduleRemedialDto): Promise<{
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
            latitude: import("@prisma/client/runtime/library").Decimal | null;
            longitude: import("@prisma/client/runtime/library").Decimal | null;
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
        score_before: import("@prisma/client/runtime/library").Decimal;
        scheduled_at: Date | null;
        notes: string | null;
        score_after: import("@prisma/client/runtime/library").Decimal | null;
        completed_at: Date | null;
        updated_at: Date;
    }>;
    updateScore(id: string, data: UpdateRemedialScoreDto): Promise<{
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
            latitude: import("@prisma/client/runtime/library").Decimal | null;
            longitude: import("@prisma/client/runtime/library").Decimal | null;
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
        };
    } & {
        id: string;
        status: string;
        created_at: Date;
        student_id: string;
        subject_id: string;
        exam_id: string | null;
        score_before: import("@prisma/client/runtime/library").Decimal;
        scheduled_at: Date | null;
        notes: string | null;
        score_after: import("@prisma/client/runtime/library").Decimal | null;
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
        score_before: import("@prisma/client/runtime/library").Decimal;
        scheduled_at: Date | null;
        notes: string | null;
        score_after: import("@prisma/client/runtime/library").Decimal | null;
        completed_at: Date | null;
        updated_at: Date;
    }>;
}
