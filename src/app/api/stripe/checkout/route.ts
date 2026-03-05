import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { getDemoUser } from "@/server/demo-user";

export async function POST() {
  const user = await getDemoUser();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${env.NEXT_PUBLIC_APP_URL}/?checkout=success`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/?checkout=cancel`,
    customer_email: user.email,
    subscription_data: {
      metadata: {
        userId: user.id
      }
    },
    metadata: {
      userId: user.id
    }
  });

  return NextResponse.json({ url: session.url });
}
