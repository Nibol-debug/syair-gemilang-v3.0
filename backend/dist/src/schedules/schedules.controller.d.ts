import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
export declare class SchedulesController {
    private readonly schedulesService;
    constructor(schedulesService: SchedulesService);
    create(createScheduleDto: CreateScheduleDto): Promise<{
        id: string;
        class_id: string;
        day: string;
        subject_id: string;
        teacher_id: string;
        start_time: string;
        end_time: string;
    }>;
    findAll(class_id?: string, teacher_id?: string, day?: string): Promise<({
        class: {
            id: string;
            name: string;
            grade_level: number;
            major_id: string;
            batch_id: string;
            homeroom_teacher_id: string | null;
        };
        subject: {
            id: string;
            name: string;
            major_id: string | null;
        };
        teacher: {
            id: string;
            full_name: string;
            status: string;
            major_id: string | null;
            education: string;
            position: string;
            join_date: Date;
        };
    } & {
        id: string;
        class_id: string;
        day: string;
        subject_id: string;
        teacher_id: string;
        start_time: string;
        end_time: string;
    })[]>;
    remove(id: string): Promise<{
        id: string;
        class_id: string;
        day: string;
        subject_id: string;
        teacher_id: string;
        start_time: string;
        end_time: string;
    }>;
}
