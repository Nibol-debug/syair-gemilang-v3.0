import { PrismaService } from '../prisma/prisma.service';
import { StartExamDto, SubmitAnswerDto, LogViolationDto } from './dto/exam-session.dto';
export declare class ExamSessionsService {
    private prisma;
    constructor(prisma: PrismaService);
    startExam(studentId: string, examId: string, data: StartExamDto): Promise<{
        id: string;
        status: string;
        student_id: string;
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
    finalizeExam(sessionId: string): Promise<{
        score: number;
        total_correct: number;
        total_questions: number;
    }>;
}
