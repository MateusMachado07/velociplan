"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PlanPreview from "@/components/plan/PlanPreview";
import type { PlanoTreino } from "@/types";

// ── Loading messages that cycle every few seconds ─────────────────
const LOADING_MESSAGES = [
  "A analisar o teu perfil de ciclista...",
  "A calcular o volume de treino ideal...",
  "A estruturar o teu programa semanal...",
  "A personalizar os treinos ao teu nível...",
  "A incluir orientações de nutrição...",
  "Últimos ajustes ao teu plano personalizado...",
];

// ── Page states ────────────────────────────────────────────────────
type PageState =
  | { status: "loading" }
  | { status: "success"; plano: PlanoTreino }
  | { status: "error"; message: string };

export default function PlanoPage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>({ status: "loading" });
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [pagando, setPagando] = useState(false);
  // Incrementing this triggers a retry by re-running the useEffect
  const [attempt, setAttempt] = useState(0);

  // Prevents the API call from firing twice in React StrictMode (dev only)
  const hasCalled = useRef(false);

  // Cycle loading messages while waiting for the AI
  useEffect(() => {
    if (state.status !== "loading") return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [state.status]);

  // Main effect: read form data from sessionStorage and call the API
  // Re-runs when `attempt` changes (triggered by the retry button)
  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    async function generatePlan() {
      // 1. Read the form data that the wizard stored in sessionStorage
      const stored = sessionStorage.getItem("velociplan_form");
      if (!stored) {
        // No form data — redirect back to the form
        router.replace("/gerar");
        return;
      }

      let formData: unknown;
      try {
        formData = JSON.parse(stored);
      } catch {
        router.replace("/gerar");
        return;
      }

      // 2. Check if we already have a cached plan from a previous generation
      const cachedPlan = sessionStorage.getItem("velociplan_plano");
      if (cachedPlan) {
        try {
          const plano = JSON.parse(cachedPlan) as PlanoTreino;
          setState({ status: "success", plano });
          return;
        } catch {
          // Cached plan is corrupt — regenerate
          sessionStorage.removeItem("velociplan_plano");
        }
      }

      // 3. Call the AI generation API with a 600-second timeout
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 600_000);

        let res: Response;
        try {
          res = await fetch("/api/gerar-plano", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timeoutId);
        }

        let data: Record<string, unknown>;
        try {
          data = await res.json();
        } catch {
          setState({
            status: "error",
            message: "O servidor não respondeu corretamente. Verifica se o servidor está a correr e tenta novamente.",
          });
          return;
        }

        if (!res.ok) {
          setState({
            status: "error",
            message: (data.error as string) ?? "Ocorreu um erro inesperado. Tenta novamente.",
          });
          return;
        }

        const plano = data.plano as PlanoTreino;

        // Cache the plan so a page refresh doesn't re-call the AI
        sessionStorage.setItem("velociplan_plano", JSON.stringify(plano));

        setState({ status: "success", plano });
      } catch (err: unknown) {
        const isTimeout = err instanceof Error && err.name === "AbortError";
        setState({
          status: "error",
          message: isTimeout
            ? "A geração do plano demorou demasiado tempo. Tenta novamente — normalmente demora 1 a 2 minutos."
            : "Não foi possível ligar ao servidor. Verifica se o servidor está a correr com 'npm run dev' e tenta novamente.",
        });
      }
    }

    generatePlan();
  }, [router, attempt]);

  // Prevent back navigation once the plan is shown
  useEffect(() => {
    if (state.status !== "success") return;
    history.pushState(null, "", window.location.href);
    const handlePopState = () => history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [state.status]);

  // Creates a Stripe Checkout session and redirects the user to Stripe's payment page
  async function handlePagar() {
    setPagando(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json() as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        alert(data.error ?? "Erro ao iniciar pagamento. Tenta novamente.");
        return;
      }

      // Redirect to Stripe Checkout — user pays there and comes back to /sucesso
      window.location.href = data.url;
    } catch {
      alert("Não foi possível ligar ao servidor. Verifica a ligação e tenta novamente.");
    } finally {
      setPagando(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────
  if (state.status === "loading") {
    return (
      <div className="min-h-screen bg-brand-navy flex flex-col">
        {/* Nav */}
        <nav className="border-b border-white/10 px-4 py-2">
          <div className="max-w-3xl mx-auto">
            <Image src="/logo.png" alt="VelociPlan" width={130} height={39} className="w-24 sm:w-32 h-auto" />
          </div>
        </nav>

        {/* Loading state */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          {/* Animated cycling icon */}
          <div className="relative mb-8">
            <div className="text-7xl animate-bounce">🚴</div>
            {/* Spinning ring behind the icon */}
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              <div className="w-24 h-24 rounded-full border-4 border-brand-blue/20 border-t-brand-blue animate-spin" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-3">
            A gerar o teu plano personalizado
          </h1>

          {/* Cycling loading message */}
          <p
            key={loadingMsgIndex}
            className="text-brand-blue-light text-sm font-medium animate-pulse"
          >
            {LOADING_MESSAGES[loadingMsgIndex]}
          </p>

          <p className="text-gray-600 text-xs mt-6 max-w-xs">
            A Inteligência Artificial está a criar um plano exclusivo para o teu
            perfil. Isto pode demorar 1 a 3 minutos.
          </p>
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-md">
          <div className="text-5xl mb-5">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Algo correu mal
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">{state.message}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                sessionStorage.removeItem("velociplan_plano");
                hasCalled.current = false;
                setState({ status: "loading" });
                setAttempt((n) => n + 1);
              }}
              className="bg-brand-blue hover:bg-brand-blue-dark text-white font-bold px-8 py-3 rounded-xl transition-colors"
            >
              Tentar Novamente
            </button>
            <Link
              href="/gerar"
              className="border border-white/20 text-gray-300 hover:bg-white/5 font-medium px-8 py-3 rounded-xl transition-colors"
            >
              Voltar ao Formulário
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Success — show plan preview ──────────────────────────────────
  return (
    <div className="min-h-screen bg-brand-navy">
      {/* Nav */}
      <nav className="border-b border-white/10 px-4 py-2 sticky top-0 bg-brand-navy/90 backdrop-blur-sm z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Image src="/logo.png" alt="VelociPlan" width={130} height={39} className="w-24 sm:w-32 h-auto" />
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sessionStorage.removeItem("velociplan_form");
                sessionStorage.removeItem("velociplan_plano");
                router.push("/gerar");
              }}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Novo Plano
            </button>
            <button
              onClick={handlePagar}
              disabled={pagando}
              className="bg-brand-blue hover:bg-brand-blue-dark disabled:opacity-60 text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors"
            >
              {pagando ? "A redirecionar..." : "Descarregar PDF — €9,99"}
            </button>
          </div>
        </div>
      </nav>

      {/* Plan preview */}
      <PlanPreview plano={state.plano} onPagar={handlePagar} pagando={pagando} />
    </div>
  );
}
