import { prisma } from "@/server/db";

export async function createContext() {
  return {
    prisma
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
