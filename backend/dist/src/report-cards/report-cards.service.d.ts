import { StreamableFile } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
export declare class ReportCardsService {
    private prisma;
    constructor(prisma: PrismaService);
    generateReportCard(studentId: string, semester: number): Promise<StreamableFile>;
    getReportCardData(studentId: string, semester: number): Promise<{
        student: {
            id: string;
            nis: string;
            full_name: string;
            class_name: string | undefined;
            major_name: string;
            batch_name: string;
            address: string;
        };
        parents: {
            father_name: string;
            mother_name: string;
            phone: string;
        } | null;
        semester: number;
        grades: {
            subject_name: string;
            final_score: number;
            grade_letter: string;
            is_passed: boolean;
            description: string | null;
            competencies_achieved: string | null;
        }[];
        attendance: {
            by_subject: Record<string, {
                present: number;
                total: number;
            }>;
            total_present: number;
            total_meetings: number;
        };
        generated_at: string;
    }>;
}
