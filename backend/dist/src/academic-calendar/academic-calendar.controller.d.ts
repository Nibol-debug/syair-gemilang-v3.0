import { AcademicCalendarService } from './academic-calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
export declare class AcademicCalendarController {
    private readonly academicCalendarService;
    constructor(academicCalendarService: AcademicCalendarService);
    create(createCalendarDto: CreateCalendarDto): Promise<{
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
    findOne(id: string): Promise<{
        id: string;
        type: string;
        date: Date;
        title: string;
    }>;
    update(id: string, updateCalendarDto: UpdateCalendarDto): Promise<{
        id: string;
        type: string;
        date: Date;
        title: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        type: string;
        date: Date;
        title: string;
    }>;
}
