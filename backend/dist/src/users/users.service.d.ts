import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        employee: {
            id: string;
            full_name: string;
            education: string;
            position: string;
            join_date: Date;
            status: string;
        } | null;
        student: {
            id: string;
            full_name: string;
            gender: string;
            birth_place: string;
            birth_date: Date;
            address: string;
            phone: string;
            email: string;
            profile_picture: string | null;
        } | null;
        role: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        username: string;
        student_id: string | null;
        employee_id: string | null;
        password_hash: string;
        role_id: string;
    }>;
    updateProfile(userId: string, data: {
        username?: string;
        email?: string;
        phone?: string;
        profile_picture?: string;
        student?: {
            full_name?: string;
            gender?: string;
            birth_place?: string;
            birth_date?: string;
            address?: string;
        };
        employee?: {
            full_name?: string;
            education?: string;
            position?: string;
        };
    }): Promise<{
        id: string;
        username: string;
        student_id: string | null;
        employee_id: string | null;
        password_hash: string;
        role_id: string;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        id: string;
        username: string;
        student_id: string | null;
        employee_id: string | null;
        password_hash: string;
        role_id: string;
    }>;
    findAll(params: {
        page?: number;
        limit?: number;
        search?: string;
        roleId?: string;
    }): Promise<{
        items: ({
            employee: {
                full_name: string;
            } | null;
            student: {
                full_name: string;
                email: string;
            } | null;
            role: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            username: string;
            student_id: string | null;
            employee_id: string | null;
            password_hash: string;
            role_id: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(username: string): Promise<({
        role: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        username: string;
        student_id: string | null;
        employee_id: string | null;
        password_hash: string;
        role_id: string;
    }) | null>;
    findById(id: string): Promise<{
        employee: {
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
        } | null;
        student: {
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
        } | null;
        role: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        username: string;
        student_id: string | null;
        employee_id: string | null;
        password_hash: string;
        role_id: string;
    }>;
    create(data: {
        username: string;
        password_hash: string;
        role_id: string;
        student_id?: string;
        employee_id?: string;
    }): Promise<{
        id: string;
        username: string;
        student_id: string | null;
        employee_id: string | null;
        password_hash: string;
        role_id: string;
    }>;
    update(id: string, data: {
        username?: string;
        password?: string;
        role_id?: string;
    }): Promise<{
        id: string;
        username: string;
        student_id: string | null;
        employee_id: string | null;
        password_hash: string;
        role_id: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        username: string;
        student_id: string | null;
        employee_id: string | null;
        password_hash: string;
        role_id: string;
    }>;
    getDevices(userId: string): Promise<{
        id: string;
        is_active: boolean;
        user_id: string;
        device_id: string;
    }[]>;
    toggleDeviceStatus(userId: string, deviceId: string, isActive: boolean): Promise<{
        id: string;
        is_active: boolean;
        user_id: string;
        device_id: string;
    }>;
}
