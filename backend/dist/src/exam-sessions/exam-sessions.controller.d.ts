import { ExamSessionsService } from './exam-sessions.service';
import { StartExamDto, SubmitAnswerDto, LogViolationDto } from './dto/exam-session.dto';
export declare class ExamSessionsController {
    private readonly examSessionsService;
    constructor(examSessionsService: ExamSessionsService);
    startExam(id: string, data: StartExamDto, req: any): Promise<{
        id: string;
        student_id: string;
        status: string;
        device_id: string | null;
        start_time: Date;
        end_time: Date | null;
        exam_id: string;
    }>;
    submitAnswer(sessionId: string, data: SubmitAnswerDto): Promise<{
        id: string;
        question_id: string;
        answer: string;
        session_id: string;
    }>;
    logViolation(sessionId: string, data: LogViolationDto): Promise<{
        id: string;
        type: string;
        session_id: string;
        timestamp: Date;
    }>;
    submitExam(sessionId: string): Promise<{
        score: number;
        total_correct: number;
        total_questions: number;
    }>;
}
