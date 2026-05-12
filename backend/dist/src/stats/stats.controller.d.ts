import { StatsService } from './stats.service';
export declare class StatsController {
    private readonly statsService;
    constructor(statsService: StatsService);
    getDashboardStats(req: any): Promise<{
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
    }> | Promise<{
        totalClasses: number;
        ongoingExams: number;
        upcomingExams: number;
        recentTeachingLogs: ({
            class: {
                id: string;
                name: string;
                homeroom_teacher_id: string | null;
                major_id: string;
                batch_id: string;
                grade_level: number;
            } | null;
            subject: {
                id: string;
                name: string;
                major_id: string | null;
            };
        } & {
            id: string;
            teacher_id: string;
            class_id: string | null;
            major_id: string;
            batch_id: string;
            subject_id: string;
            note: string;
            date: Date;
        })[];
    }> | Promise<{
        ongoingExams: number;
        attendanceCount: number;
        recentGrades: ({
            subject: {
                id: string;
                name: string;
                major_id: string | null;
            };
        } & {
            id: string;
            created_at: Date;
            major_id: string;
            batch_id: string;
            subject_id: string;
            student_id: string;
            type: string;
            score: import("@prisma/client/runtime/library").Decimal;
            weight: import("@prisma/client/runtime/library").Decimal;
            exam_id: string | null;
        })[];
        unpaidFees: ({
            fee: {
                id: string;
                name: string;
                type: string;
                amount: import("@prisma/client/runtime/library").Decimal;
                description: string | null;
            };
        } & {
            status: string;
            id: string;
            date: Date;
            student_id: string;
            fee_id: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            method: string;
        })[];
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
