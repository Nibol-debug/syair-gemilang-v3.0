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
            father_name: string;
            mother_name: string;
            student_id: string;
        }[];
        histories: {
            id: string;
            type: string;
            description: string;
            date: Date;
            student_id: string;
        }[];
    } & {
        id: string;
        nis: string;
        nik: string;
        full_name: string;
        gender: string;
        birth_place: string;
        birth_date: Date;
        address: string;
        phone: string;
        email: string;
        status: string;
        health_history: string | null;
        profile_picture: string | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        qr_code: string | null;
        created_at: Date;
        branch_id: string;
        class_id: string | null;
        major_id: string;
        batch_id: string;
    }>;
    findAll(query: StudentQueryDto): Promise<{
        data: ({
            branch: {
                id: string;
                created_at: Date;
                name: string;
            };
            class: {
                id: string;
                major_id: string;
                batch_id: string;
                name: string;
                grade_level: number;
                homeroom_teacher_id: string | null;
            } | null;
            major: {
                id: string;
                created_at: Date;
                branch_id: string;
                name: string;
                code: string;
            };
            batch: {
                id: string;
                name: string;
                start_date: Date;
                end_date: Date;
                is_active: boolean;
            };
            parents: {
                id: string;
                address: string;
                phone: string;
                father_name: string;
                mother_name: string;
                student_id: string;
            }[];
        } & {
            id: string;
            nis: string;
            nik: string;
            full_name: string;
            gender: string;
            birth_place: string;
            birth_date: Date;
            address: string;
            phone: string;
            email: string;
            status: string;
            health_history: string | null;
            profile_picture: string | null;
            latitude: import("@prisma/client/runtime/library").Decimal | null;
            longitude: import("@prisma/client/runtime/library").Decimal | null;
            qr_code: string | null;
            created_at: Date;
            branch_id: string;
            class_id: string | null;
            major_id: string;
            batch_id: string;
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
    uploadPhoto(file: Express.Multer.File): {
        url: string;
    };
    findOne(id: string): Promise<{
        branch: {
            id: string;
            created_at: Date;
            name: string;
        };
        class: {
            id: string;
            major_id: string;
            batch_id: string;
            name: string;
            grade_level: number;
            homeroom_teacher_id: string | null;
        } | null;
        major: {
            id: string;
            created_at: Date;
            branch_id: string;
            name: string;
            code: string;
        };
        batch: {
            id: string;
            name: string;
            start_date: Date;
            end_date: Date;
            is_active: boolean;
        };
        parents: {
            id: string;
            address: string;
            phone: string;
            father_name: string;
            mother_name: string;
            student_id: string;
        }[];
        histories: {
            id: string;
            type: string;
            description: string;
            date: Date;
            student_id: string;
        }[];
    } & {
        id: string;
        nis: string;
        nik: string;
        full_name: string;
        gender: string;
        birth_place: string;
        birth_date: Date;
        address: string;
        phone: string;
        email: string;
        status: string;
        health_history: string | null;
        profile_picture: string | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        qr_code: string | null;
        created_at: Date;
        branch_id: string;
        class_id: string | null;
        major_id: string;
        batch_id: string;
    }>;
    update(id: string, updateStudentDto: UpdateStudentDto): Promise<{
        branch: {
            id: string;
            created_at: Date;
            name: string;
        };
        parents: {
            id: string;
            address: string;
            phone: string;
            father_name: string;
            mother_name: string;
            student_id: string;
        }[];
        histories: {
            id: string;
            type: string;
            description: string;
            date: Date;
            student_id: string;
        }[];
    } & {
        id: string;
        nis: string;
        nik: string;
        full_name: string;
        gender: string;
        birth_place: string;
        birth_date: Date;
        address: string;
        phone: string;
        email: string;
        status: string;
        health_history: string | null;
        profile_picture: string | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        qr_code: string | null;
        created_at: Date;
        branch_id: string;
        class_id: string | null;
        major_id: string;
        batch_id: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        nis: string;
        nik: string;
        full_name: string;
        gender: string;
        birth_place: string;
        birth_date: Date;
        address: string;
        phone: string;
        email: string;
        status: string;
        health_history: string | null;
        profile_picture: string | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        qr_code: string | null;
        created_at: Date;
        branch_id: string;
        class_id: string | null;
        major_id: string;
        batch_id: string;
    }>;
}
