// POST /api/gerar-pdf
// Verifies the Stripe payment and generates a branded PDF of the training plan.
// Plan data is retrieved from the Stripe session metadata (stored at checkout).
// Body: { session_id: string, plano?: PlanoTreino } — plano is a fallback for
// sessions created before metadata storage was introduced.

export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { gerarPDF } from "@/lib/pdf";
import type { PlanoTreino } from "@/types";

const CHUNK = 490;

function planFromMetadata(metadata: Record<string, string> | null): PlanoTreino | null {
  if (!metadata) return null;
  const numChunks = parseInt(metadata["pc"] ?? "0");
  if (!numChunks) return null;
  let planJson = "";
  for (let i = 0; i < numChunks; i++) {
    planJson += metadata[`p${i}`] ?? "";
  }
  try {
    return JSON.parse(planJson) as PlanoTreino;
  } catch {
    return null;
  }
}

// suppress unused warning — CHUNK used in checkout route but kept here for symmetry
void CHUNK;

export async function POST(req: NextRequest) {
  let body: { session_id?: string; plano?: PlanoTreino };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const { session_id, plano: planFromClient } = body;

  if (!session_id || !session_id.startsWith("cs_")) {
    return NextResponse.json(
      { error: "session_id inválido ou em falta." },
      { status: 400 }
    );
  }

  // Verify payment and retrieve metadata in one call
  let plano: PlanoTreino | null = null;
  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Pagamento não confirmado. Contacta o suporte se fizeste o pagamento." },
        { status: 402 }
      );
    }

    // Primary: reconstruct plan from Stripe metadata chunks
    plano = planFromMetadata(session.metadata as Record<string, string> | null);
  } catch (err: unknown) {
    console.error("[gerar-pdf] Stripe verification failed:", err);
    return NextResponse.json(
      { error: "Não foi possível verificar o pagamento." },
      { status: 500 }
    );
  }

  // Fallback: use plan sent by the client (old sessions without metadata)
  if (!plano) {
    plano = planFromClient ?? null;
  }

  if (!plano) {
    return NextResponse.json(
      { error: "Dados do plano em falta. Tenta gerar um novo plano." },
      { status: 400 }
    );
  }

  // Generate the PDF
  try {
    const pdfBuffer = await gerarPDF(plano);
    return new NextResponse(new Uint8Array(pdfBuffer), {
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
