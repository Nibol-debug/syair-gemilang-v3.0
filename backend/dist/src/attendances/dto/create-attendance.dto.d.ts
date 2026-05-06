export declare class CreateAttendanceDto {
    student_id: string;
    schedule_id: string;
    date: Date;
    status: string;
}
export declare class BulkCreateAttendanceDto {
    schedule_id: string;
    date: Date;
    attendances: {
        student_id: string;
        status: string;
    }[];
}
