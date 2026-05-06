import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    create(createEmployeeDto: CreateEmployeeDto): Promise<{
        id: string;
        full_name: string;
        status: string;
        major_id: string | null;
        education: string;
        position: string;
        join_date: Date;
    }>;
    findAll(pagination: PaginationDto, major_id?: string, search?: string): Promise<{
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
            status: string;
            major_id: string | null;
            education: string;
            position: string;
            join_date: Date;
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
        attendance: {
            id: string;
            employee_id: string;
            status: string;
            date: Date;
        }[];
        documents: {
            id: string;
            employee_id: string;
            type: string;
            file_url: string;
        }[];
    } & {
        id: string;
        full_name: string;
        status: string;
        major_id: string | null;
        education: string;
        position: string;
        join_date: Date;
    }>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<{
        id: string;
        full_name: string;
        status: string;
        major_id: string | null;
        education: string;
        position: string;
        join_date: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        full_name: string;
        status: string;
        major_id: string | null;
        education: string;
        position: string;
        join_date: Date;
    }>;
    uploadDocument(id: string, file: Express.Multer.File, type: string): Promise<{
        id: string;
        employee_id: string;
        type: string;
        file_url: string;
    }>;
}
