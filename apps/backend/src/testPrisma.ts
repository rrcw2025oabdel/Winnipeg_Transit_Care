
import "dotenv/config";
import prisma from "./config/prisma";

async function testConnection() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 AS connected`;

    console.log("Database connection successful!");
    console.log(result);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
