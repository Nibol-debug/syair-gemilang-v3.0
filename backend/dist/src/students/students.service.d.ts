import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import type { Response } from 'express';
export declare class StudentsService {
    private prisma;
    constructor(prisma: PrismaService);
    finalizeRegistration(id: string): Promise<{
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
        health_history: string | null;
        profile_picture: string | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        branch_id: string;
        class_id: string | null;
        batch_id: string;
        qr_code: string | null;
        created_at: Date;
        applicant_id: string | null;
    }>;
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
        health_history: string | null;
        profile_picture: string | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        branch_id: string;
        class_id: string | null;
        batch_id: string;
        qr_code: string | null;
        created_at: Date;
        applicant_id: string | null;
    }>;
    findAll(pagination: PaginationDto, filters: {
        class_id?: string;
        major_id?: string;
        batch_id?: string;
        branch_id?: string;
        search?: string;
    }): Promise<{
        data: ({
            major: {
                id: string;
                name: string;
                branch_id: string;
                created_at: Date;
                code: string;
            };
            branch: {
                id: string;
                name: string;
                created_at: Date;
            };
            class: {
                id: string;
                major_id: string;
                name: string;
                batch_id: string;
                grade_level: number;
                homeroom_teacher_id: string | null;
                class_president_id: string | null;
            } | null;
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
            health_history: string | null;
            profile_picture: string | null;
            latitude: import("@prisma/client/runtime/library").Decimal | null;
            longitude: import("@prisma/client/runtime/library").Decimal | null;
            branch_id: string;
            class_id: string | null;
            batch_id: string;
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
    findOne(id: string): Promise<{
        major: {
            id: string;
            name: string;
            branch_id: string;
            created_at: Date;
            code: string;
        };
        branch: {
            id: string;
            name: string;
            created_at: Date;
        };
        class: {
            id: string;
            major_id: string;
            name: string;
            batch_id: string;
            grade_level: number;
            homeroom_teacher_id: string | null;
            class_president_id: string | null;
        } | null;
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
        health_history: string | null;
        profile_picture: string | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        branch_id: string;
        class_id: string | null;
        batch_id: string;
        qr_code: string | null;
        created_at: Date;
        applicant_id: string | null;
    }>;
    update(id: string, updateStudentDto: UpdateStudentDto): Promise<{
        branch: {
            id: string;
            name: string;
            created_at: Date;
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
        health_history: string | null;
        profile_picture: string | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        branch_id: string;
        class_id: string | null;
        batch_id: string;
        qr_code: string | null;
        created_at: Date;
        applicant_id: string | null;
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
        health_history: string | null;
        profile_picture: string | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        branch_id: string;
        class_id: string | null;
        batch_id: string;
        qr_code: string | null;
        created_at: Date;
        applicant_id: string | null;
    }>;
    exportToExcel(res: Response): Promise<void>;
    importFromExcel(file: Express.Multer.File): Promise<{
        imported: number;
    }>;
    bulkPromote(fromClassId: string, toClassId: string): Promise<{
        promoted: number;
        message: string;
        from?: undefined;
        to?: undefined;
    } | {
        promoted: number;
        from: string;
        to: string;
        message?: undefined;
    }>;
}
