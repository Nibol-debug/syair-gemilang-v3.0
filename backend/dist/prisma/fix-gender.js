"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.student.updateMany({
        where: { gender: { contains: 'Laki-laki' } },
        data: { gender: 'L' }
    });
    await prisma.student.updateMany({
        where: { gender: { contains: 'Perempuan' } },
        data: { gender: 'P' }
    });
    console.log('Gender data normalized');
}
main();
//# sourceMappingURL=fix-gender.js.map