"use client";

import { trpc } from "@/trpc/react";
import { PlaidLinkButton } from "@/components/plaid-link-button";
import { PlaidTransactions } from "@/components/plaid-transactions";
import { StripeSubscribeButton } from "@/components/stripe-subscribe-button";
import { TransferSuggestButton } from "@/components/transfer-suggest-button";
import { TransferHistory } from "@/components/transfer-history";
import { useState } from "react";

export default function HomePage() {
  const { data } = trpc.savings.insights.useQuery();
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <main className="min-h-screen grid-glow">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <header className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-sm text-slate shadow-sm">
            Automated Savings App
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-slate md:text-5xl">
            Detect safe amounts to save automatically.
          </h1>
          <p className="max-w-2xl text-lg text-slate/80">
            Connect your bank, analyze your spending patterns, and set up safe transfers to your
            savings account. Keep the lights on with a Stripe subscription.
          </p>
        </header>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <PlaidLinkButton onConnected={() => setRefreshKey((prev) => prev + 1)} />
          <PlaidTransactions refreshKey={refreshKey} />
          <TransferSuggestButton />
          <TransferHistory />
          {[
            {
              title: "1. Connect Bank (Plaid)",
              body: "Securely link accounts and pull transaction history for analysis."
            },
            {
              title: "2. Analyze Spending",
              body: "Run cash-flow models to calculate safe-to-save thresholds."
            },
            {
              title: "3. Suggest Transfers",
              body: "Recommend transfers and automate when confidence is high."
            },
            {
              title: "4. Subscription (Stripe)",
              body: "Charge a monthly plan and manage trials and upgrades."
            }
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-lg shadow-black/5"
            >
              <h3 className="text-xl font-semibold text-slate">{card.title}</h3>
              <p className="mt-2 text-slate/80">{card.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-ink text-white p-8 shadow-xl">
            <h2 className="text-2xl font-semibold">Safe-to-save snapshot</h2>
            <p className="mt-2 text-white/70">
              The API uses mocked data right now. Wire up Plaid + Stripe to see live values.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {data?.insights.map((insight) => (
                <div key={insight.label} className="rounded-xl bg-white/10 p-4">
                  <p className="text-sm text-white/60">{insight.label}</p>
                  <p className="text-2xl font-semibold">{insight.value}</p>
                </div>
              ))}
            </div>
          </div>
          <StripeSubscribeButton />
        </section>
      </div>
    </main>
  );
}
