import { env } from "@/env";
// import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
// import { Pool } from "pg";

// const pool = new Pool({
//   connectionString: env.POSTGRES_PRISMA_URL,
// });

// const adapter = new PrismaPg(pool);

const createPrismaClient = () =>
  new PrismaClient({
    // adapter,
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  }).$extends(withAccelerate());

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
