declare class CreateParentDto {
    father_name: string;
    mother_name: string;
    phone: string;
    address: string;
}
export declare class CreateStudentDto {
    nis: string;
    nik: string;
    full_name: string;
    gender: string;
    birth_place: string;
    birth_date: Date;
    address: string;
    phone: string;
    email: string;
    class_id: string;
    status?: string;
    parents?: CreateParentDto;
}
export {};
