import { AttendancesService } from './attendances.service';
import { BulkCreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
export declare class AttendancesController {
    private readonly attendancesService;
    constructor(attendancesService: AttendancesService);
    bulkCreate(data: BulkCreateAttendanceDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
    findByClass(classId: string, date: string): Promise<({
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
        schedule: {
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
            class_id: string | null;
            batch_id: string;
            day: string;
            subject_id: string;
            teacher_id: string;
            start_time: string;
            end_time: string;
            room: string | null;
        };
    } & {
        id: string;
        status: string;
        student_id: string;
        date: Date;
        schedule_id: string;
    })[]>;
    getSummary(class_id?: string, month?: string): Promise<{
        total: number;
        hadir: number;
        sakit: number;
        izin: number;
        alfa: number;
    }>;
    findBySchedule(scheduleId: string, date: string): Promise<({
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
        schedule: {
            class: {
                id: string;
                major_id: string;
                name: string;
                batch_id: string;
                grade_level: number;
                homeroom_teacher_id: string | null;
                class_president_id: string | null;
            } | null;
            subject: {
                id: string;
                major_id: string | null;
                name: string;
                passing_grade: number;
                hours_per_week: number | null;
                competency_standards: string | null;
            };
            teacher: {
                id: string;
                full_name: string;
                education: string;
                education_institution: string | null;
                education_degree: string | null;
                education_graduation_year: string | null;
                teaching_specialty: string | null;
                current_rank: string | null;
                current_golongan: string | null;
                certification_status: string | null;
                is_certified: boolean;
                position: string;
                join_date: Date;
                status: string;
                major_id: string | null;
            };
        } & {
            id: string;
            major_id: string;
            class_id: string | null;
            batch_id: string;
            day: string;
            subject_id: string;
            teacher_id: string;
            start_time: string;
            end_time: string;
            room: string | null;
        };
    } & {
        id: string;
        status: string;
        student_id: string;
        date: Date;
        schedule_id: string;
    })[]>;
    update(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<{
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
        schedule: {
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
            class_id: string | null;
            batch_id: string;
            day: string;
            subject_id: string;
            teacher_id: string;
            start_time: string;
            end_time: string;
            room: string | null;
        };
    } & {
        id: string;
        status: string;
        student_id: string;
        date: Date;
        schedule_id: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        status: string;
        student_id: string;
        date: Date;
        schedule_id: string;
    }>;
}
