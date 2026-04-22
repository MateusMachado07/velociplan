"use client";

import type { PlanoTreino, SemanaTreino, DiaTreino } from "@/types";

// ── Section title — mirrors PDF .section-title ─────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-extrabold text-[#1E90FF] uppercase tracking-[1.5px] border-l-[3px] border-[#1E90FF] pl-[9px] mb-2.5">
      {children}
    </div>
  );
}

// ── Render bullet-point text — mirrors PDF escBullets() ────────────
function BulletText({ text }: { text: string }) {
  const lines = text.split("\n").filter((l) => l.trim());
  return (
    <div>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        return (
          <p key={i} className="text-xs text-[#cbd5e1] leading-[1.7] pl-1">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

// ── Single day row — mirrors PDF .day / .day-rest ──────────────────
function DayRow({ dia }: { dia: DiaTreino }) {
  if (dia.descanso || !dia.sessao) {
    return (
      <div className="px-3.5 py-2 border-b border-white/[0.05] last:border-b-0 flex items-center gap-3 bg-black/[0.15]">
        <span className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.8px]">
          {dia.dia}
        </span>
        <span className="text-[11px] text-[#334155] italic">Descanso</span>
      </div>
    );
  }

  const s = dia.sessao;
  return (
    <div className="px-3.5 py-2.5 border-b border-white/[0.05] last:border-b-0">
      {/* Day name + session badge */}
      <div className="flex items-center gap-2.5 mb-[5px]">
        <span className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.8px]">
          {dia.dia}
        </span>
        <span className="bg-[#1E90FF]/15 border border-[#1E90FF]/30 text-[#60a5fa] text-[10px] font-bold px-2 py-[2px] rounded-full">
          {s.tipo}
        </span>
      </div>
      {/* Duration · Zone */}
      <p className="text-[11px] text-[#64748b] mb-[5px]">
        {s.duracao} &nbsp;·&nbsp; {s.zonaIntensidade}
      </p>
      {/* Warm-up */}
      {s.aquecimento && (
        <p className="text-[11px] text-[#475569] leading-[1.5] mt-[3px]">
          ▸ <strong>Aquec.:</strong> {s.aquecimento}
        </p>
      )}
      {/* Instructions */}
      <p className="text-xs text-[#cbd5e1] leading-[1.65] mb-[3px]">
        {s.instrucoes}
      </p>
      {/* Cool-down */}
      {s.arrefecimento && (
        <p className="text-[11px] text-[#475569] leading-[1.5] mt-[3px]">
          ▸ <strong>Arrec.:</strong> {s.arrefecimento}
        </p>
      )}
    </div>
  );
}

// ── Week block — mirrors PDF .week ─────────────────────────────────
function WeekBlock({ semana }: { semana: SemanaTreino }) {
  return (
    <div className="rounded-lg overflow-hidden border border-white/[0.08] mb-2.5">
      <div className="bg-[#1E90FF]/[0.15] border-b border-[#1E90FF]/25 px-3.5 py-[9px] flex items-center gap-2 min-w-0">
        <span className="text-[13px] font-black text-white whitespace-nowrap shrink-0">
          Semana {semana.semana}
        </span>
        <span className="text-[10px] font-bold text-[#60a5fa] uppercase tracking-[0.5px] truncate min-w-0">
          {semana.foco}
        </span>
      </div>
      <div>
        {semana.dias.map((dia) => (
          <DayRow key={dia.dia} dia={dia} />
        ))}
      </div>
    </div>
  );
}

// ── Nutrition / recovery / motivational — last page content ────────
function LastPageContent({ plano }: { plano: PlanoTreino }) {
  return (
    <>
      <div className="mb-[18px]">
        <SectionTitle>Nutrição</SectionTitle>
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-lg p-3.5">
          <BulletText text={plano.nutricao} />
        </div>
      </div>
      <div className="mb-[18px]">
        <SectionTitle>Recuperação</SectionTitle>
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-lg p-3.5">
          <BulletText text={plano.recuperacao} />
        </div>
      </div>
      <div className="mb-[18px]">
        <SectionTitle>Mensagem Final</SectionTitle>
        <div className="bg-gradient-to-br from-[#1E90FF]/10 to-[#1E90FF]/[0.04] border border-[#1E90FF]/25 rounded-lg p-4 text-center">
          <p className="text-[13px] italic text-[#93c5fd] leading-[1.8]">
            {plano.mensagemMotivacional}
          </p>
        </div>
      </div>
    </>
  );
}

// ── Props ──────────────────────────────────────────────────────────
interface PlanPreviewProps {
  plano: PlanoTreino;
  onPagar: () => void;
  pagando?: boolean;
}

// ── Main component ─────────────────────────────────────────────────
export default function PlanPreview({
  plano,
  onPagar,
  pagando = false,
}: PlanPreviewProps) {
  const VISIBLE_WEEKS = 2;
  const visibleWeeks = plano.semanas.slice(0, VISIBLE_WEEKS);
  const hiddenWeeks = plano.semanas.slice(VISIBLE_WEEKS);
  const totalSessoes = plano.semanas.reduce(
    (acc, s) => acc + s.dias.filter((d) => !d.descanso).length,
    0
  );

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16">

      {/* ── Plan cover — mirrors PDF .plan-cover ── */}
      <div className="pt-8 pb-5">

        <div className="bg-[#0a1520] border border-[#1E90FF]/20 rounded-xl px-5 py-[18px] mb-[18px]">
          <div className="inline-block bg-[#1E90FF]/[0.12] border border-[#1E90FF]/35 text-[#60a5fa] text-[9px] font-bold px-2.5 py-[3px] rounded-full uppercase tracking-[1px] mb-2.5">
            Plano Personalizado por IA
          </div>
          <h1 className="text-[18px] font-black text-white leading-snug mb-3">
            {plano.titulo}
          </h1>
          <div className="flex gap-5">
            <div className="flex items-center gap-1.5 text-[11px] text-[#94a3b8]">
              <div className="w-[5px] h-[5px] bg-[#1E90FF] rounded-full shrink-0" />
              {plano.duracao} semanas
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#94a3b8]">
              <div className="w-[5px] h-[5px] bg-[#1E90FF] rounded-full shrink-0" />
              {totalSessoes} sessões de treino
            </div>
          </div>
        </div>
      </div>

      {/* ── O Teu Perfil — mirrors PDF .card-blue ── */}
      <div className="mb-[18px]">
        <SectionTitle>O Teu Perfil</SectionTitle>
        <div className="bg-[#1E90FF]/[0.07] border border-[#1E90FF]/20 rounded-lg p-3.5">
          <p className="text-xs text-[#cbd5e1] leading-[1.8]">{plano.resumoPerfil}</p>
        </div>
      </div>

      {/* ── Visão Geral do Plano — mirrors PDF .card ── */}
      <div className="mb-[18px]">
        <SectionTitle>Visão Geral do Plano</SectionTitle>
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-lg p-3.5">
          <p className="text-xs text-[#cbd5e1] leading-[1.8]">{plano.resumoPlano}</p>
        </div>
      </div>

      {/* ── Programa Semanal (visible weeks) ── */}
      <div className="mb-4">
        <SectionTitle>Programa Semanal</SectionTitle>
        {visibleWeeks.map((semana) => (
          <WeekBlock key={semana.semana} semana={semana} />
        ))}
      </div>

      {/* ── Blur wall — hidden weeks + last-page content ── */}
      {hiddenWeeks.length > 0 && (
        <div className="relative">
          {/* Blurred content */}
          <div
            className="blur-sm pointer-events-none select-none opacity-60"
            aria-hidden="true"
          >
            {hiddenWeeks.map((semana) => (
              <WeekBlock key={semana.semana} semana={semana} />
            ))}
            <div className="mt-4">
              <LastPageContent plano={plano} />
            </div>
          </div>

          {/* Gradient fade */}
          <div
            className="absolute inset-x-0 top-0 h-32 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, transparent, #0D1B2A)",
            }}
          />

          {/* Lock overlay — payment CTA */}
          <div className="absolute inset-x-0 top-16 flex flex-col items-center px-4">
            <div className="bg-[#0a1520] border border-white/10 rounded-xl p-4 text-center max-w-xs w-full shadow-2xl shadow-black/50">
              <div className="text-2xl mb-1.5">🔒</div>
              <h3 className="text-sm font-bold text-white mb-1">
                O plano continua aqui
              </h3>
              <p className="text-gray-400 text-xs mb-3">
                {hiddenWeeks.length} semana{hiddenWeeks.length !== 1 ? "s" : ""} de treino · nutrição · recuperação · PDF profissional
              </p>
              <button
                onClick={onPagar}
                disabled={pagando}
                className="w-full bg-[#1E90FF] hover:bg-[#1565C0] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-lg transition-colors shadow-lg shadow-[#1E90FF]/30 text-sm"
              >
                {pagando ? "A processar..." : "Descarregar PDF Completo — €9,99"}
              </button>
              <p className="text-gray-600 text-[10px] mt-2">
                Pagamento seguro via Stripe · PDF entregue imediatamente
              </p>
            </div>
          </div>

          {/* Spacer so CTA doesn't overlap footer */}
          <div className="h-56" />
        </div>
      )}

      {/* ── Short plan (≤ 2 weeks): show full content + CTA ── */}
      {hiddenWeeks.length === 0 && (
        <>
          <div className="mt-4">
            <LastPageContent plano={plano} />
          </div>
          <div className="bg-[#0a1520] border border-[#1E90FF]/20 rounded-2xl p-8 text-center mt-4">
            <p className="text-white font-bold text-lg mb-2">
              Pronto para o teu PDF profissional?
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Descarrega o plano completo formatado em PDF de alta qualidade.
            </p>
            <button
              onClick={onPagar}
              disabled={pagando}
              className="bg-[#1E90FF] hover:bg-[#1565C0] disabled:opacity-60 text-white font-bold py-4 px-10 rounded-xl transition-colors shadow-lg shadow-[#1E90FF]/30 text-lg"
            >
              {pagando ? "A processar..." : "Descarregar PDF Completo — €9,99"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
