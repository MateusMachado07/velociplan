import Link from "next/link";
import Image from "next/image";

const faqs = [
  {
    pergunta: "Funciona para iniciantes?",
    resposta:
      "Sim, absolutamente. O formulário pergunta o teu nível actual e o plano é adaptado ao teu ponto de partida — mesmo que nunca tenhas treinado de forma estruturada.",
  },
  {
    pergunta: "Quanto tempo demora a gerar o plano?",
    resposta:
      "Normalmente entre 1 a 3 minutos. A IA analisa o teu perfil e cria um plano completo e personalizado — não é um template genérico.",
  },
  {
    pergunta: "Como recebo o PDF?",
    resposta:
      "Depois do pagamento, és redirecionado para uma página onde descarregas o PDF imediatamente. Fica guardado no teu dispositivo para sempre.",
  },
  {
    pergunta: "Posso gerar mais do que um plano?",
    resposta:
      "Sim. Cada plano custa €9,99. Podes gerar tantos planos quantos quiseres — por exemplo, um novo plano quando os teus objetivos mudarem.",
  },
  {
    pergunta: "E se não gostar do plano?",
    resposta:
      "Podes ver a pré-visualização gratuita antes de pagar. Só pagas se ficares satisfeito com o que a IA gerou. Sem riscos.",
  },
];

const features = [
  {
    num: "01",
    title: "IA que te conhece",
    description:
      "O teu plano é criado com base no teu perfil único — nível, objetivos, horário disponível e equipamento. Nenhum plano é igual a outro.",
  },
  {
    num: "02",
    title: "PDF pronto a usar",
    description:
      "Um documento profissional com o teu plano semana a semana, aquecimentos, intensidades e orientações de nutrição. Imprime ou guarda no telemóvel.",
  },
  {
    num: "03",
    title: "100% personalizado",
    description:
      "Não é um plano genérico copiado da internet. É construído especificamente para ti — com as tuas disponibilidades, limitações físicas e objetivos.",
  },
  {
    num: "04",
    title: "Pagamento único · sem subscrições",
    description:
      "Pagas €9,99 uma vez e o PDF é teu para sempre. Nada de mensalidades, nada de surpresas.",
  },
];

const steps = [
  { numero: "01", titulo: "Preenches o formulário", texto: "5 minutos para nos contares o teu nível, objetivos, disponibilidade e equipamento." },
  { numero: "02", titulo: "A IA cria o teu plano", texto: "Em 1 a 3 minutos recebes um plano completo, semana a semana, feito para ti." },
  { numero: "03", titulo: "Vês a pré-visualização grátis", texto: "Consulta as primeiras semanas do teu plano antes de tomares qualquer decisão." },
  { numero: "04", titulo: "Pagas e descarregas", texto: "€9,99 uma vez. O PDF completo é teu imediatamente, para sempre." },
];

