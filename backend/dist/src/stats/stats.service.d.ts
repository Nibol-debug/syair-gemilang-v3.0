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
    getGuruDashboardStats(employeeId: string): Promise<{
        totalClasses: number;
        ongoingExams: number;
        upcomingExams: number;
        recentTeachingLogs: ({
            class: {
                id: string;
                major_id: string;
                name: string;
                batch_id: string;
                grade_level: number;
                homeroom_teacher_id: string | null;
            } | null;
            subject: {
                id: string;
                major_id: string | null;
                name: string;
            };
        } & {
            id: string;
            major_id: string;
            class_id: string | null;
            batch_id: string;
            date: Date;
            subject_id: string;
            teacher_id: string;
            note: string;
        })[];
    }>;
    getStudentDashboardStats(studentId: string): Promise<{
        ongoingExams: number;
        attendanceCount: number;
        recentGrades: ({
            subject: {
                id: string;
                major_id: string | null;
                name: string;
            };
        } & {
            id: string;
            major_id: string;
            batch_id: string;
            created_at: Date;
            student_id: string;
            type: string;
            subject_id: string;
            exam_id: string | null;
            score: import("@prisma/client/runtime/library").Decimal;
            weight: import("@prisma/client/runtime/library").Decimal;
        })[];
        unpaidFees: ({
            fee: {
                id: string;
                name: string;
                type: string;
                description: string | null;
                amount: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            status: string;
            student_id: string;
            date: Date;
            fee_id: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            method: string;
        })[];
    }>;
    private getRandomColor;
    getStudentStats(): Promise<{
        total: number;
        male: number;
        female: number;
        active: number;
        alumni: number;
        moved: number;
        ageDistribution: {
            name: string;
            value: number;
        }[];
        locationDistribution: {
            name: string;
            value: number;
        }[];
    }>;
    getEmployeeStats(): Promise<{
        total: number;
        teachers: number;
        staff: number;
    }>;
}
