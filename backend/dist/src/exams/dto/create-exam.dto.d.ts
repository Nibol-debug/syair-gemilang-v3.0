declare class QuestionOptionDto {
    option_text: string;
    is_correct: boolean;
}
declare class QuestionDto {
    type: string;
    question_text: string;
    difficulty: string;
    options?: QuestionOptionDto[];
}
export declare class CreateExamDto {
    title: string;
    subject_id: string;
    major_id: string;
    duration: number;
    token: string;
    start_time: Date;
    end_time: Date;
    questions?: QuestionDto[];
}
export {};
