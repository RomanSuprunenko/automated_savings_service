import { plaidClient } from "@/lib/plaid";
import { prisma } from "@/server/db";
import { getDemoUser } from "@/server/demo-user";

function toDateString(value: Date) {
  return value.toISOString().slice(0, 10);
}

export async function fetchAndCacheTransactions(days = 30) {
  const user = await getDemoUser();
  const item = await prisma.plaidItem.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  });

  if (!item) {
    return { item: null, transactions: [] };
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const response = await plaidClient.transactionsGet({
    access_token: item.accessToken,
    start_date: toDateString(startDate),
    end_date: toDateString(endDate),
    options: {
      count: 50,
      offset: 0
    }
  });

  const transactions = response.data.transactions;

  await prisma.$transaction(
    transactions.map((tx) =>
      prisma.plaidTransaction.upsert({
        where: { transactionId: tx.transaction_id },
        update: {
          name: tx.name,
          amount: tx.amount,
          date: new Date(tx.date),
          category: tx.category?.join(" > ") ?? null,
          pending: tx.pending
        },
        create: {
          userId: user.id,
          plaidItemId: item.id,
          transactionId: tx.transaction_id,
          name: tx.name,
          amount: tx.amount,
          date: new Date(tx.date),
          category: tx.category?.join(" > ") ?? null,
          pending: tx.pending
        }
      })
    )
  );

  return { item, transactions };
}
