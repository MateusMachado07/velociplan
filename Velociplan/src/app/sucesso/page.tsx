"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { PlanoTreino } from "@/types";

// ── Inner component — uses useSearchParams (requires Suspense boundary) ──
function SucessoContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  type State =
    | { status: "verifying" }
    | { status: "paid"; plano: PlanoTreino | null }
    | { status: "error"; message: string };

  const [state, setState] = useState<State>({ status: "verifying" });
  const [downloading, setDownloading] = useState(false);
  const hasCalled = useRef(false);

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    if (!sessionId) {
      setState({ status: "error", message: "Sessão de pagamento não encontrada." });
      return;
    }

    // Save the session ID so the PDF download can use it
    sessionStorage.setItem("velociplan_session_id", sessionId);

    // Verify the payment with Stripe via our API
    fetch(`/api/stripe/verify?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data: { paid: boolean; error?: string }) => {
        if (data.paid) {
          // Read the plan from sessionStorage (stored during AI generation)
          const stored = sessionStorage.getItem("velociplan_plano");
          const plano = stored ? (JSON.parse(stored) as PlanoTreino) : null;
          setState({ status: "paid", plano });
        } else {
          setState({
            status: "error",
            message:
              data.error ?? "Pagamento não confirmado. Se fizeste o pagamento, aguarda alguns segundos e tenta novamente.",
          });
        }
      })
      .catch(() => {
        setState({
          status: "error",
          message: "Não foi possível verificar o pagamento. Verifica a ligação e tenta novamente.",
        });
      });
  }, [sessionId]);

  // Called when the user clicks "Descarregar PDF"
  // Sends the plan data to the server, which verifies payment and generates the PDF
  async function handleDownload() {
    if (!sessionId) return;
    if (state.status !== "paid" || !state.plano) {
      alert("O teu plano não foi encontrado. Volta à página inicial e gera um novo plano.");
      return;
    }
    setDownloading(true);

    try {
      const res = await fetch("/api/gerar-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, plano: state.plano }),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        alert(data.error ?? "Erro ao gerar o PDF. Tenta novamente.");
        return;
      }

      // Trigger browser download
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "velociplan-treino.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Erro ao descarregar o PDF. Tenta novamente.");
    } finally {
      setDownloading(false);
    }
  }

  // ── Verifying ──
  if (state.status === "verifying") {
    return (
      <div className="text-center">
        <div className="text-5xl mb-5 animate-pulse">⏳</div>
        <h1 className="text-2xl font-bold text-white mb-3">
          A verificar pagamento...
        </h1>
        <p className="text-gray-400">Aguarda um momento.</p>
      </div>
    );
  }

  // ── Error ──
  if (state.status === "error") {
    return (
      <div className="text-center max-w-md">
        <div className="text-5xl mb-5">⚠️</div>
        <h1 className="text-2xl font-bold text-white mb-3">
          Problema com o pagamento
        </h1>
        <p className="text-gray-400 mb-8 leading-relaxed">{state.message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              hasCalled.current = false;
              setState({ status: "verifying" });
            }}
            className="bg-brand-blue hover:bg-brand-blue-dark text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Tentar Novamente
          </button>
          <Link
            href="/plano"
            className="border border-white/20 text-gray-300 hover:bg-white/5 font-medium px-8 py-3 rounded-xl transition-colors"
          >
            Voltar ao Plano
          </Link>
        </div>
      </div>
    );
  }

  // ── Paid ──
  return (
    <div className="text-center max-w-lg">
      {/* Success icon */}
      <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-10 h-10 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-extrabold text-white mb-3">
        Pagamento confirmado!
      </h1>

      {state.plano && (
        <p className="text-gray-300 mb-2 text-lg font-medium">
          {state.plano.titulo}
        </p>
      )}

      <p className="text-gray-400 mb-8 leading-relaxed">
        O teu plano de treino personalizado está pronto. Clica no botão abaixo
        para descarregar o PDF completo.
      </p>

      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="w-full bg-brand-blue hover:bg-brand-blue-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-lg py-4 px-8 rounded-xl transition-colors shadow-lg shadow-brand-blue/30 mb-4"
      >
        {downloading ? "A gerar PDF..." : "⬇ Descarregar PDF Completo"}
      </button>

      <p className="text-gray-600 text-xs mb-8">
        Guarda este PDF no teu dispositivo — é teu para sempre.
      </p>

      <div className="border-t border-white/10 pt-6">
        <p className="text-gray-500 text-sm mb-3">Queres gerar outro plano?</p>
        <Link
          href="/gerar"
          className="text-brand-blue hover:text-brand-blue-light text-sm font-medium transition-colors"
        >
          Criar novo plano →
        </Link>
      </div>
    </div>
  );
}

// ── Page wrapper — Suspense is required for useSearchParams ──
export default function SucessoPage() {
  return (
    <div className="min-h-screen bg-brand-navy flex flex-col">
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <Image src="/logo.png" alt="VelociPlan" width={130} height={38} />
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <Suspense
          fallback={
            <div className="text-center">
              <div className="text-5xl mb-5 animate-pulse">⏳</div>
              <p className="text-gray-400">A carregar...</p>
            </div>
          }
        >
          <SucessoContent />
        </Suspense>
      </div>
    </div>
  );
}
