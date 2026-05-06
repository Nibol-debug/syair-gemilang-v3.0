import { AttendancesService } from './attendances.service';
import { BulkCreateAttendanceDto } from './dto/create-attendance.dto';
export declare class AttendancesController {
    private readonly attendancesService;
    constructor(attendancesService: AttendancesService);
    bulkCreate(data: BulkCreateAttendanceDto): Promise<import("@prisma/client").Prisma.BatchPayload>;
    findByClass(classId: string, date: string): Promise<({
        student: {
            id: string;
            phone: string;
            address: string;
            nis: string;
            nik: string;
            full_name: string;
            gender: string;
            birth_place: string;
            birth_date: Date;
            email: string;
            class_id: string;
            status: string;
            major_id: string;
            batch_id: string;
            qr_code: string | null;
            created_at: Date;
        };
        schedule: {
            subject: {
                id: string;
                name: string;
                major_id: string | null;
            };
        } & {
            id: string;
            class_id: string;
            day: string;
            subject_id: string;
            teacher_id: string;
            start_time: string;
            end_time: string;
        };
    } & {
        id: string;
        student_id: string;
        status: string;
        date: Date;
        schedule_id: string;
    })[]>;
}
