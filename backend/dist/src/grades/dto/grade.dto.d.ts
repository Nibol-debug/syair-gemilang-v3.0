export declare class CreateGradeDto {
    student_id: string;
    subject_id: string;
    type: string;
    score: number;
    weight?: number;
    exam_id?: string;
}
export declare class FinalizeGradeDto {
    student_id: string;
    subject_id: string;
    semester: number;
}
