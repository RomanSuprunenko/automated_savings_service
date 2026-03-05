import { prisma } from "@/server/db";
import { env } from "@/lib/env";

export async function getDemoUser() {
  return prisma.user.upsert({
    where: { email: env.DEMO_USER_EMAIL },
    update: {},
    create: { email: env.DEMO_USER_EMAIL }
  });
}
