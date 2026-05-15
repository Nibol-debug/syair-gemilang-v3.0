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
            address: string;
            phone: string;
            id: string;
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
        class_id: string | null;
        branch_id: string;
        major_id: string;
        batch_id: string;
        gender: string;
        nis: string;
        nik: string;
        full_name: string;
        birth_place: string;
        birth_date: Date;
        address: string;
        phone: string;
        email: string;
        health_history: string | null;
        profile_picture: string | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        status: string;
        id: string;
        qr_code: string | null;
        created_at: Date;
        applicant_id: string | null;
    }>;
    findAll(query: StudentQueryDto): Promise<{
        data: ({
            major: {
                branch_id: string;
                id: string;
                created_at: Date;
                name: string;
                code: string;
            };
            branch: {
                id: string;
                created_at: Date;
                name: string;
            };
            batch: {
                id: string;
                name: string;
                start_date: Date;
                end_date: Date;
                is_active: boolean;
            };
            class: {
                major_id: string;
                batch_id: string;
                id: string;
                name: string;
                grade_level: number;
                homeroom_teacher_id: string | null;
                class_president_id: string | null;
            } | null;
            parents: {
                address: string;
                phone: string;
                id: string;
                student_id: string;
                father_name: string;
                mother_name: string;
            }[];
        } & {
            class_id: string | null;
            branch_id: string;
            major_id: string;
            batch_id: string;
            gender: string;
            nis: string;
            nik: string;
            full_name: string;
            birth_place: string;
            birth_date: Date;
            address: string;
            phone: string;
            email: string;
            health_history: string | null;
            profile_picture: string | null;
            latitude: import("@prisma/client/runtime/library").Decimal | null;
            longitude: import("@prisma/client/runtime/library").Decimal | null;
            status: string;
            id: string;
            qr_code: string | null;
            created_at: Date;
            applicant_id: string | null;
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
        major: {
            branch_id: string;
            id: string;
            created_at: Date;
            name: string;
            code: string;
        };
        branch: {
            id: string;
            created_at: Date;
            name: string;
        };
        batch: {
            id: string;
            name: string;
            start_date: Date;
            end_date: Date;
            is_active: boolean;
        };
        class: {
            major_id: string;
            batch_id: string;
            id: string;
            name: string;
            grade_level: number;
            homeroom_teacher_id: string | null;
            class_president_id: string | null;
        } | null;
        parents: {
            address: string;
            phone: string;
            id: string;
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
        class_id: string | null;
        branch_id: string;
        major_id: string;
        batch_id: string;
        gender: string;
        nis: string;
        nik: string;
        full_name: string;
        birth_place: string;
        birth_date: Date;
        address: string;
        phone: string;
        email: string;
        health_history: string | null;
        profile_picture: string | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        status: string;
        id: string;
        qr_code: string | null;
        created_at: Date;
        applicant_id: string | null;
    }>;
    update(id: string, updateStudentDto: UpdateStudentDto): Promise<{
        branch: {
            id: string;
            created_at: Date;
            name: string;
        };
        parents: {
            address: string;
            phone: string;
            id: string;
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
        class_id: string | null;
        branch_id: string;
        major_id: string;
        batch_id: string;
        gender: string;
        nis: string;
        nik: string;
        full_name: string;
        birth_place: string;
        birth_date: Date;
        address: string;
        phone: string;
        email: string;
        health_history: string | null;
        profile_picture: string | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        status: string;
        id: string;
        qr_code: string | null;
        created_at: Date;
        applicant_id: string | null;
    }>;
    remove(id: string): Promise<{
        class_id: string | null;
        branch_id: string;
        major_id: string;
        batch_id: string;
        gender: string;
        nis: string;
        nik: string;
        full_name: string;
        birth_place: string;
        birth_date: Date;
        address: string;
        phone: string;
        email: string;
        health_history: string | null;
        profile_picture: string | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        status: string;
        id: string;
        qr_code: string | null;
        created_at: Date;
        applicant_id: string | null;
    }>;
}
