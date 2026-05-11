import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
export declare class SchedulesController {
    private readonly schedulesService;
    constructor(schedulesService: SchedulesService);
    create(createScheduleDto: CreateScheduleDto): Promise<{
        id: string;
        major_id: string;
        class_id: string | null;
        batch_id: string;
        day: string;
        subject_id: string;
        teacher_id: string;
        start_time: string;
        end_time: string;
    }>;
    findAll(class_id?: string, teacher_id?: string, day?: string): Promise<({
        class: {
            id: string;
            major_id: string;
            name: string;
            batch_id: string;
            grade_level: number;
            homeroom_teacher_id: string | null;
        } | null;
        subject: {
            id: string;
            major_id: string | null;
            name: string;
        };
        teacher: {
            id: string;
            full_name: string;
            education: string;
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
    })[]>;
    remove(id: string): Promise<{
        id: string;
        major_id: string;
        class_id: string | null;
        batch_id: string;
        day: string;
        subject_id: string;
        teacher_id: string;
        start_time: string;
        end_time: string;
    }>;
}
