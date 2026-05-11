import { PrismaClient, Major } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding master data...');

  // 1. Seed Majors
  const majorsData = [
    { code: 'TKJ', name: 'Teknik Komputer dan Jaringan' },
    { code: 'DBS', name: 'Desain Bisnis dan Software' },
    { code: 'DG', name: 'Desain Grafis' },
  ];

  const majors: Major[] = [];
  for (const m of majorsData) {
    const major = await prisma.major.upsert({
      where: { code: m.code },
      update: { name: m.name },
      create: { code: m.code, name: m.name },
    });
    majors.push(major);
    console.log(`Major: ${major.code} - ${major.name}`);
  }

  // 2. Seed Batch
  const batchName = 'Angkatan 2024';
  let batch = await prisma.batch.findFirst({
    where: { name: batchName },
  });

  if (!batch) {
    batch = await prisma.batch.create({
      data: {
        name: batchName,
        year_start: 2024,
        year_end: 2027,
        is_active: true,
      },
    });
  } else {
    batch = await prisma.batch.update({
      where: { id: batch.id },
      data: {
        year_start: 2024,
        year_end: 2027,
        is_active: true,
      },
    });
  }
  console.log(`Batch: ${batch.name} (${batch.year_start}-${batch.year_end})`);

  // 3. Seed Classes
  const tkjMajor = majors.find((m) => m.code === 'TKJ');
  const dbsMajor = majors.find((m) => m.code === 'DBS');
  const dgMajor = majors.find((m) => m.code === 'DG');

  if (!tkjMajor || !dbsMajor || !dgMajor) {
    throw new Error('Majors not found after seeding');
  }

  const classesData = [
    { name: 'X TKJ 1', grade_level: 10, major_id: tkjMajor.id, batch_id: batch.id },
    { name: 'X TKJ 2', grade_level: 10, major_id: tkjMajor.id, batch_id: batch.id },
    { name: 'X DBS 1', grade_level: 10, major_id: dbsMajor.id, batch_id: batch.id },
    { name: 'X DG 1', grade_level: 10, major_id: dgMajor.id, batch_id: batch.id },
  ];

  for (const c of classesData) {
    const existingClass = await prisma.class.findFirst({
      where: {
        name: c.name,
        major_id: c.major_id,
        batch_id: c.batch_id,
      },
    });

    if (!existingClass) {
      const newClass = await prisma.class.create({
        data: c,
      });
      console.log(`Class Created: ${newClass.name}`);
    } else {
      console.log(`Class Exists: ${existingClass.name}`);
    }
  }

  console.log('Master data seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
