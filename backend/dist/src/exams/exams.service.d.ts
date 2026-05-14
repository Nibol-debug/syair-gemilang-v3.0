import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class ExamsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateExamDto): Promise<{
        questions: ({
            options: {
                id: string;
                option_text: string;
                is_correct: boolean;
                question_id: string;
            }[];
        } & {
            id: string;
            type: string;
            question_text: string;
            difficulty: string;
            exam_id: string;
        })[];
    } & {
        id: string;
        major_id: string;
        subject_id: string;
        start_time: Date;
        end_time: Date;
        title: string;
        duration: number;
        token: string;
    }>;
    findAll(pagination: PaginationDto, filters: {
        major_id?: string;
        subject_id?: string;
        search?: string;
    }): Promise<{
        data: ({
            major: {
                id: string;
                name: string;
                branch_id: string;
                created_at: Date;
                code: string;
            };
            _count: {
                sessions: number;
                questions: number;
            };
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
            subject_id: string;
            start_time: Date;
            end_time: Date;
            title: string;
            duration: number;
            token: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            last_page: number;
        };
    }>;
    findOne(id: string, userRole?: string): Promise<any>;
    update(id: string, data: any): Promise<{
        major: {
            id: string;
            name: string;
            branch_id: string;
            created_at: Date;
            code: string;
        };
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
        subject_id: string;
        start_time: Date;
        end_time: Date;
        title: string;
        duration: number;
        token: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        major_id: string;
        subject_id: string;
        start_time: Date;
        end_time: Date;
        title: string;
        duration: number;
        token: string;
    }>;
    getStats(): Promise<{
        totalExams: number;
        activeExams: number;
        ongoingSessions: number;
        todayViolations: number;
        totalQuestions: number;
    }>;
    getMonitoring(examId: string): Promise<{
        exam: {
            major: {
                id: string;
                name: string;
                branch_id: string;
                created_at: Date;
                code: string;
            };
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
            subject_id: string;
            start_time: Date;
            end_time: Date;
            title: string;
            duration: number;
            token: string;
        };
        sessions: ({
            _count: {
                answers: number;
                logs: number;
            };
            student: {
                id: string;
                full_name: string;
                nis: string;
                class: {
                    name: string;
                } | null;
            } | null;
            applicant: {
                id: string;
                full_name: string;
            } | null;
        } & {
            id: string;
            status: string;
            applicant_id: string | null;
            student_id: string | null;
            device_id: string | null;
            start_time: Date;
            end_time: Date | null;
            exam_id: string;
            warning_count: number;
        })[];
    }>;
    getRecentViolations(limit?: number): Promise<({
        session: {
            student: {
                full_name: string;
                nis: string;
                class: {
                    name: string;
                } | null;
            } | null;
            applicant: {
                full_name: string;
            } | null;
            exam: {
                title: string;
            };
        } & {
            id: string;
            status: string;
            applicant_id: string | null;
            student_id: string | null;
            device_id: string | null;
            start_time: Date;
            end_time: Date | null;
            exam_id: string;
            warning_count: number;
        };
    } & {
        id: string;
        type: string;
        description: string | null;
        session_id: string;
        timestamp: Date;
    })[]>;
    addQuestion(examId: string, data: any): Promise<{
        options: {
            id: string;
            option_text: string;
            is_correct: boolean;
            question_id: string;
        }[];
    } & {
        id: string;
        type: string;
        question_text: string;
        difficulty: string;
        exam_id: string;
    }>;
    updateQuestion(questionId: string, data: any): Promise<{
        options: {
            id: string;
            option_text: string;
            is_correct: boolean;
            question_id: string;
        }[];
    } & {
        id: string;
        type: string;
        question_text: string;
        difficulty: string;
        exam_id: string;
    }>;
    deleteQuestion(questionId: string): Promise<{
        id: string;
        type: string;
        question_text: string;
        difficulty: string;
        exam_id: string;
    }>;
    getSessionQuestions(sessionId: string): Promise<{
        id: string;
        exam_id: string;
        type: string;
        question_text: string;
        difficulty: string;
        options: {
            id: string;
            option_text: string;
        }[];
    }[]>;
    getSessionAnswersDetail(sessionId: string): Promise<{
        session: {
            id: string;
            status: string;
            student: {
                full_name: string;
                nis: string;
            } | null;
            applicant: {
                full_name: string;
            } | null;
            exam_title: string;
        };
        questions: {
            student_answer: {
                id: string;
                question_id: string;
                answer: string;
                score: import("@prisma/client/runtime/library").Decimal | null;
                session_id: string;
            } | null;
            options: {
                id: string;
                option_text: string;
                is_correct: boolean;
                question_id: string;
            }[];
            id: string;
            type: string;
            question_text: string;
            difficulty: string;
            exam_id: string;
        }[];
    }>;
    gradeEssay(answerId: string, score: number): Promise<{
        score: number;
        total_points: number;
        total_questions: number;
    }>;
    private recalculateSessionScore;
    private shuffleArray;
}
