import { StatsService } from './stats.service';
export declare class StatsController {
    private readonly statsService;
    constructor(statsService: StatsService);
    getDashboardStats(): Promise<{
        overview: {
            totalStudents: number;
            totalEmployees: number;
            applicantPPDB: number;
            ongoingExams: number;
            todayAttendance: number;
            attendancePercentage: number;
            totalPayments: number;
            paymentPercentage: number;
            totalAssets: number;
            systemUsers: number;
        };
        majorDistribution: {
            name: string;
            value: number;
            color: string;
        }[];
    }>;
    getStudentStats(): Promise<{
        total: number;
        male: number;
        female: number;
        active: number;
        alumni: number;
        moved: number;
    }>;
    getEmployeeStats(): Promise<{
        total: number;
        teachers: number;
        staff: number;
    }>;
}
