import { StreamableFile } from '@nestjs/common';
import { ReportCardsService } from './report-cards.service';
export declare class ReportCardsController {
    private readonly reportCardsService;
    constructor(reportCardsService: ReportCardsService);
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
    downloadReportCard(studentId: string, semester: number): Promise<StreamableFile>;
    getClassReportCards(classId: string, semester: number): Promise<{
        student_id: string;
        nis: string;
        full_name: string;
        has_report_card: boolean;
        subject_count: number;
    }[]>;
}
