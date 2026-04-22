// POST /api/stripe/checkout
// Creates a Stripe Checkout session for the one-time plan payment.
// Accepts the plan JSON in the request body and stores it in Stripe metadata
// (chunked at 490 chars per key) so it can be retrieved server-side on /sucesso.
// Returns { url } — the frontend redirects the user to that URL.

import { NextRequest, NextResponse } from "next/server";
import { getStripeClient, PLAN_PRICE_CENTS } from "@/lib/stripe";
import type { PlanoTreino } from "@/types";

const CHUNK = 490; // safely under Stripe's 500-char value limit

export async function POST(req: NextRequest) {
  let plano: PlanoTreino | null = null;
  try {
    const body = await req.json() as { plano?: PlanoTreino };
    plano = body.plano ?? null;
  } catch {
    // no body — proceed without plan in metadata
  }

  // Split plan JSON into ≤490-char chunks stored as p0, p1, ... and pc (count)
  const metadata: Record<string, string> = {};
  if (plano) {
    const planJson = JSON.stringify(plano);
    const numChunks = Math.ceil(planJson.length / CHUNK);
    // Stripe allows 50 metadata keys max; skip storing if plan is too large
    if (numChunks <= 45) {
      metadata["pc"] = String(numChunks);
      for (let i = 0; i < numChunks; i++) {
        metadata[`p${i}`] = planJson.slice(i * CHUNK, (i + 1) * CHUNK);
      }
    }
  }

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
            },
            unit_amount: PLAN_PRICE_CENTS,
          },
          quantity: 1,
        },
      ],

      success_url: `${appUrl}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/plano`,
      allow_promotion_codes: false,
      metadata,
    });

    if (!session.url) {
      throw new Error("Stripe não devolveu um URL de checkout.");
    }

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("[stripe/checkout]", err);

    if (err instanceof Error && err.message.includes("STRIPE_SECRET_KEY")) {
      return NextResponse.json(
        { error: "Stripe não está configurado. Adiciona STRIPE_SECRET_KEY ao .env.local." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Não foi possível criar a sessão de pagamento. Tenta novamente." },
      { status: 500 }
    );
  }
}
