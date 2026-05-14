import { ExamSessionsService } from './exam-sessions.service';
import { StartExamDto, SubmitAnswerDto, LogViolationDto } from './dto/exam-session.dto';
export declare class ExamSessionsController {
    private readonly examSessionsService;
    constructor(examSessionsService: ExamSessionsService);
    startExam(id: string, data: StartExamDto, req: any): Promise<{
        id: string;
        status: string;
        applicant_id: string | null;
        student_id: string | null;
        device_id: string | null;
        start_time: Date;
        end_time: Date | null;
        exam_id: string;
        warning_count: number;
    }>;
    startExamApplicant(id: string, data: StartExamDto & {
        applicantId: string;
    }): Promise<{
        id: string;
        status: string;
        applicant_id: string | null;
        student_id: string | null;
        device_id: string | null;
        start_time: Date;
        end_time: Date | null;
        exam_id: string;
        warning_count: number;
    }>;
    getSessionDetail(sessionId: string): Promise<{
        student: {
            full_name: string;
            nis: string;
        } | null;
        applicant: {
            full_name: string;
        } | null;
        exam: {
            title: string;
            duration: number;
        };
        answers: ({
            question: {
                type: string;
                question_text: string;
            };
        } & {
            id: string;
            question_id: string;
            answer: string;
            score: import("@prisma/client/runtime/library").Decimal | null;
            session_id: string;
        })[];
        logs: {
            id: string;
            type: string;
            description: string | null;
            session_id: string;
            timestamp: Date;
        }[];
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
    }>;
    submitAnswer(sessionId: string, data: SubmitAnswerDto): Promise<{
        id: string;
        question_id: string;
        answer: string;
        score: import("@prisma/client/runtime/library").Decimal | null;
        session_id: string;
    }>;
    logViolation(sessionId: string, data: LogViolationDto): Promise<{
        ignored: boolean;
    } | {
        auto_submitted: boolean;
        reason: string;
        id: string;
        type: string;
        description: string | null;
        session_id: string;
        timestamp: Date;
        ignored?: undefined;
    } | {
        warning_count: number;
        id: string;
        type: string;
        description: string | null;
        session_id: string;
        timestamp: Date;
        ignored?: undefined;
    }>;
    submitExam(sessionId: string): Promise<{
        score: number;
        total_correct: number;
        total_questions: number;
        forced: boolean;
    }>;
    forceSubmitExam(sessionId: string): Promise<{
        score: number;
        total_correct: number;
        total_questions: number;
        forced: boolean;
    }>;
}
