import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Política de Privacidade — VelociPlan",
  description: "Como o VelociPlan recolhe, trata e protege os teus dados pessoais, em conformidade com o RGPD.",
};

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-brand-navy">
      <nav className="border-b border-white/10 px-4 py-2">
        <div className="max-w-3xl mx-auto">
          <Link href="/">
            <Image src="/logo.png" alt="VelociPlan" width={130} height={39} className="w-24 sm:w-32 h-auto" />
          </Link>
        </div>
      </nav>

      <article className="px-4 sm:px-6 py-10 sm:py-16 max-w-2xl mx-auto prose prose-invert prose-sm">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Política de Privacidade</h1>
        <p className="text-gray-500 text-sm mb-10">Última atualização: abril de 2026</p>

        <Section title="1. Responsável pelo tratamento">
          <p>O responsável pelo tratamento dos teus dados pessoais é o <strong className="text-white">VelociPlan</strong> (NIF: 516 341 529), Portugal. Contacto: <a href="mailto:suporte@velociplan.pt" className="text-brand-blue hover:underline">suporte@velociplan.pt</a>.</p>
        </Section>

        <Section title="2. Dados recolhidos e finalidade">
          <p>Recolhemos apenas os dados estritamente necessários para prestar o serviço:</p>
          <ul>
            <li><strong className="text-white">Dados do formulário</strong> — nível de ciclismo, objetivos, disponibilidade semanal, equipamento e informações físicas relevantes (ex.: FTP, peso). Finalidade: gerar o teu plano de treino personalizado.</li>
            <li><strong className="text-white">Dados de pagamento</strong> — processados integralmente pela Stripe, Inc. O VelociPlan não armazena números de cartão nem dados bancários.</li>
            <li><strong className="text-white">Dados técnicos</strong> — endereço IP e agente de utilizador, recolhidos automaticamente pelo servidor para segurança e diagnóstico.</li>
          </ul>
        </Section>

        <Section title="3. Base legal">
          <p>O tratamento baseia-se na execução do contrato (art. 6.º, n.º 1, al. b) do RGPD): os dados são necessários para gerar e entregar o plano que solicitaste.</p>
        </Section>

        <Section title="4. Partilha com terceiros">
          <p>Os teus dados podem ser partilhados com os seguintes subcontratantes, exclusivamente para prestar o serviço:</p>
          <ul>
            <li><strong className="text-white">Anthropic, PBC</strong> — fornecedor da inteligência artificial que gera o plano. Os dados do formulário são enviados à API da Anthropic para processamento.</li>
            <li><strong className="text-white">Stripe, Inc.</strong> — processamento de pagamentos. A Stripe possui a sua própria política de privacidade.</li>
            <li><strong className="text-white">Vercel, Inc.</strong> — alojamento da aplicação.</li>
          </ul>
          <p>Não vendemos nem cedemos os teus dados a terceiros para fins de marketing.</p>
        </Section>

        <Section title="5. Conservação dos dados">
          <p>Os dados do formulário são armazenados temporariamente em sessão (sessionStorage do browser) e não são persistidos nos nossos servidores após a geração do plano. Os dados de pagamento são conservados pela Stripe conforme a sua política. Registos técnicos são eliminados após 30 dias.</p>
        </Section>

        <Section title="6. Os teus direitos (RGPD)">
          <p>Tens direito a, a qualquer momento:</p>
          <ul>
            <li>Aceder aos teus dados pessoais</li>
            <li>Solicitar a retificação de dados inexatos</li>
            <li>Solicitar o apagamento dos dados ("direito a ser esquecido")</li>
            <li>Opor-te ao tratamento ou solicitar a sua limitação</li>
            <li>Portabilidade dos dados</li>
            <li>Apresentar reclamação à <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">CNPD</a> (Comissão Nacional de Proteção de Dados)</li>
          </ul>
          <p>Para exercer estes direitos, contacta-nos em <a href="mailto:suporte@velociplan.pt" className="text-brand-blue hover:underline">suporte@velociplan.pt</a>.</p>
        </Section>

        <Section title="7. Cookies">
          <p>O VelociPlan utiliza apenas cookies essenciais ao funcionamento do serviço (ex.: sessão de checkout). Não utilizamos cookies de rastreamento ou publicidade.</p>
        </Section>

        <Section title="8. Alterações a esta política">
          <p>Podemos atualizar esta política ocasionalmente. A versão mais recente estará sempre disponível nesta página.</p>
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
