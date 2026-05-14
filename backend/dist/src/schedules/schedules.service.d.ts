import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
export declare class SchedulesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateScheduleDto): Promise<{
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
    }>;
    findAll(filters: {
        class_id?: string;
        teacher_id?: string;
        day?: string;
    }): Promise<({
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
        room: string | null;
    }>;
}