const jsonLdProduct = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "VelociPlan — Plano de Treino de Ciclismo Personalizado",
  description:
    "Plano de treino de ciclismo gerado por Inteligência Artificial. Personalizado para o teu nível, objetivos e disponibilidade. Inclui periodização, intensidades, aquecimentos e nutrição.",
  brand: { "@type": "Brand", name: "VelociPlan" },
  offers: {
    "@type": "Offer",
    price: "9.99",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    priceValidUntil: "2026-12-31",
    seller: { "@type": "Organization", name: "VelociPlan" },
  },
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.pergunta,
    acceptedAnswer: { "@type": "Answer", text: faq.resposta },
  })),
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#07101A] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      {/* ── Navigation ── */}
      <nav className="border-b border-white/[0.06] px-6 py-4 sticky top-0 bg-[#07101A]/95 backdrop-blur-md z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Image src="/logo.png" alt="VelociPlan" width={190} height={57} />
          <div className="flex items-center gap-4">
            <a
              href="#como-funciona"
              className="hidden sm:block text-sm text-white/40 hover:text-white/75 transition-colors font-medium tracking-wide"
            >
              Como funciona
            </a>
            <Link
              href="/gerar"
              className="bg-[#AAFF00] hover:bg-[#BFFF40] active:scale-[0.98] text-[#07101A] font-bold text-sm px-5 py-2.5 rounded-lg transition-all duration-150 tracking-wide"
            >
              Gerar Plano Grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        className="relative px-6 pt-24 pb-20 overflow-hidden"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-55deg, transparent, transparent 80px, rgba(255,255,255,0.012) 80px, rgba(255,255,255,0.012) 81px)",
        }}
      >
        {/* Glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[700px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(30,144,255,0.09) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative">
          {/* Pre-headline badge */}
          <div className="inline-flex items-center gap-2 bg-[#AAFF00]/10 border border-[#AAFF00]/25 text-[#AAFF00] text-xs font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#AAFF00] animate-pulse inline-block" />
            Cansado de treinar sem estrutura e não evoluir?
          </div>

          {/* Main heading */}
          <h1 className="font-condensed text-[clamp(3.5rem,9vw,7.5rem)] font-bold leading-[0.93] uppercase tracking-tight mb-8">
            O teu plano<br />
            de ciclismo{" "}
            <span style={{ color: "#AAFF00" }}>personalizado</span>
            <br />
            <span className="text-white/25">por</span>{" "}
            <span style={{ color: "#1E90FF" }}>inteligência artificial</span>
          </h1>

          <p className="text-lg text-white/50 mb-10 leading-relaxed max-w-xl mx-auto font-light">
            Preenches um formulário de 5 minutos. A IA analisa o teu perfil e
            cria um plano completo — semana a semana, com intensidades,
            aquecimentos e nutrição. Vês grátis. Pagas só para descarregar.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <Link
              href="/gerar"
              className="inline-block bg-[#AAFF00] hover:bg-[#BFFF40] active:scale-[0.98] text-[#07101A] font-bold text-base px-10 py-4 rounded-xl transition-all duration-150 shadow-[0_0_50px_rgba(170,255,0,0.22)]"
            >
              Gerar o Meu Plano Grátis →
            </Link>
            <a
              href="#como-funciona"
              className="inline-block border border-white/15 hover:border-white/30 text-white/55 hover:text-white font-medium text-base px-8 py-4 rounded-xl transition-all duration-150"
            >
              Como funciona
            </a>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
            <div className="text-center">
              <div className="font-condensed text-4xl font-bold text-white leading-none">1–3 min</div>
              <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mt-1.5">Para gerar</div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="font-condensed text-4xl font-bold leading-none" style={{ color: "#AAFF00" }}>€9,99</div>
              <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mt-1.5">Pagamento único</div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="font-condensed text-4xl font-bold text-white leading-none">100%</div>
              <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mt-1.5">Personalizado</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PDF Preview Mockup ── */}
      <section className="px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 justify-center mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.07]" />
            <p className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-medium shrink-0">O que recebes no PDF</p>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.07]" />
          </div>

          <div className="rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)] border border-white/[0.07] select-none">
            {/* Mini-header */}
            <div className="bg-[#040c14] border-b border-[#1E90FF]/20 px-5 py-2.5 flex items-center gap-3">
              <Image src="/logo.png" alt="VelociPlan" width={90} height={27} className="opacity-80" />
              <span className="text-[10px] text-[#475569] font-semibold blur-sm">
                Plano de Treino Personalizado — 8 Semanas
              </span>
            </div>

            {/* Page content */}
            <div className="bg-[#07101A] px-5 py-4 space-y-3.5">
              {/* Plan cover block */}
              <div className="bg-[#040c14] border border-[#1E90FF]/20 rounded-lg p-3.5">
                <div className="inline-block bg-[#1E90FF]/12 border border-[#1E90FF]/35 text-[#60a5fa] text-[8px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest mb-2">
                  Plano Personalizado por IA
                </div>
                <div className="text-white font-black text-sm leading-snug mb-2.5 blur-sm">
                  Plano de Treino Fitness e Saúde Geral — 8 Semanas
                </div>
                <div className="flex gap-5">
                  <div className="flex items-center gap-1.5 text-[#94a3b8] text-[10px] blur-sm">
                    <div className="w-1.5 h-1.5 bg-[#1E90FF] rounded-full shrink-0" />
                    8 semanas
                  </div>
                  <div className="flex items-center gap-1.5 text-[#94a3b8] text-[10px] blur-sm">
                    <div className="w-1.5 h-1.5 bg-[#1E90FF] rounded-full shrink-0" />
                    24 sessões de treino
                  </div>
                </div>
              </div>

              {/* O Teu Perfil */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-0.5 h-3 bg-[#1E90FF] rounded-full" />
                  <span className="text-[#1E90FF] text-[8px] font-black uppercase tracking-widest">O Teu Perfil</span>
                </div>
                <div className="bg-[#1E90FF]/07 border border-[#1E90FF]/20 rounded-lg px-3 py-2.5">
                  <div className="h-2 bg-[#1E90FF]/20 rounded-full w-full blur-sm" />
                </div>
              </div>

              {/* Visão Geral */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-0.5 h-3 bg-[#1E90FF] rounded-full" />
                  <span className="text-[#1E90FF] text-[8px] font-black uppercase tracking-widest">Visão Geral do Plano</span>
                </div>
                <div className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 space-y-1.5">
                  <div className="h-2 bg-white/15 rounded-full w-full blur-sm" />
                  <div className="h-2 bg-white/15 rounded-full w-4/5 blur-sm" />
                </div>
              </div>

              {/* Programa Semanal */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-0.5 h-3 bg-[#1E90FF] rounded-full" />
                  <span className="text-[#1E90FF] text-[8px] font-black uppercase tracking-widest">Programa Semanal</span>
                </div>
                <div className="rounded-lg overflow-hidden border border-white/[0.08]">
                  <div className="bg-[#1E90FF]/15 border-b border-[#1E90FF]/25 px-3 py-2 flex items-center justify-between">
                    <span className="text-white text-xs font-black">Semana 1</span>
                    <span className="text-[#60a5fa] text-[8px] font-bold uppercase tracking-wide blur-sm">Adaptação e Base Aeróbica</span>
                  </div>
                  <div className="divide-y divide-white/[0.05]">
                    <div className="px-3 py-2 flex items-start gap-2.5">
                      <span className="text-[8px] font-black text-[#64748b] uppercase tracking-wide w-20 shrink-0 pt-0.5">Segunda-feira</span>
                      <div className="flex-1 space-y-1">
                        <div className="inline-block bg-[#1E90FF]/15 border border-[#1E90FF]/30 text-[#60a5fa] text-[7px] font-bold px-2 py-0.5 rounded-full blur-sm">Endurance</div>
                        <div className="h-1.5 bg-white/10 rounded-full w-36 blur-sm" />
                        <div className="h-1.5 bg-white/15 rounded-full w-full blur-sm" />
                      </div>
                    </div>
                    <div className="px-3 py-1.5 flex items-center gap-2.5 bg-black/15">
                      <span className="text-[8px] font-black text-[#64748b] uppercase tracking-wide w-20 shrink-0">Terça-feira</span>
                      <span className="text-[#334155] text-[10px] italic">Descanso</span>
                    </div>
                    <div className="px-3 py-2 flex items-start gap-2.5">
                      <span className="text-[8px] font-black text-[#64748b] uppercase tracking-wide w-20 shrink-0 pt-0.5">Quarta-feira</span>
                      <div className="flex-1 space-y-1">
                        <div className="inline-block bg-[#1E90FF]/15 border border-[#1E90FF]/30 text-[#60a5fa] text-[7px] font-bold px-2 py-0.5 rounded-full blur-sm">Força e Cadência</div>
                        <div className="h-1.5 bg-white/10 rounded-full w-36 blur-sm" />
                        <div className="h-1.5 bg-white/15 rounded-full w-5/6 blur-sm" />
                      </div>
                    </div>
                    <div className="px-3 py-1.5 flex items-center gap-2.5 bg-black/15">
                      <span className="text-[8px] font-black text-[#64748b] uppercase tracking-wide w-20 shrink-0">Quinta-feira</span>
                      <span className="text-[#334155] text-[10px] italic">Descanso</span>
                    </div>
                    <div className="px-3 py-2 flex items-start gap-2.5">
                      <span className="text-[8px] font-black text-[#64748b] uppercase tracking-wide w-20 shrink-0 pt-0.5">Sexta-feira</span>
                      <div className="flex-1 space-y-1">
                        <div className="inline-block bg-[#1E90FF]/15 border border-[#1E90FF]/30 text-[#60a5fa] text-[7px] font-bold px-2 py-0.5 rounded-full blur-sm">Endurance</div>
                        <div className="h-1.5 bg-white/10 rounded-full w-36 blur-sm" />
                        <div className="h-1.5 bg-white/15 rounded-full w-full blur-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] text-white/20 mt-4">
            Exemplo do formato do PDF — o teu plano terá o teu conteúdo personalizado
          </p>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="como-funciona" className="px-6 py-20 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#AAFF00] text-[10px] font-bold uppercase tracking-[0.2em] mb-3">O processo</p>
            <h2 className="font-condensed text-5xl md:text-6xl font-bold uppercase tracking-tight mb-3">Como funciona</h2>
            <p className="text-white/35 text-base">De zero ao teu plano personalizado em menos de 5 minutos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/[0.05] rounded-2xl overflow-hidden border border-white/[0.05]">
            {steps.map((step, i) => (
              <div
                key={step.numero}
                className="relative bg-[#07101A] p-7 hover:bg-[#0b1820] transition-colors duration-200 group"
              >
                <div className="font-condensed text-[5.5rem] font-bold leading-none text-white/[0.035] group-hover:text-white/[0.065] transition-colors absolute top-3 right-4 select-none pointer-events-none">
                  {step.numero}
                </div>
                <div className="relative">
                  <div className="w-8 h-8 rounded-full border border-[#AAFF00]/35 flex items-center justify-center mb-5">
                    <span className="font-condensed text-[#AAFF00] text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-white font-semibold text-sm mb-2 leading-snug">{step.titulo}</p>
                  <p className="text-white/35 text-sm leading-relaxed">{step.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#1E90FF] text-[10px] font-bold uppercase tracking-[0.2em] mb-3">As vantagens</p>
            <h2 className="font-condensed text-5xl md:text-6xl font-bold uppercase tracking-tight mb-3">Porquê o VelociPlan?</h2>
            <p className="text-white/35 text-base">Um treinador pessoal custa centenas de euros por mês. O VelociPlan custa €9,99.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-7 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-[#1E90FF]/30 hover:bg-[#1E90FF]/[0.04] transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="font-condensed text-5xl font-bold leading-none text-white/[0.06] group-hover:text-[#1E90FF]/25 transition-colors shrink-0 mt-1 select-none">
                    {f.num}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-2">{f.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">{f.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 py-20 border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#AAFF00] text-[10px] font-bold uppercase tracking-[0.2em] mb-3">FAQ</p>
            <h2 className="font-condensed text-5xl md:text-6xl font-bold uppercase tracking-tight mb-3">Perguntas frequentes</h2>
            <p className="text-white/35 text-base">Temos resposta para as tuas dúvidas.</p>
          </div>

          <div className="space-y-2">
            {faqs.map((faq) => (
              <details
                key={faq.pergunta}
                className="group rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.12] transition-colors"
              >
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none gap-4">
                  <span className="text-white font-medium text-sm">{faq.pergunta}</span>
                  <span className="text-white/30 group-open:text-[#AAFF00] transition-colors shrink-0 text-xl leading-none font-light">
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">−</span>
                  </span>
                </summary>
                <div className="px-6 pb-5">
                  <div className="h-px bg-white/[0.06] mb-4" />
                  <p className="text-white/40 text-sm leading-relaxed">{faq.resposta}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Bottom ── */}
      <section className="px-6 py-28 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(30,144,255,0.07) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-55deg, transparent, transparent 80px, rgba(255,255,255,0.008) 80px, rgba(255,255,255,0.008) 81px)",
          }}
        />
        <div className="max-w-3xl mx-auto text-center relative">
          <p className="text-[#AAFF00] text-[10px] font-bold uppercase tracking-[0.2em] mb-5">Começa hoje</p>
          <h2 className="font-condensed text-[clamp(3rem,8vw,6.5rem)] font-bold uppercase leading-[0.92] tracking-tight mb-7">
            Pronto para treinar<br />
            com{" "}
            <span style={{ color: "#1E90FF" }}>inteligência</span>?
          </h2>
          <p className="text-white/35 mb-2 text-lg">
            Preenche o formulário em 5 minutos e vê o teu plano grátis.
          </p>
          <p className="text-white/20 text-sm mb-10">
            Só pagas €9,99 se quiseres descarregar o PDF completo.
          </p>
          <Link
            href="/gerar"
            className="inline-block bg-[#AAFF00] hover:bg-[#BFFF40] active:scale-[0.98] text-[#07101A] font-bold text-lg px-12 py-5 rounded-xl transition-all duration-150 shadow-[0_0_60px_rgba(170,255,0,0.18)]"
          >
            Começar Agora — É Grátis →
          </Link>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs text-white/20">
            <span>✓ Sem registo</span>
            <span>✓ Sem subscrições</span>
            <span>✓ Pagamento seguro via Stripe</span>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.05] px-6 py-8 text-center text-white/20 text-xs">
        <p>© {new Date().getFullYear()} VelociPlan · Feito para ciclistas portugueses · Powered by Claude AI</p>
      </footer>
    </main>
  );
}
