export declare class StartExamDto {
    token: string;
    device_id?: string;
}
export declare class SubmitAnswerDto {
    question_id: string;
    answer: string;
}
export declare class LogViolationDto {
    type: string;
    description?: string;
}
export declare class GradeEssayDto {
    score: number;
}
