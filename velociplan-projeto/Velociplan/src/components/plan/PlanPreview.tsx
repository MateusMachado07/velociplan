"use client";

import type { PlanoTreino, SemanaTreino, DiaTreino } from "@/types";
import { cn } from "@/lib/utils";

// ── Colour-codes intensity zones for visual scanning ──────────────
function zoneColour(zone: string): string {
  const z = zone.toLowerCase();
  if (z.includes("zona 1") || z.includes("recupera")) return "text-blue-300";
  if (z.includes("zona 2") || z.includes("aeróbi")) return "text-green-400";
  if (z.includes("zona 3") || z.includes("tempo")) return "text-yellow-400";
  if (z.includes("zona 4") || z.includes("limiar")) return "text-orange-400";
  if (z.includes("zona 5") || z.includes("vo2")) return "text-red-400";
  return "text-brand-blue-light";
}

// ── Single day card ────────────────────────────────────────────────
function DayCard({ dia }: { dia: DiaTreino }) {
  if (dia.descanso || !dia.sessao) {
    return (
      <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
        <p className="font-medium text-gray-500 text-sm">{dia.dia}</p>
        <p className="text-gray-700 text-xs mt-1">Descanso / Recuperação</p>
      </div>
    );
  }

  const s = dia.sessao;
  return (
    <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col gap-2">
      {/* Day + duration */}
      <div className="flex justify-between items-start">
        <p className="font-semibold text-white text-sm">{dia.dia}</p>
        <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-full shrink-0 ml-2">
          {s.duracao}
        </span>
      </div>

      {/* Training type */}
      <p className="text-brand-blue text-xs font-bold uppercase tracking-wide">
        {s.tipo}
      </p>

      {/* Intensity zone */}
      <p className={cn("text-xs font-medium", zoneColour(s.zonaIntensidade))}>
        {s.zonaIntensidade}
      </p>

      {/* Instructions */}
      <p className="text-gray-300 text-xs leading-relaxed">{s.instrucoes}</p>

      {/* Warm-up / cool-down */}
      <div className="border-t border-white/5 pt-2 flex flex-col gap-1">
        <p className="text-gray-500 text-xs">
          <span className="text-gray-400 font-medium">Aquecimento:</span>{" "}
          {s.aquecimento}
        </p>
        <p className="text-gray-500 text-xs">
          <span className="text-gray-400 font-medium">Arrefecimento:</span>{" "}
          {s.arrefecimento}
        </p>
      </div>
    </div>
  );
}

