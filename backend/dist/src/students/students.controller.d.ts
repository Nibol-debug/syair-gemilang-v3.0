import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentQueryDto } from './dto/student-query.dto';
import type { Response } from 'express';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    create(createStudentDto: CreateStudentDto): Promise<{
        parents: {
            id: string;
            address: string;
            phone: string;
            student_id: string;
            father_name: string;
            mother_name: string;
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
        full_name: string;
        status: string;
        major_id: string;
        nis: string;
        nik: string;
        gender: string;
        birth_place: string;
        birth_date: Date;
        address: string;
        phone: string;
        email: string;
        class_id: string | null;
        batch_id: string;
        qr_code: string | null;
        created_at: Date;
    }>;
    findAll(query: StudentQueryDto): Promise<{
        data: ({
            major: {
                id: string;
                name: string;
                created_at: Date;
                code: string;
            };
            class: {
                id: string;
                major_id: string;
                name: string;
                batch_id: string;
                grade_level: number;
                homeroom_teacher_id: string | null;
            } | null;
            batch: {
                id: string;
                name: string;
                year_start: number;
                year_end: number;
                is_active: boolean;
            };
            parents: {
                id: string;
                address: string;
                phone: string;
                student_id: string;
                father_name: string;
                mother_name: string;
            }[];
        } & {
            id: string;
            full_name: string;
            status: string;
            major_id: string;
            nis: string;
            nik: string;
            gender: string;
            birth_place: string;
            birth_date: Date;
            address: string;
            phone: string;
            email: string;
            class_id: string | null;
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
        class: {
            id: string;
            major_id: string;
            name: string;
            batch_id: string;
            grade_level: number;
            homeroom_teacher_id: string | null;
        } | null;
        batch: {
            id: string;
            name: string;
            year_start: number;
            year_end: number;
            is_active: boolean;
        };
        parents: {
            id: string;
            address: string;
            phone: string;
            student_id: string;
            father_name: string;
            mother_name: string;
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
        full_name: string;
        status: string;
        major_id: string;
        nis: string;
        nik: string;
        gender: string;
        birth_place: string;
        birth_date: Date;
        address: string;
        phone: string;
        email: string;
        class_id: string | null;
        batch_id: string;
        qr_code: string | null;
        created_at: Date;
    }>;
    update(id: string, updateStudentDto: UpdateStudentDto): Promise<{
        parents: {
            id: string;
            address: string;
            phone: string;
            student_id: string;
            father_name: string;
            mother_name: string;
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
        full_name: string;
        status: string;
        major_id: string;
        nis: string;
        nik: string;
        gender: string;
        birth_place: string;
        birth_date: Date;
        address: string;
        phone: string;
        email: string;
        class_id: string | null;
        batch_id: string;
        qr_code: string | null;
        created_at: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        full_name: string;
        status: string;
        major_id: string;
        nis: string;
        nik: string;
        gender: string;
        birth_place: string;
        birth_date: Date;
        address: string;
        phone: string;
        email: string;
        class_id: string | null;
        batch_id: string;
        qr_code: string | null;
        created_at: Date;
    }>;
}
