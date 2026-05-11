import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class AssetsController {
    private readonly assetsService;
    constructor(assetsService: AssetsService);
    create(createAssetDto: CreateAssetDto): Promise<{
        id: string;
        status: string;
        name: string;
        qr_code: string | null;
        created_at: Date;
        code: string;
        category: string;
        location: string;
        condition: string;
    }>;
    findAll(pagination: PaginationDto, search?: string, category?: string, condition?: string, status?: string): Promise<{
        data: {
            id: string;
            status: string;
            name: string;
            qr_code: string | null;
            created_at: Date;
            code: string;
            category: string;
            location: string;
            condition: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            last_page: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        status: string;
        name: string;
        qr_code: string | null;
        created_at: Date;
        code: string;
        category: string;
        location: string;
        condition: string;
    }>;
    update(id: string, updateAssetDto: UpdateAssetDto): Promise<{
        id: string;
        status: string;
        name: string;
        qr_code: string | null;
        created_at: Date;
        code: string;
        category: string;
        location: string;
        condition: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        status: string;
        name: string;
        qr_code: string | null;
        created_at: Date;
        code: string;
        category: string;
        location: string;
        condition: string;
    }>;
}
