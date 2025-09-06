import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
  await truncateTables();
  await insetData();
};

const truncateTables = async () => {
  await prisma.user.deleteMany();
};

const insetData = async () => {
  const password = await bcrypt.hash('123456', 10);

  Array.from({ length: 5 }).forEach(async (_, i) => {
    await prisma.user.createMany({
      data: [
        {
          name: `Test User ${i + 1}`,
          email: `test${i + 1}@gmail.com`,
          password: password,
        },
      ],
    });
  });
};

main()
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
