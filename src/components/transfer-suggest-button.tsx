"use client";

import { useState } from "react";

type SuggestResult = {
  scheduled: boolean;
  amountCents: number;
  transferId?: string;
};

export function TransferSuggestButton() {
  const [status, setStatus] = useState<string>("Idle");
  const [lastResult, setLastResult] = useState<SuggestResult | null>(null);

  async function handleSuggest() {
    setStatus("Calculating...");
    const response = await fetch("/api/transfers/suggest", { method: "POST" });
    const data = (await response.json()) as SuggestResult;
    setLastResult(data);
    setStatus(data.scheduled ? "Scheduled" : "No safe transfer found");
  }

  return (
    <div className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-lg shadow-black/5">
      <h3 className="text-xl font-semibold text-slate">Suggest a transfer</h3>
      <p className="mt-2 text-slate/80">
        Calculates a safe-to-save amount based on 30-day cash flow.
      </p>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSuggest}
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white"
        >
          Suggest transfer
        </button>
        <span className="text-sm text-slate/70">{status}</span>
      </div>
      {lastResult && (
        <p className="mt-3 text-sm text-slate/80">
          Amount: ${(lastResult.amountCents / 100).toFixed(2)}
          {lastResult.transferId ? ` · ID ${lastResult.transferId}` : ""}
        </p>
      )}
    </div>
  );
}
