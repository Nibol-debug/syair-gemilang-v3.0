import { PrismaService } from '../prisma/prisma.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
export declare class AcademicCalendarService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateCalendarDto): Promise<{
        id: string;
        type: string;
        date: Date;
        title: string;
    }>;
    findAll(): Promise<{
        id: string;
        type: string;
        date: Date;
        title: string;
    }[]>;
    remove(id: string): Promise<{
        id: string;
        type: string;
        date: Date;
        title: string;
    }>;
}
