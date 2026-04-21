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
    icon: "🤖",
    title: "IA que te conhece",
    description:
      "O teu plano é criado com base no teu perfil único — nível, objetivos, horário disponível e equipamento. Nenhum plano é igual a outro.",
  },
  {
    icon: "📄",
    title: "PDF pronto a usar",
    description:
      "Um documento profissional com o teu plano semana a semana, aquecimentos, intensidades e orientações de nutrição. Imprime ou guarda no telemóvel.",
  },
  {
    icon: "🎯",
    title: "100% personalizado",
    description:
      "Não é um plano genérico copiado da internet. É construído especificamente para ti — com as tuas disponibilidades, limitações físicas e objetivos.",
  },
  {
    icon: "💶",
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

// ── JSON-LD structured data ───────────────────────────────────────────────────
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
    <main className="min-h-screen bg-brand-navy">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      {/* ── Navigation ── */}
      <nav className="border-b border-white/10 px-6 py-4 sticky top-0 bg-brand-navy/95 backdrop-blur-sm z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Image src="/logo.png" alt="VelociPlan" width={200} height={60} />
          <div className="flex items-center gap-3">
            <a
              href="#como-funciona"
              className="hidden sm:block text-sm text-gray-400 hover:text-white transition-colors"
            >
              Como funciona
            </a>
            <Link
              href="/gerar"
              className="bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold text-sm px-5 py-2 rounded-lg transition-colors"
            >
              Gerar Plano Grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Pain point opener */}
          <p className="text-brand-blue font-semibold text-sm uppercase tracking-widest mb-5">
            Cansado de treinar sem estrutura e não evoluir?
          </p>

          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            O teu plano de ciclismo{" "}
            <span className="gradient-text">personalizado por IA</span>,
            {" "}pronto em segundos
          </h1>

          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Preenches um formulário de 5 minutos. A IA analisa o teu perfil e
            cria um plano completo — semana a semana, com intensidades,
            aquecimentos e nutrição. Vês grátis. Pagas só para descarregar o PDF.
          </p>

          <Link
            href="/gerar"
            className="inline-block bg-brand-blue hover:bg-brand-blue-dark text-white font-bold text-lg px-10 py-4 rounded-xl transition-colors shadow-lg shadow-brand-blue/30"
          >
            Gerar o Meu Plano Grátis →
          </Link>

          <p className="text-sm text-gray-500 mt-4">
            Pré-visualização grátis · Só pagas para descarregar · Sem subscrições
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Plano em 1 a 2 minutos
            </span>
            <span className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Vês grátis antes de pagar
            </span>
            <span className="flex items-center gap-2">
              <span className="text-green-400">✓</span> PDF completo por €9,99
            </span>
          </div>
        </div>
      </section>

      {/* ── PDF Preview Mockup — mirrors real PDF cover, blurred content ── */}
      <section className="px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-sm text-gray-500 mb-6 uppercase tracking-widest">O que recebes no PDF</p>

          <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 select-none">

            {/* ── Mini-header (identical to real PDF) ── */}
            <div className="bg-[#0a1520] border-b border-[#1E90FF]/25 px-5 py-2.5 flex items-center gap-3">
              <Image src="/logo.png" alt="VelociPlan" width={90} height={27} className="opacity-90" />
              <span className="text-[10px] text-[#475569] font-semibold blur-sm">
                Plano de Treino Personalizado — 8 Semanas
              </span>
            </div>

            {/* ── Page content ── */}
            <div className="bg-[#0D1B2A] px-5 py-4 space-y-3.5">

              {/* Plan cover block */}
              <div className="bg-[#0a1520] border border-[#1E90FF]/20 rounded-lg p-3.5">
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

                {/* Week 1 block */}
                <div className="rounded-lg overflow-hidden border border-white/[0.08]">
                  <div className="bg-[#1E90FF]/15 border-b border-[#1E90FF]/25 px-3 py-2 flex items-center justify-between">
                    <span className="text-white text-xs font-black">Semana 1</span>
                    <span className="text-[#60a5fa] text-[8px] font-bold uppercase tracking-wide blur-sm">Adaptação e Base Aeróbica</span>
                  </div>
                  <div className="divide-y divide-white/[0.05]">
                    {/* Training day */}
                    <div className="px-3 py-2 flex items-start gap-2.5">
                      <span className="text-[8px] font-black text-[#64748b] uppercase tracking-wide w-20 shrink-0 pt-0.5">Segunda-feira</span>
                      <div className="flex-1 space-y-1">
                        <div className="inline-block bg-[#1E90FF]/15 border border-[#1E90FF]/30 text-[#60a5fa] text-[7px] font-bold px-2 py-0.5 rounded-full blur-sm">Endurance</div>
                        <div className="h-1.5 bg-white/10 rounded-full w-36 blur-sm" />
                        <div className="h-1.5 bg-white/15 rounded-full w-full blur-sm" />
                      </div>
                    </div>
                    {/* Rest day */}
                    <div className="px-3 py-1.5 flex items-center gap-2.5 bg-black/15">
                      <span className="text-[8px] font-black text-[#64748b] uppercase tracking-wide w-20 shrink-0">Terça-feira</span>
                      <span className="text-[#334155] text-[10px] italic">Descanso</span>
                    </div>
                    {/* Training day */}
                    <div className="px-3 py-2 flex items-start gap-2.5">
                      <span className="text-[8px] font-black text-[#64748b] uppercase tracking-wide w-20 shrink-0 pt-0.5">Quarta-feira</span>
                      <div className="flex-1 space-y-1">
                        <div className="inline-block bg-[#1E90FF]/15 border border-[#1E90FF]/30 text-[#60a5fa] text-[7px] font-bold px-2 py-0.5 rounded-full blur-sm">Força e Cadência</div>
                        <div className="h-1.5 bg-white/10 rounded-full w-36 blur-sm" />
                        <div className="h-1.5 bg-white/15 rounded-full w-5/6 blur-sm" />
                      </div>
                    </div>
                    {/* Rest day */}
                    <div className="px-3 py-1.5 flex items-center gap-2.5 bg-black/15">
                      <span className="text-[8px] font-black text-[#64748b] uppercase tracking-wide w-20 shrink-0">Quinta-feira</span>
                      <span className="text-[#334155] text-[10px] italic">Descanso</span>
                    </div>
                    {/* Training day */}
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

          <p className="text-center text-xs text-gray-600 mt-3">
            Exemplo do formato do PDF — o teu plano terá o teu conteúdo personalizado
          </p>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="como-funciona" className="px-6 py-16 bg-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Como funciona</h2>
          <p className="text-center text-gray-400 mb-12">De zero ao teu plano personalizado em menos de 5 minutos.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step) => (
              <div
                key={step.numero}
                className="flex items-start gap-4 p-6 rounded-xl bg-white/5 border border-white/10"
              >
                <span className="text-4xl font-extrabold text-brand-blue/40 leading-none shrink-0">
                  {step.numero}
                </span>
                <div>
                  <p className="text-white font-semibold mb-1">{step.titulo}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Porquê o VelociPlan?</h2>
          <p className="text-center text-gray-400 mb-12">Um treinador pessoal custa centenas de euros por mês. O VelociPlan custa €9,99.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-brand-blue/50 transition-colors"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Perguntas frequentes</h2>
          <p className="text-center text-gray-400 mb-12">Temos resposta para as tuas dúvidas.</p>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.pergunta}
                className="p-6 rounded-xl bg-white/5 border border-white/10"
              >
                <p className="text-white font-semibold mb-2">{faq.pergunta}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.resposta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Bottom ── */}
      <section className="px-6 py-20 text-center bg-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">
            Pronto para treinar com{" "}
            <span className="gradient-text">inteligência</span>?
          </h2>
          <p className="text-gray-400 mb-3 text-lg">
            Preenche o formulário em 5 minutos e vê o teu plano grátis.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Só pagas €9,99 se quiseres descarregar o PDF completo.
          </p>
          <Link
            href="/gerar"
            className="inline-block bg-brand-blue hover:bg-brand-blue-dark text-white font-bold text-lg px-10 py-4 rounded-xl transition-colors shadow-lg shadow-brand-blue/30"
          >
            Começar Agora — É Grátis →
          </Link>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs text-gray-600">
            <span>✓ Sem registo</span>
            <span>✓ Sem subscrições</span>
            <span>✓ Pagamento seguro via Stripe</span>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} VelociPlan · Feito para ciclistas portugueses · Powered by Claude AI</p>
      </footer>

    </main>
  );
}
