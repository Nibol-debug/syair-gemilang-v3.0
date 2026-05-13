"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                role: true,
                student: {
                    select: {
                        id: true,
                        full_name: true,
                        email: true,
                        phone: true,
                        profile_picture: true,
                        gender: true,
                        birth_place: true,
                        birth_date: true,
                        address: true,
                    },
                },
                employee: {
                    select: {
                        id: true,
                        full_name: true,
                        education: true,
                        position: true,
                        join_date: true,
                        status: true,
                    },
                },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async updateProfile(userId, data) {
        const updateData = {};
        if (data.username) {
            updateData.username = data.username;
        }
        if (data.student) {
            await this.prisma.student.updateMany({
                where: { user: { id: userId } },
                data: data.student,
            });
        }
        if (data.employee) {
            await this.prisma.employee.updateMany({
                where: { user: { id: userId } },
                data: data.employee,
            });
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: updateData,
        });
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch)
            throw new common_1.NotFoundException('Current password is incorrect');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return this.prisma.user.update({
            where: { id: userId },
            data: { password_hash: hashedPassword },
        });
    }
    async findAll(params) {
        const { page = 1, limit = 10, search, roleId } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { username: { contains: search } },
                { student: { full_name: { contains: search } } },
                { employee: { full_name: { contains: search } } },
            ];
        }
        if (roleId) {
            where.role_id = roleId;
        }
        const [items, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                include: {
                    role: true,
                    student: {
                        select: { full_name: true, email: true }
                    },
                    employee: {
                        select: { full_name: true }
                    }
                },
                orderBy: { username: 'asc' },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(username) {
        return this.prisma.user.findUnique({
            where: { username },
            include: {
                role: true,
            },
        });
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                role: true,
                student: true,
                employee: true,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async create(data) {
        const hashedPassword = await bcrypt.hash(data.password_hash, 10);
        return this.prisma.user.create({
            data: {
                ...data,
                password_hash: hashedPassword,
            },
        });
    }
    async update(id, data) {
        const updateData = { ...data };
        if (data.password) {
            updateData.password_hash = await bcrypt.hash(data.password, 10);
            delete updateData.password;
        }
        return this.prisma.user.update({
            where: { id },
            data: updateData,
        });
    }
    async remove(id) {
        return this.prisma.user.delete({
            where: { id },
        });
    }
    async getDevices(userId) {
        return this.prisma.userDevice.findMany({
            where: { user_id: userId },
        });
    }
    async toggleDeviceStatus(userId, deviceId, isActive) {
        const device = await this.prisma.userDevice.findFirst({
            where: { user_id: userId, id: deviceId },
        });
        if (!device)
            throw new common_1.NotFoundException('Device not found for this user');
        return this.prisma.userDevice.update({
            where: { id: deviceId },
            data: { is_active: isActive },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map