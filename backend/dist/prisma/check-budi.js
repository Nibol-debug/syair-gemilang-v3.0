"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const emp = await prisma.employee.findFirst({ where: { full_name: 'Budi Santoso' } });
    console.log(emp);
}
main();
//# sourceMappingURL=check-budi.js.map