"use client";

import { useState } from "react";

export function StripeSubscribeButton() {
  const [status, setStatus] = useState<string>("Idle");

  async function handleSubscribe() {
    setStatus("Creating checkout session...");
    const response = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = (await response.json()) as { url?: string; error?: string };
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    setStatus(data.error ?? "Failed to create checkout session");
  }

  return (
    <div className="rounded-2xl bg-ink text-white p-6 shadow-xl">
      <h3 className="text-xl font-semibold">Subscribe</h3>
      <p className="mt-2 text-white/70">
        Start the monthly plan to enable automatic transfers.
      </p>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubscribe}
          className="rounded-full bg-coral px-5 py-2 text-sm font-semibold text-white"
        >
          Start subscription
        </button>
        <span className="text-sm text-white/70">{status}</span>
      </div>
    </div>
  );
}
