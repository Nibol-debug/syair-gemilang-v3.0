import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Roles based on the proposal
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

  const roles = await Promise.all(
    rolesData.map(async (name) => {
      return prisma.role.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    })
  );

  const adminRole = roles.find(r => r.name === 'Administrator Utama');

  // Admin User
  if (adminRole) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
      where: { username: 'admin' },
      update: {
        role_id: adminRole.id,
        password_hash: hashedPassword, // Reset password just in case
      },
      create: {
        username: 'admin',
        password_hash: hashedPassword,
        role_id: adminRole.id,
      },
    });
  }

  // Permissions (Essential ones)
  const permissionsData = [
    'view_students', 'manage_students',
    'view_applicants', 'manage_applicants',
    'view_hrm', 'manage_hrm',
    'view_finance', 'manage_finance',
    'view_assets', 'manage_assets',
    'view_exams', 'manage_exams'
  ];

  const permissions = await Promise.all(
    permissionsData.map(async (name) => {
      return prisma.permission.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    })
  );

  // Assign ALL permissions to 'Administrator Utama'
  if (adminRole) {
    await Promise.all(
      permissions.map(async (p) => {
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
      })
    );
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
