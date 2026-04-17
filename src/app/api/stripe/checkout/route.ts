// POST /api/stripe/checkout
// Creates a Stripe Checkout session for the one-time plan payment.
// Returns { url } — the frontend redirects the user to that URL.

import { NextResponse } from "next/server";
import { getStripeClient, PLAN_PRICE_CENTS } from "@/lib/stripe";

export async function POST() {
  try {
    const stripe = getStripeClient();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "pt",

      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "VelociPlan — Plano de Treino Personalizado",
              description:
                "Plano de treino de ciclismo gerado por IA, personalizado ao teu perfil — PDF completo para descarregar.",
              images: [`${appUrl}/stripe-preview.png`],
            },
            unit_amount: PLAN_PRICE_CENTS, // e.g. 999 = €9.99
          },
          quantity: 1,
        },
      ],

      // After payment: redirect to /sucesso with the Stripe session ID in the URL.
      // The {CHECKOUT_SESSION_ID} placeholder is replaced automatically by Stripe.
      success_url: `${appUrl}/sucesso?session_id={CHECKOUT_SESSION_ID}`,

      // If the user cancels: redirect back to the plan preview.
      cancel_url: `${appUrl}/plano`,

      // Let Stripe handle promo codes (optional — easy to add later)
      allow_promotion_codes: false,
    });

    if (!session.url) {
      throw new Error("Stripe não devolveu um URL de checkout.");
    }

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("[stripe/checkout]", err);

    if (err instanceof Error && err.message.includes("STRIPE_SECRET_KEY")) {
      return NextResponse.json(
        {
          error:
            "Stripe não está configurado. Adiciona STRIPE_SECRET_KEY ao .env.local.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Não foi possível criar a sessão de pagamento. Tenta novamente.",
      },
      { status: 500 }
    );
  }
}
