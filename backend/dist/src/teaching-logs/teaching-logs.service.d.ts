import { PrismaService } from '../prisma/prisma.service';
import { CreateTeachingLogDto } from './dto/create-teaching-log.dto';
export declare class TeachingLogsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateTeachingLogDto): Promise<{
        id: string;
        major_id: string;
        class_id: string | null;
        batch_id: string;
        date: Date;
        subject_id: string;
        teacher_id: string;
        note: string;
    }>;
    findAll(filters: {
        teacher_id?: string;
        class_id?: string;
    }): Promise<({
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
        date: Date;
        subject_id: string;
        teacher_id: string;
        note: string;
    })[]>;
}
