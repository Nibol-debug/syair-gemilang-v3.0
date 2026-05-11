import { PrismaService } from '../prisma/prisma.service';
import { CreateFeeDto } from './dto/create-fee.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class FinanceService {
    private prisma;
    constructor(prisma: PrismaService);
    createFee(createFeeDto: CreateFeeDto): Promise<{
        id: string;
        name: string;
        type: string;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAllFees(pagination: PaginationDto, filters: {
        search?: string;
        type?: string;
    }): Promise<{
        data: {
            id: string;
            name: string;
            type: string;
            description: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            last_page: number;
        };
    }>;
    findOneFee(id: string): Promise<{
        id: string;
        name: string;
        type: string;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateFee(id: string, updateFeeDto: UpdateFeeDto): Promise<{
        id: string;
        name: string;
        type: string;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    removeFee(id: string): Promise<{
        id: string;
        name: string;
        type: string;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    createPayment(createPaymentDto: CreatePaymentDto): Promise<{
        student: {
            id: string;
            full_name: string;
            status: string;
            major_id: string;
            nis: string;
            nik: string;
            gender: string;
            birth_place: string;
            birth_date: Date;
            address: string;
            phone: string;
            email: string;
            class_id: string | null;
            batch_id: string;
            qr_code: string | null;
            created_at: Date;
        };
        fee: {
            id: string;
            name: string;
            type: string;
            description: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        status: string;
        student_id: string;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        fee_id: string;
        method: string;
    }>;
    findAllPayments(pagination: PaginationDto, filters: {
        search?: string;
        status?: string;
        student_id?: string;
    }): Promise<{
        data: ({
            student: {
                id: string;
                full_name: string;
                status: string;
                major_id: string;
                nis: string;
                nik: string;
                gender: string;
                birth_place: string;
                birth_date: Date;
                address: string;
                phone: string;
                email: string;
                class_id: string | null;
                batch_id: string;
                qr_code: string | null;
                created_at: Date;
            };
            fee: {
                id: string;
                name: string;
                type: string;
                description: string | null;
                amount: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            status: string;
            student_id: string;
            date: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            fee_id: string;
            method: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            last_page: number;
        };
    }>;
    findOnePayment(id: string): Promise<{
        student: {
            id: string;
            full_name: string;
            status: string;
            major_id: string;
            nis: string;
            nik: string;
            gender: string;
            birth_place: string;
            birth_date: Date;
            address: string;
            phone: string;
            email: string;
            class_id: string | null;
            batch_id: string;
            qr_code: string | null;
            created_at: Date;
        };
        fee: {
            id: string;
            name: string;
            type: string;
            description: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        status: string;
        student_id: string;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        fee_id: string;
        method: string;
    }>;
    updatePayment(id: string, updatePaymentDto: UpdatePaymentDto): Promise<{
        student: {
            id: string;
            full_name: string;
            status: string;
            major_id: string;
            nis: string;
            nik: string;
            gender: string;
            birth_place: string;
            birth_date: Date;
            address: string;
            phone: string;
            email: string;
            class_id: string | null;
            batch_id: string;
            qr_code: string | null;
            created_at: Date;
        };
        fee: {
            id: string;
            name: string;
            type: string;
            description: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        status: string;
        student_id: string;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        fee_id: string;
        method: string;
    }>;
    removePayment(id: string): Promise<{
        id: string;
        status: string;
        student_id: string;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        fee_id: string;
        method: string;
    }>;
}
