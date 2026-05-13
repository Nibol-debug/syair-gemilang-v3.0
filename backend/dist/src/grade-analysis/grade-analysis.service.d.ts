import { PrismaService } from '../prisma/prisma.service';
export declare class GradeAnalysisService {
    private prisma;
    constructor(prisma: PrismaService);
    getExamStatistics(examId: string): Promise<{
        exam_title: string;
        subject_name: string;
        total_students: number;
        average_score: number;
        highest_score: number;
        lowest_score: number;
        standard_deviation: number;
        questions: {
            id: string;
            question_text: string;
            type: "mcq" | "essay";
            difficulty: string;
            total_attempts: number;
            correct_count: number;
            correct_percentage: number;
            discrimination_index: number | undefined;
            difficulty_level: "easy" | "medium" | "hard";
        }[];
        grade_distribution: {
            grade_range: string;
            count: number;
            percentage: number;
        }[];
    }>;
    getClassSubjectAnalysis(classId: string, subjectId: string, batchId?: string): Promise<{
        class_name: string;
        subject_name: string;
        total_students: number;
        average_score: number;
        passed_count: number;
        remedial_count: number;
        pending_count: number;
        pass_percentage: number;
        students: {
            id: string;
            nis: string;
            full_name: string;
            final_score: number | null;
            grade_letter: string;
            is_passed: boolean;
            semester: number;
        }[];
        grade_distribution: {
            grade_range: string;
            count: number;
            percentage: number;
        }[];
    }>;
    private calculateDiscriminationIndex;
    private calculateGradeDistribution;
    getQuestionsForReview(examId: string): Promise<{
        exam_title: string;
        total_questions: number;
        needs_review_count: number;
        questions: {
            id: string;
            question_text: string;
            type: "mcq" | "essay";
            difficulty: string;
            total_attempts: number;
            correct_count: number;
            correct_percentage: number;
            discrimination_index: number | undefined;
            difficulty_level: "easy" | "medium" | "hard";
        }[];
    }>;
}
