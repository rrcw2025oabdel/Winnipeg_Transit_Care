import { PrismaClient } from "@prisma/client";
import { seedBusRoutes } from "./seeds/busRoutes";

const prisma = new PrismaClient();

async function main() {
  await seedBusRoutes(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });