"use client";

import { useEffect, useState } from "react";

type Transfer = {
  id: string;
  amountCents: number;
  scheduledFor: string;
  status: string;
};

type TransfersResponse = {
  transfers: Transfer[];
};

export function TransferHistory() {
  const [data, setData] = useState<TransfersResponse | null>(null);
  const [status, setStatus] = useState("Idle");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setStatus("Loading...");
      const response = await fetch("/api/transfers");
      const payload = (await response.json()) as TransfersResponse;
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
  }, []);

  return (
    <div className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-lg shadow-black/5">
      <h3 className="text-xl font-semibold text-slate">Transfer history</h3>
      <p className="mt-2 text-slate/80">{status}</p>
      {data && (
        <div className="mt-4 space-y-3">
          {data.transfers.map((transfer) => (
            <div
              key={transfer.id}
              className="flex items-center justify-between rounded-xl bg-white/80 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-slate">
                  ${(transfer.amountCents / 100).toFixed(2)}
                </p>
                <p className="text-xs text-slate/60">
                  {new Date(transfer.scheduledFor).toLocaleDateString()}
                </p>
              </div>
              <span className="rounded-full bg-ink/10 px-3 py-1 text-xs text-slate">
                {transfer.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
