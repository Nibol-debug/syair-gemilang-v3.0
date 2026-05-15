import { EmployeesService } from './employees.service';
export declare class EmployeeAttendanceController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    getDailyAttendance(date: string): Promise<{
        id: string;
        full_name: string;
        position: string;
        major: string;
        status: string;
    }[]>;
    getMonthlyAttendance(month: string): Promise<{
        id: string;
        full_name: string;
        position: string;
        major: string;
        hadir: number;
        izin: number;
        alpa: number;
        total_days: number;
    }[]>;
    recordSelfAttendance(req: any): Promise<{
        id: string;
        status: string;
        employee_id: string;
        date: Date;
    }>;
    recordBulkAttendance(body: {
        date: string;
        attendances: any[];
    }): Promise<{
        count: number;
    }>;
}
