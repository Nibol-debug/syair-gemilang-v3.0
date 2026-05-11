import { PrismaService } from '../prisma/prisma.service';
export declare class ApplicantsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: string;
        full_name: string;
        status: string;
        gender: string;
        birth_place: string;
        birth_date: Date;
        address: string;
        phone: string;
        email: string;
        created_at: Date;
        previous_school: string;
    }>;
    findAll(query: any): Promise<{
        data: {
            id: string;
            full_name: string;
            status: string;
            gender: string;
            birth_place: string;
            birth_date: Date;
            address: string;
            phone: string;
            email: string;
            created_at: Date;
            previous_school: string;
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
        full_name: string;
        status: string;
        gender: string;
        birth_place: string;
        birth_date: Date;
        address: string;
        phone: string;
        email: string;
        created_at: Date;
        previous_school: string;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        full_name: string;
        status: string;
        gender: string;
        birth_place: string;
        birth_date: Date;
        address: string;
        phone: string;
        email: string;
        created_at: Date;
        previous_school: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        full_name: string;
        status: string;
        gender: string;
        birth_place: string;
        birth_date: Date;
        address: string;
        phone: string;
        email: string;
        created_at: Date;
        previous_school: string;
    }>;
    verify(id: string, status: string): Promise<{
        id: string;
        full_name: string;
        status: string;
        gender: string;
        birth_place: string;
        birth_date: Date;
        address: string;
        phone: string;
        email: string;
        created_at: Date;
        previous_school: string;
    }>;
}
