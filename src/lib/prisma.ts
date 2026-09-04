import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  return new PrismaClient();
}

function getClient() {
  const current = globalForPrisma.prisma;
  if (current?.siteSetting) {
    return current;
  }

  // A client cached from an earlier generate/HMR cycle still owns an open
  // connection pool. Release it before replacing, or every reload strands
  // another pool against the database.
  if (current) {
    void current.$disconnect().catch(() => {});
  }

  const client = createClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}

export const prisma = getClient();
