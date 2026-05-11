"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const students = await prisma.student.findMany({ select: { id: true, full_name: true, gender: true } });
    console.log(students);
}
main();
//# sourceMappingURL=check-gender.js.map