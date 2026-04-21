// GET /api/stripe/verify?session_id=cs_xxx
// Checks with Stripe whether a given checkout session was actually paid.
// Called by the /sucesso page after the user is redirected back from Stripe.

import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json(
      { paid: false, error: "session_id inválido ou em falta." },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripeClient();

    // Retrieve the session from Stripe to check its payment status
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const paid = session.payment_status === "paid";

    return NextResponse.json({ paid });
  } catch (err: unknown) {
    console.error("[stripe/verify]", err);

    // If the session ID doesn't exist, Stripe throws a not-found error
    if (err instanceof Error && err.message.includes("No such checkout.session")) {
      return NextResponse.json(
        { paid: false, error: "Sessão de pagamento não encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { paid: false, error: "Não foi possível verificar o pagamento." },
      { status: 500 }
    );
  }
}
