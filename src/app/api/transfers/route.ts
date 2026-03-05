import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { getDemoUser } from "@/server/demo-user";

export async function GET() {
  const user = await getDemoUser();
  const transfers = await prisma.transfer.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  return NextResponse.json({ transfers });
}
