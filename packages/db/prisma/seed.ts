import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  const web = await prisma.tag.upsert({ where: { name: 'web' }, update: {}, create: { name: 'web' } });

  await prisma.challenge.upsert({
    where: { slug: 'warmup' },
    update: {},
    create: {
      title: 'Warmup',
      slug: 'warmup',
      description: 'Find the flag in the description',
      points: 50,
      flagRegex: '^CTF\\{[A-Za-z0-9_]+\\}$',
      tags: { connect: [{ id: web.id }] },
    },
  });

  console.log('Seed complete', { user: user.email });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
