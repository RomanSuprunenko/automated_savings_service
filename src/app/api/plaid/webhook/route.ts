import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { getDemoUser } from "@/server/demo-user";
import { fetchAndCacheTransactions } from "@/server/plaid-transactions";

export async function POST(req: Request) {
  const payload = await req.json();
  const webhookType = payload.webhook_type as string | undefined;
  const webhookCode = payload.webhook_code as string | undefined;
  const itemId = payload.item_id as string | undefined;

  if (!webhookType || !webhookCode || !itemId) {
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }

  const user = await getDemoUser();

  await prisma.plaidWebhookEvent.create({
    data: {
      userId: user.id,
      itemId,
      webhookType,
      webhookCode,
      payload
    }
  });

  if (webhookType === "TRANSACTIONS" && webhookCode === "DEFAULT_UPDATE") {
    await fetchAndCacheTransactions();
  }

  return NextResponse.json({ received: true });
}
