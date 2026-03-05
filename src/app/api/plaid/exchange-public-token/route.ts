import { NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";
import { z } from "zod";
import { prisma } from "@/server/db";
import { getDemoUser } from "@/server/demo-user";

const bodySchema = z.object({
  publicToken: z.string().min(1)
});

export async function POST(req: Request) {
  const body = bodySchema.parse(await req.json());
  const exchange = await plaidClient.itemPublicTokenExchange({
    public_token: body.publicToken
  });

  const user = await getDemoUser();
  await prisma.plaidItem.create({
    data: {
      userId: user.id,
      itemId: exchange.data.item_id,
      accessToken: exchange.data.access_token
    }
  });

  return NextResponse.json({
    itemId: exchange.data.item_id
  });
}
