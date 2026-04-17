// POST /api/gerar-pdf
// Verifies the Stripe payment and generates a branded PDF of the training plan.
// Body: { session_id: string, plano: PlanoTreino }

import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { gerarPDF } from "@/lib/pdf";
import type { PlanoTreino } from "@/types";

export async function POST(req: NextRequest) {
  let body: { session_id?: string; plano?: PlanoTreino };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const { session_id, plano } = body;

  if (!session_id || !session_id.startsWith("cs_")) {
    return NextResponse.json(
      { error: "session_id inválido ou em falta." },
      { status: 400 }
    );
  }

  if (!plano) {
    return NextResponse.json(
      { error: "Dados do plano em falta." },
      { status: 400 }
    );
  }

  // Verify that Stripe actually received the payment
  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Pagamento não confirmado. Contacta o suporte se fizeste o pagamento." },
        { status: 402 }
      );
    }
  } catch (err: unknown) {
    console.error("[gerar-pdf] Stripe verification failed:", err);
    return NextResponse.json(
      { error: "Não foi possível verificar o pagamento." },
      { status: 500 }
    );
  }

  // Generate the PDF
  try {
    const pdfBuffer = await gerarPDF(plano);
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="velociplan-treino.pdf"',
      },
    });
  } catch (err: unknown) {
    console.error("[gerar-pdf] PDF generation failed:", err);
    return NextResponse.json(
      { error: "Erro ao gerar o PDF. Tenta novamente." },
      { status: 500 }
    );
  }
}
