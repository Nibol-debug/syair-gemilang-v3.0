import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicantDto } from './dto/create-applicant.dto';
export declare class ApplicantsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateApplicantDto): Promise<{
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
        branch: string;
    }>;
    findAll(query: any): Promise<{
        data: ({
            major: {
                id: string;
                name: string;
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
            branch: string;
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
        branch: string;
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
        branch: string;
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
        branch: string;
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
        branch: string;
    }>;
}
