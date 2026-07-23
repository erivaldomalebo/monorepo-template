import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../config/env.config";
import { PrismaClient } from "./generated/prisma/client";
import * as models from "./generated/prisma/models";

const connectionString = `${env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

type Prisma = typeof prisma;

export { prisma as db, type Prisma as DatabaseClient, models };
