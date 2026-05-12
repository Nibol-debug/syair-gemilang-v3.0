import { BatchesService } from './batches.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class BatchesController {
    private readonly batchesService;
    constructor(batchesService: BatchesService);
    create(createBatchDto: CreateBatchDto): Promise<{
        id: string;
        name: string;
        start_date: Date;
        end_date: Date;
        is_active: boolean;
    }>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: {
            id: string;
            name: string;
            start_date: Date;
            end_date: Date;
            is_active: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        start_date: Date;
        end_date: Date;
        is_active: boolean;
    }>;
    update(id: string, updateBatchDto: UpdateBatchDto): Promise<{
        id: string;
        name: string;
        start_date: Date;
        end_date: Date;
        is_active: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        start_date: Date;
        end_date: Date;
        is_active: boolean;
    }>;
}
