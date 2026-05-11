"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    try {
        const emp = await prisma.employee.create({
            data: {
                full_name: 'Test Employee',
                education: 'S1',
                position: 'Staff',
                join_date: new Date(),
                status: 'active'
            }
        });
        console.log('Success:', emp);
    }
    catch (err) {
        console.error('Error:', err);
    }
}
main();
//# sourceMappingURL=test-create-emp.js.map