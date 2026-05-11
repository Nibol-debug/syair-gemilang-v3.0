import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class EmployeesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createEmployeeDto: CreateEmployeeDto): Promise<{
        id: string;
        full_name: string;
        education: string;
        position: string;
        join_date: Date;
        status: string;
        major_id: string | null;
    }>;
    findAll(pagination: PaginationDto, filters: {
        major_id?: string;
        search?: string;
    }): Promise<{
        data: ({
            major: {
                id: string;
                name: string;
                created_at: Date;
                code: string;
            } | null;
        } & {
            id: string;
            full_name: string;
            education: string;
            position: string;
            join_date: Date;
            status: string;
            major_id: string | null;
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
            created_at: Date;
            code: string;
        } | null;
        documents: {
            id: string;
            employee_id: string;
            type: string;
            file_url: string;
        }[];
        attendance: {
            id: string;
            status: string;
            employee_id: string;
            date: Date;
        }[];
    } & {
        id: string;
        full_name: string;
        education: string;
        position: string;
        join_date: Date;
        status: string;
        major_id: string | null;
    }>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<{
        id: string;
        full_name: string;
        education: string;
        position: string;
        join_date: Date;
        status: string;
        major_id: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        full_name: string;
        education: string;
        position: string;
        join_date: Date;
        status: string;
        major_id: string | null;
    }>;
    addDocument(employeeId: string, fileUrl: string, type: string): Promise<{
        id: string;
        employee_id: string;
        type: string;
        file_url: string;
    }>;
}
