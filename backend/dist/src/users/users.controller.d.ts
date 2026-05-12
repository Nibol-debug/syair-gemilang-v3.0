import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(page?: number, limit?: number, search?: string, roleId?: string): Promise<{
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
    findOne(id: string): Promise<{
        employee: {
            id: string;
            full_name: string;
            education: string;
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
            class_id: string | null;
            batch_id: string;
            qr_code: string | null;
            created_at: Date;
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
    create(data: any): Promise<{
        id: string;
        username: string;
        student_id: string | null;
        employee_id: string | null;
        password_hash: string;
        role_id: string;
    }>;
    update(id: string, data: any): Promise<{
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
    getDevices(id: string): Promise<{
        id: string;
        is_active: boolean;
        user_id: string;
        device_id: string;
    }[]>;
    toggleDevice(id: string, deviceId: string, isActive: boolean): Promise<{
        id: string;
        is_active: boolean;
        user_id: string;
        device_id: string;
    }>;
}
