import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import type { Response } from 'express';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    create(createStudentDto: CreateStudentDto): Promise<{
        parents: {
            id: string;
            student_id: string;
            father_name: string;
            mother_name: string;
            phone: string;
            address: string;
        }[];
        histories: {
            id: string;
            student_id: string;
            type: string;
            description: string;
            date: Date;
        }[];
    } & {
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
    }>;
    findAll(pagination: PaginationDto, class_id?: string, major_id?: string, batch_id?: string, search?: string): Promise<{
        data: ({
            major: {
                id: string;
                name: string;
                created_at: Date;
                code: string;
            };
            batch: {
                id: string;
                name: string;
                year_start: number;
                year_end: number;
                is_active: boolean;
            };
            class: {
                id: string;
                name: string;
                grade_level: number;
                major_id: string;
                batch_id: string;
                homeroom_teacher_id: string | null;
            };
        } & {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            last_page: number;
        };
    }>;
    export(res: Response): Promise<void>;
    import(file: Express.Multer.File): Promise<{
        imported: number;
    }>;
    findOne(id: string): Promise<{
        major: {
            id: string;
            name: string;
            created_at: Date;
            code: string;
        };
        batch: {
            id: string;
            name: string;
            year_start: number;
            year_end: number;
            is_active: boolean;
        };
        class: {
            id: string;
            name: string;
            grade_level: number;
            major_id: string;
            batch_id: string;
            homeroom_teacher_id: string | null;
        };
        parents: {
            id: string;
            student_id: string;
            father_name: string;
            mother_name: string;
            phone: string;
            address: string;
        }[];
        histories: {
            id: string;
            student_id: string;
            type: string;
            description: string;
            date: Date;
        }[];
    } & {
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
    }>;
    update(id: string, updateStudentDto: UpdateStudentDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
