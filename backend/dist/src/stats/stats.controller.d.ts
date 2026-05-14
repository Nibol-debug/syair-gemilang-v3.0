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
                major_id: string;
                name: string;
                batch_id: string;
                grade_level: number;
                homeroom_teacher_id: string | null;
                class_president_id: string | null;
            } | null;
            subject: {
                id: string;
                major_id: string | null;
                name: string;
                passing_grade: number;
                hours_per_week: number | null;
                competency_standards: string | null;
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
            material_summary: string | null;
            assignment_given: string | null;
        })[];
    }> | Promise<{
        ongoingExams: number;
        attendanceCount: number;
        recentGrades: ({
            subject: {
                id: string;
                major_id: string | null;
                name: string;
                passing_grade: number;
                hours_per_week: number | null;
                competency_standards: string | null;
            };
        } & {
            id: string;
            major_id: string;
            batch_id: string;
            created_at: Date;
            applicant_id: string | null;
            student_id: string | null;
            type: string;
            subject_id: string;
            score: import("@prisma/client/runtime/library").Decimal;
            exam_id: string | null;
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
        certifiedCount: number;
        educationDistribution: {
            name: string;
            value: number;
        }[];
        statusDistribution: {
            name: string;
            value: number;
        }[];
        certificationDistribution: {
            name: string;
            value: number;
        }[];
    }>;
    getGradingStats(): Promise<{
        totalGrades: number;
        averageScore: number;
        passedCount: number;
        remedialCount: number;
        passPercentage: number;
    }>;
}
