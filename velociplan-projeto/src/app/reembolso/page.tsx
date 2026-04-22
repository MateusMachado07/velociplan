import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Política de Reembolso — VelociPlan",
  description: "Condições de reembolso e direito de arrependimento no VelociPlan.",
};

export default function ReembolsoPage() {
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
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Política de Reembolso</h1>
        <p className="text-gray-500 text-sm mb-10">Última atualização: abril de 2026</p>

        <Section title="1. Pré-visualização gratuita">
          <p>O VelociPlan permite que vejas o teu plano de treino completo antes de efetuares qualquer pagamento. Esta funcionalidade existe precisamente para garantires que estás satisfeito com o resultado antes de decidires comprar.</p>
          <p>Só pagas para descarregar o PDF — nunca às cegas.</p>
        </Section>

        <Section title="2. Direito de arrependimento (UE)">
          <p>De acordo com a Diretiva 2011/83/UE e o Decreto-Lei n.º 24/2014, os consumidores na União Europeia têm, em regra, 14 dias para exercer o direito de arrependimento em compras online.</p>
          <p>No entanto, para <strong className="text-white">conteúdo digital fornecido imediatamente</strong> (como é o caso de um PDF descarregado após pagamento), este direito pode ser excluído quando o consumidor consente expressamente no início da execução e reconhece a perda do direito de arrependimento — conforme previsto no art. 17.º, n.º 2, al. m) do referido diploma.</p>
          <p>Ao completares o pagamento e iniciares o descarregamento do PDF, confirmas este consentimento.</p>
        </Section>

        <Section title="3. Quando reembolsamos">
          <p>Apesar do acima exposto, o VelociPlan compromete-se a emitir reembolso integral nas seguintes situações:</p>
          <ul>
            <li>O PDF não foi entregue após confirmação de pagamento por motivo técnico imputável ao VelociPlan.</li>
            <li>O ficheiro entregue estava corrompido ou inacessível.</li>
            <li>Duplicação de cobrança por erro técnico.</li>
          </ul>
        </Section>

        <Section title="4. Como solicitar reembolso">
          <p>Envia um email para <a href="mailto:suporte@velociplan.pt" className="text-brand-blue hover:underline">suporte@velociplan.pt</a> com:</p>
          <ul>
            <li>O email utilizado no pagamento</li>
            <li>A data da compra</li>
            <li>Descrição do problema</li>
          </ul>
          <p>Respondemos em até 48 horas úteis. Se o pedido for válido, o reembolso é processado em 5 a 10 dias úteis para o método de pagamento original.</p>
        </Section>

        <Section title="5. Contacto">
          <p>Para qualquer questão sobre reembolsos: <a href="mailto:suporte@velociplan.pt" className="text-brand-blue hover:underline">suporte@velociplan.pt</a>.</p>
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
