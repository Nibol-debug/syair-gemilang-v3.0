import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class StudentQueryDto extends PaginationDto {
    class_id?: string;
    branch_id?: string;
    major_id?: string;
    batch_id?: string;
    gender?: string;
    search?: string;
}
