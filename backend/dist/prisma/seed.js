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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const rolesData = [
        'Administrator Utama',
        'Kepala Sekolah',
        'Guru Mata Pelajaran',
        'Wali Kelas',
        'Bendahara',
        'Staf Sarpras',
        'Siswa',
        'Orang Tua'
    ];
    const roles = await Promise.all(rolesData.map(async (name) => {
        return prisma.role.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }));
    const adminRole = roles.find(r => r.name === 'Administrator Utama');
    if (adminRole) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.upsert({
            where: { username: 'admin' },
            update: {
                role_id: adminRole.id,
                password_hash: hashedPassword,
            },
            create: {
                username: 'admin',
                password_hash: hashedPassword,
                role_id: adminRole.id,
            },
        });
    }
    const permissionsData = [
        'view_students', 'manage_students',
        'view_applicants', 'manage_applicants',
        'view_hrm', 'manage_hrm',
        'view_finance', 'manage_finance',
        'view_assets', 'manage_assets',
        'view_exams', 'manage_exams'
    ];
    const permissions = await Promise.all(permissionsData.map(async (name) => {
        return prisma.permission.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }));
    if (adminRole) {
        await Promise.all(permissions.map(async (p) => {
            return prisma.rolePermission.upsert({
                where: {
                    role_id_permission_id: {
                        role_id: adminRole.id,
                        permission_id: p.id,
                    },
                },
                update: {},
                create: {
                    role_id: adminRole.id,
                    permission_id: p.id,
                },
            });
        }));
    }
    console.log('Seed data created successfully with 8 Proposal Roles and Permissions');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map