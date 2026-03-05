import { prisma } from "@/server/db";
import { getDemoUser } from "@/server/demo-user";
import { fetchAndCacheTransactions } from "@/server/plaid-transactions";

const DEFAULT_BUFFER_CENTS = 20000;

export async function suggestTransfer() {
  const user = await getDemoUser();
  await fetchAndCacheTransactions();

  const since = new Date();
  since.setDate(since.getDate() - 30);

  const transactions = await prisma.plaidTransaction.findMany({
    where: {
      userId: user.id,
      date: { gte: since }
    }
  });

  const inflow = transactions
    .filter((tx) => tx.amount < 0)
    .reduce<number>((sum, tx) => sum + Math.abs(tx.amount), 0);
  const outflow = transactions
    .filter((tx) => tx.amount > 0)
    .reduce<number>((sum, tx) => sum + tx.amount, 0);

  const safeToSave = Math.max(0, inflow - outflow - DEFAULT_BUFFER_CENTS / 100);
  const amountCents = Math.round(safeToSave * 100);

  if (amountCents <= 0) {
    return { scheduled: false, amountCents: 0 };
  }

  const scheduledFor = new Date();
  scheduledFor.setDate(scheduledFor.getDate() + 3);

  const transfer = await prisma.transfer.create({
    data: {
      userId: user.id,
      amountCents,
      scheduledFor,
      status: "scheduled"
    }
  });

  return { scheduled: true, transferId: transfer.id, amountCents };
}
