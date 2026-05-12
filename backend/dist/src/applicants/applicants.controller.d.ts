import { ApplicantsService } from './applicants.service';
import { CreateApplicantDto } from './dto/create-applicant.dto';
export declare class ApplicantsController {
    private readonly applicantsService;
    constructor(applicantsService: ApplicantsService);
    create(createApplicantDto: CreateApplicantDto): Promise<{
        id: string;
        full_name: string;
        status: string;
        major_id: string;
        gender: string;
        birth_place: string;
        birth_date: Date;
        address: string;
        phone: string;
        email: string;
        created_at: Date;
        previous_school: string;
        document_url: string | null;
    }>;
    uploadDocument(file: Express.Multer.File): {
        url: string;
    };
    findAll(query: any): Promise<{
        data: ({
            major: {
                id: string;
                name: string;
                branch_id: string;
                created_at: Date;
                code: string;
            };
        } & {
            id: string;
            full_name: string;
            status: string;
            major_id: string;
            gender: string;
            birth_place: string;
            birth_date: Date;
            address: string;
            phone: string;
            email: string;
            created_at: Date;
            previous_school: string;
            document_url: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            last_page: number;
        };
    }>;
    findOne(id: string): Promise<{
        major: {
            id: string;
            name: string;
            branch_id: string;
            created_at: Date;
            code: string;
        };
    } & {
        id: string;
        full_name: string;
        status: string;
        major_id: string;
        gender: string;
        birth_place: string;
        birth_date: Date;
        address: string;
        phone: string;
        email: string;
        created_at: Date;
        previous_school: string;
        document_url: string | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        full_name: string;
        status: string;
        major_id: string;
        gender: string;
        birth_place: string;
        birth_date: Date;
        address: string;
        phone: string;
        email: string;
        created_at: Date;
        previous_school: string;
        document_url: string | null;
    }>;
    verify(id: string, status: string): Promise<{
        id: string;
        full_name: string;
        status: string;
        major_id: string;
        gender: string;
        birth_place: string;
        birth_date: Date;
        address: string;
        phone: string;
        email: string;
        created_at: Date;
        previous_school: string;
        document_url: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        full_name: string;
        status: string;
        major_id: string;
        gender: string;
        birth_place: string;
        birth_date: Date;
        address: string;
        phone: string;
        email: string;
        created_at: Date;
        previous_school: string;
        document_url: string | null;
    }>;
}
