import { NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";
import { env } from "@/lib/env";
import type { CountryCode, Products } from "plaid";

export async function POST() {
  const response = await plaidClient.linkTokenCreate({
    user: {
      client_user_id: "demo-user"
    },
    client_name: "Automated Savings App",
    products: env.PLAID_PRODUCTS.split(",") as Products[],
    country_codes: env.PLAID_COUNTRY_CODES.split(",") as CountryCode[],
    language: "en",
    redirect_uri: env.PLAID_REDIRECT_URI || undefined
  });

  return NextResponse.json(response.data);
}
