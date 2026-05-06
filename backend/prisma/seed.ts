import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });

  await prisma.role.upsert({
    where: { name: 'guru' },
    update: {},
    create: { name: 'guru' },
  });

  await prisma.role.upsert({
    where: { name: 'siswa' },
    update: {},
    create: { name: 'siswa' },
  });

  // Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password_hash: hashedPassword,
      role_id: adminRole.id,
    },
  });

  // Permissions
  const viewStudents = await prisma.permission.upsert({
    where: { name: 'view_students' },
    update: {},
    create: { name: 'view_students' },
  });

  const manageStudents = await prisma.permission.upsert({
    where: { name: 'manage_students' },
    update: {},
    create: { name: 'manage_students' },
  });

  // Assign permissions to admin role
  await prisma.rolePermission.upsert({
    where: {
      role_id_permission_id: {
        role_id: adminRole.id,
        permission_id: viewStudents.id,
      },
    },
    update: {},
    create: {
      role_id: adminRole.id,
      permission_id: viewStudents.id,
    },
  });

  await prisma.rolePermission.upsert({
    where: {
      role_id_permission_id: {
        role_id: adminRole.id,
        permission_id: manageStudents.id,
      },
    },
    update: {},
    create: {
      role_id: adminRole.id,
      permission_id: manageStudents.id,
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
