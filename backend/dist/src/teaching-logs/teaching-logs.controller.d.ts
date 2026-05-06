import { TeachingLogsService } from './teaching-logs.service';
import { CreateTeachingLogDto } from './dto/create-teaching-log.dto';
export declare class TeachingLogsController {
    private readonly teachingLogsService;
    constructor(teachingLogsService: TeachingLogsService);
    create(createTeachingLogDto: CreateTeachingLogDto): Promise<{
        id: string;
        class_id: string;
        date: Date;
        subject_id: string;
        teacher_id: string;
        note: string;
    }>;
    findAll(teacher_id?: string, class_id?: string): Promise<({
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
        date: Date;
        subject_id: string;
        teacher_id: string;
        note: string;
    })[]>;
}
