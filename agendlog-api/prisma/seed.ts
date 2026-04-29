import { PrismaClient } from "../prisma/generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL as string;
const adapter = new PrismaMariaDb(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "The ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required.",
    );
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Initial Admin",
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
