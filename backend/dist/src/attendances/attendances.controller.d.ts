import { AttendancesService } from './attendances.service';
import { BulkCreateAttendanceDto } from './dto/create-attendance.dto';
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
        };
        schedule: {
            subject: {
                id: string;
                major_id: string | null;
                name: string;
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
        };
    } & {
        id: string;
        status: string;
        student_id: string;
        date: Date;
        schedule_id: string;
    })[]>;
}
