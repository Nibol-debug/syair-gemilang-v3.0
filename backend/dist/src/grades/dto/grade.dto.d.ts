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
export declare class FinalizeClassGradeDto {
    class_id: string;
    subject_id: string;
    semester: number;
}
export declare class UpdateGradeComponentDto {
    id: string;
    weight_percentage: number;
}