// ── One week block ─────────────────────────────────────────────────
function WeekBlock({ semana }: { semana: SemanaTreino }) {
  const sessionCount = semana.dias.filter((d) => !d.descanso).length;

  return (
    <div className="mb-8">
      {/* Week header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-bold bg-brand-blue/20 text-brand-blue px-3 py-1 rounded-full uppercase tracking-widest">
          Semana {semana.semana}
        </span>
        <span className="text-gray-300 text-sm font-medium">{semana.foco}</span>
        <span className="text-gray-600 text-xs ml-auto">
          {sessionCount} sessão{sessionCount !== 1 ? "ões" : ""}
        </span>
      </div>

      {/* Day cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {semana.dias.map((dia) => (
          <DayCard key={dia.dia} dia={dia} />
        ))}
      </div>
    </div>
  );
}

// ── Section heading ────────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
      {children}
    </h2>
  );
}

// ── Props ──────────────────────────────────────────────────────────
interface PlanPreviewProps {
  plano: PlanoTreino;
  /** Called when the user clicks the payment button */
  onPagar: () => void;
  /** True while the Stripe checkout is being created */
  pagando?: boolean;
}

// ── Main component ─────────────────────────────────────────────────
export default function PlanPreview({ plano, onPagar, pagando = false }: PlanPreviewProps) {
  // Show the first 2 weeks fully; blur everything from week 3 onwards
  const VISIBLE_WEEKS = 2;
  const visibleWeeks = plano.semanas.slice(0, VISIBLE_WEEKS);
  const hiddenWeeks = plano.semanas.slice(VISIBLE_WEEKS);
  const hasHiddenContent = hiddenWeeks.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16">

      {/* ── Plan header ── */}
      <div className="text-center py-10 border-b border-white/10 mb-8">
        <div className="inline-flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
          Pré-visualização Gratuita
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
          {plano.titulo}
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
          <span>🗓 {plano.duracao} semanas</span>
          <span>·</span>
          <span>
            🚴{" "}
            {plano.semanas.reduce(
              (acc, s) => acc + s.dias.filter((d) => !d.descanso).length,
              0
            )}{" "}
            sessões
          </span>
        </div>
      </div>

      {/* ── Profile summary ── */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
        <p className="text-xs text-brand-blue font-bold uppercase tracking-widest mb-2">
          O Teu Perfil
        </p>
        <p className="text-gray-300 leading-relaxed text-sm">{plano.resumoPerfil}</p>
      </div>

      {/* ── Plan overview ── */}
      <div className="mb-10">
        <SectionHeading>📋 Visão Geral do Plano</SectionHeading>
        <p className="text-gray-300 leading-relaxed">{plano.resumoPlano}</p>
      </div>

      {/* ── Visible weeks (1 and 2) ── */}
      <div className="mb-4">
        <SectionHeading>📅 Programa Semanal</SectionHeading>
        {visibleWeeks.map((semana) => (
          <WeekBlock key={semana.semana} semana={semana} />
        ))}
      </div>

      {/* ── Blur wall — everything from week 3 onwards ── */}
      {hasHiddenContent && (
        <div className="relative">
          {/* Blurred content */}
          <div
            className="blur-sm pointer-events-none select-none opacity-60"
            aria-hidden="true"
          >
            {hiddenWeeks.map((semana) => (
              <WeekBlock key={semana.semana} semana={semana} />
            ))}

            {/* Nutrition and recovery sections — also blurred */}
            <div className="mt-8 mb-6">
              <SectionHeading>🥗 Nutrição</SectionHeading>
              <p className="text-gray-300 leading-relaxed">{plano.nutricao}</p>
            </div>
            <div className="mb-6">
              <SectionHeading>💤 Recuperação</SectionHeading>
              <p className="text-gray-300 leading-relaxed">{plano.recuperacao}</p>
            </div>
            <div className="mb-6">
              <SectionHeading>💬 Mensagem Final</SectionHeading>
              <p className="text-gray-300 leading-relaxed italic">
                {plano.mensagemMotivacional}
              </p>
            </div>
          </div>

          {/* Gradient fade — from transparent to brand-navy */}
          <div
            className="absolute inset-x-0 top-0 h-32 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgb(13, 27, 42))",
            }}
          />

          {/* Lock overlay ── payment CTA ── */}
          <div className="absolute inset-x-0 top-16 flex flex-col items-center px-4">
            <div className="bg-brand-navy/95 border border-white/10 rounded-2xl p-8 text-center max-w-sm w-full shadow-2xl shadow-black/50">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="text-xl font-bold text-white mb-2">
                O plano continua aqui
              </h3>
              <p className="text-gray-400 text-sm mb-1">
                {hiddenWeeks.length} semana{hiddenWeeks.length !== 1 ? "s" : ""} de treino
                {" · "}nutrição
                {" · "}recuperação
              </p>
              <p className="text-gray-400 text-sm mb-6">
                PDF profissional para descarregar e guardar
              </p>

              <button
                onClick={onPagar}
                disabled={pagando}
                className="w-full bg-brand-blue hover:bg-brand-blue-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-lg shadow-brand-blue/30 text-lg"
              >
                {pagando ? "A processar..." : "Descarregar PDF Completo — €9,99"}
              </button>
              <p className="text-gray-600 text-xs mt-3">
                Pagamento seguro via Stripe · PDF entregue imediatamente
              </p>
            </div>
          </div>

          {/* Spacer so the lock overlay doesn't overlap the footer */}
          <div className="h-80" />
        </div>
      )}

      {/* ── If all weeks are visible (short plan), show full content ── */}
      {!hasHiddenContent && (
        <>
          <div className="mt-8 mb-6">
            <SectionHeading>🥗 Nutrição</SectionHeading>
            <p className="text-gray-300 leading-relaxed">{plano.nutricao}</p>
          </div>
          <div className="mb-6">
            <SectionHeading>💤 Recuperação</SectionHeading>
            <p className="text-gray-300 leading-relaxed">{plano.recuperacao}</p>
          </div>
          <div className="mb-10">
            <SectionHeading>💬 Mensagem Final</SectionHeading>
            <p className="text-gray-300 leading-relaxed italic">
              {plano.mensagemMotivacional}
            </p>
          </div>

          {/* CTA when plan is very short (≤ 2 weeks) */}
          <div className="bg-white/5 border border-brand-blue/20 rounded-2xl p-8 text-center">
            <p className="text-white font-bold text-lg mb-2">
              Pronto para o teu PDF profissional?
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Descarrega o plano completo formatado em PDF de alta qualidade.
            </p>
            <button
              onClick={onPagar}
              disabled={pagando}
              className="bg-brand-blue hover:bg-brand-blue-dark disabled:opacity-60 text-white font-bold py-4 px-10 rounded-xl transition-colors shadow-lg shadow-brand-blue/30 text-lg"
            >
              {pagando ? "A processar..." : "Descarregar PDF Completo — €9,99"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
