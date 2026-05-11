import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class FinanceQueryDto extends PaginationDto {
    search?: string;
    status?: string;
    type?: string;
    student_id?: string;
}
