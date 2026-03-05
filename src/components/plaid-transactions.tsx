"use client";

import { useEffect, useState } from "react";

type Transaction = {
  transaction_id: string;
  name: string;
  amount: number;
  date: string;
};

type TransactionsResponse = {
  institutionName: string;
  transactions: Transaction[];
};

type PlaidTransactionsProps = {
  refreshKey: number;
};

export function PlaidTransactions({ refreshKey }: PlaidTransactionsProps) {
  const [data, setData] = useState<TransactionsResponse | null>(null);
  const [status, setStatus] = useState<string>("Idle");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setStatus("Loading transactions...");
      const response = await fetch("/api/plaid/transactions");
      if (!response.ok) {
        setStatus("No linked account yet.");
        return;
      }
      const payload = (await response.json()) as TransactionsResponse;
      if (mounted) {
        setData(payload);
        setStatus("Loaded");
      }
    }

    load().catch((error) => {
      console.error(error);
      setStatus("Failed to load.");
    });

    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  return (
    <div className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-lg shadow-black/5">
      <h3 className="text-xl font-semibold text-slate">Recent transactions</h3>
      <p className="mt-2 text-slate/80">{status}</p>
      {data && (
        <div className="mt-4 space-y-3">
          {data.transactions.map((tx) => (
            <div
              key={tx.transaction_id}
              className="flex items-center justify-between rounded-xl bg-white/80 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-slate">{tx.name}</p>
                <p className="text-xs text-slate/60">{tx.date}</p>
              </div>
              <p className="text-sm font-semibold text-slate">${tx.amount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
