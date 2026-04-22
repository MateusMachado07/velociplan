import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Termos e Condições — VelociPlan",
  description: "Termos e condições de utilização do serviço VelociPlan.",
};

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-brand-navy">
      <nav className="border-b border-white/10 px-4 py-2">
        <div className="max-w-3xl mx-auto">
          <Link href="/">
            <Image src="/logo.png" alt="VelociPlan" width={130} height={39} className="w-24 sm:w-32 h-auto" />
          </Link>
        </div>
      </nav>

      <article className="px-4 sm:px-6 py-10 sm:py-16 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Termos e Condições</h1>
        <p className="text-gray-500 text-sm mb-10">Última atualização: abril de 2026</p>

        <Section title="1. O serviço">
          <p>O VelociPlan é um serviço online que gera planos de treino de ciclismo personalizados com recurso a inteligência artificial. O utilizador preenche um formulário com o seu perfil e objetivos, obtém uma pré-visualização gratuita e pode adquirir o PDF completo por pagamento único.</p>
        </Section>

        <Section title="2. Aceitação dos termos">
          <p>Ao utilizares o VelociPlan, aceitas estes Termos e Condições na íntegra. Se não concordares com alguma parte, deves abster-te de utilizar o serviço.</p>
        </Section>

        <Section title="3. Pré-visualização gratuita">
          <p>A pré-visualização do plano gerado é disponibilizada gratuitamente, sem necessidade de registo ou pagamento. Só é necessário pagar para descarregar o PDF completo.</p>
        </Section>

        <Section title="4. Pagamento e entrega">
          <p>O preço do PDF completo é de <strong className="text-white">€9,99</strong> (IVA incluído quando aplicável), pagamento único e sem subscrições. O pagamento é processado pela Stripe, Inc. Após confirmação do pagamento, o PDF é disponibilizado para descarregamento imediato.</p>
        </Section>

        <Section title="5. Natureza do conteúdo">
          <p>O plano de treino gerado tem carácter informativo e de apoio ao treino desportivo. Não constitui aconselhamento médico. Consulta um profissional de saúde antes de iniciar qualquer programa de exercício, especialmente se tiveres condições de saúde pré-existentes.</p>
          <p>Os planos são gerados por inteligência artificial com base nos dados fornecidos. O VelociPlan não garante resultados específicos de performance.</p>
        </Section>

        <Section title="6. Propriedade intelectual">
          <p>O PDF gerado é para uso pessoal do comprador. É proibida a revenda, redistribuição ou publicação do conteúdo sem autorização expressa do VelociPlan.</p>
        </Section>

        <Section title="7. Limitação de responsabilidade">
          <p>O VelociPlan não se responsabiliza por lesões, danos físicos ou outros prejuízos resultantes da execução dos treinos. A responsabilidade máxima do VelociPlan limita-se ao valor pago pelo serviço.</p>
        </Section>

        <Section title="8. Disponibilidade do serviço">
          <p>O VelociPlan esforça-se por manter o serviço disponível, mas não garante disponibilidade ininterrupta. Em caso de falha técnica que impeça a entrega do PDF após pagamento, o utilizador será reembolsado na totalidade.</p>
        </Section>

        <Section title="9. Lei aplicável">
          <p>Estes termos são regidos pela lei portuguesa. Qualquer litígio será submetido aos tribunais competentes da República Portuguesa.</p>
        </Section>

        <Section title="10. Contacto">
          <p>Para questões relacionadas com estes termos, contacta <a href="mailto:suporte@velociplan.pt" className="text-brand-blue hover:underline">suporte@velociplan.pt</a>.</p>
        </Section>
      </article>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-xs text-gray-600">
        <Link href="/" className="hover:text-gray-400 transition-colors">← Voltar ao VelociPlan</Link>
      </footer>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
      <div className="text-gray-400 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
