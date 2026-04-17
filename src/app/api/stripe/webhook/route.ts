// POST /api/stripe/webhook
// Receives events from Stripe (e.g. payment confirmed).
// Stripe calls this URL automatically after every payment event.
//
// IMPORTANT: This route must receive the raw request body (not parsed JSON)
// so that Stripe's signature verification works correctly.

import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text(); // raw body as string
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("[webhook] Missing stripe-signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // Verify the event came from Stripe (not a fake request)
  let event: Stripe.Event;
  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle relevant events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`[webhook] ✓ Payment confirmed — session: ${session.id}, amount: ${session.amount_total}`);
      // For MVP: payment is verified on-demand by /api/stripe/verify when the user
      // lands on /sucesso. No database needed for this flow.
      // In a future version, you could send an email receipt or store the record here.
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`[webhook] Session expired: ${session.id}`);
      break;
    }

    default:
      // Ignore all other event types
      break;
  }

  // Always return 200 so Stripe doesn't retry the event
  return NextResponse.json({ received: true });
}
