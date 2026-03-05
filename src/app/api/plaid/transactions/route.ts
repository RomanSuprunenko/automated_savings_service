import { NextResponse } from "next/server";
import { fetchAndCacheTransactions } from "@/server/plaid-transactions";

export async function GET() {
  const { item, transactions } = await fetchAndCacheTransactions();

  if (!item) {
    return NextResponse.json({ error: "No linked Plaid item." }, { status: 404 });
  }

  return NextResponse.json({
    institutionName: item.institutionName,
    transactions
  });
}
