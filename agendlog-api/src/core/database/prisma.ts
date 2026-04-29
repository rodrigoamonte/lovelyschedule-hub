import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
import { env } from "../../core/config/env.js";

const adapter = new PrismaMariaDb(env.DATABASE_URL!);

export const prisma = new PrismaClient({ adapter });
