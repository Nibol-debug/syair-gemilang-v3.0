import { MajorsService } from './majors.service';
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class MajorsController {
    private readonly majorsService;
    constructor(majorsService: MajorsService);
    create(createMajorDto: CreateMajorDto): Promise<{
        id: string;
        name: string;
        created_at: Date;
        code: string;
    }>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: {
            id: string;
            name: string;
            created_at: Date;
            code: string;
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
        created_at: Date;
        code: string;
    }>;
    update(id: string, updateMajorDto: UpdateMajorDto): Promise<{
        id: string;
        name: string;
        created_at: Date;
        code: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        created_at: Date;
        code: string;
    }>;
}
