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
    }): Promise<{
        data: ({
            major: {
                id: string;
                name: string;
                created_at: Date;
                code: string;
            };
            _count: {
                questions: number;
            };
            subject: {
                id: string;
                major_id: string | null;
                name: string;
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
    findOne(id: string): Promise<{
        major: {
            id: string;
            name: string;
            created_at: Date;
            code: string;
        };
        subject: {
            id: string;
            major_id: string | null;
            name: string;
        };
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
}
