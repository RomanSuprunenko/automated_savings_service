"use client";

import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";

type LinkTokenResponse = {
  link_token: string;
};

type PlaidLinkButtonProps = {
  onConnected?: () => void;
};

export function PlaidLinkButton({ onConnected }: PlaidLinkButtonProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Idle");
  const [itemId, setItemId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function createLinkToken() {
      setStatus("Creating link token...");
      const response = await fetch("/api/plaid/link-token", { method: "POST" });
      const data = (await response.json()) as LinkTokenResponse;
      if (mounted) {
        setLinkToken(data.link_token);
        setStatus("Ready");
      }
    }

    createLinkToken().catch((error) => {
      console.error(error);
      setStatus("Failed to create link token");
    });

    return () => {
      mounted = false;
    };
  }, []);

  const onSuccess = useCallback(async (publicToken: string) => {
    setStatus("Exchanging public token...");
    const response = await fetch("/api/plaid/exchange-public-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicToken })
    });
    const data = (await response.json()) as { itemId: string };
    setItemId(data.itemId);
    setStatus("Connected");
    onConnected?.();
  }, []);

  const { open, ready, error } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit: () => setStatus("Exited")
  });

  return (
    <div className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-lg shadow-black/5">
      <h3 className="text-xl font-semibold text-slate">Connect your bank</h3>
      <p className="mt-2 text-slate/80">
        Launch Plaid Link, then exchange the public token for an access token.
      </p>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => open()}
          disabled={!ready}
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Launch Plaid Link
        </button>
        <span className="text-sm text-slate/70">{status}</span>
      </div>
      {error && <p className="mt-3 text-sm text-coral">Plaid error: {error.message}</p>}
      {itemId && (
        <p className="mt-3 text-sm text-slate/80">
          Connected item: <span className="font-semibold">{itemId}</span>
        </p>
      )}
    </div>
  );
}
