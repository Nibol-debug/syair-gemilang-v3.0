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
    recordBulkAttendance(body: {
        date: string;
        attendances: any[];
    }): Promise<{
        count: number;
    }>;
}
