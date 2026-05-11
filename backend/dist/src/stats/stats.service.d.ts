import { PrismaService } from '../prisma/prisma.service';
export declare class StatsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    private getRandomColor;
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
