export declare class CreateRemedialDto {
    student_id: string;
    subject_id: string;
    exam_id?: string;
    score_before: number;
    scheduled_at?: string;
    notes?: string;
}
export declare class ScheduleRemedialDto {
    exam_id: string;
    scheduled_at: string;
}
export declare class UpdateRemedialScoreDto {
    score_after: number;
    notes?: string;
}
