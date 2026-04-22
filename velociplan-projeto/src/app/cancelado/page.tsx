// /cancelado — shown if the user cancels the Stripe Checkout
// Stripe redirects here when the user clicks "Back" on the payment page.
// The cancel_url in our checkout session points to /plano,
// but this page exists as a fallback if needed.

import Link from "next/link";
import Image from "next/image";

export default function CanceladoPage() {
  return (
    <div className="min-h-screen bg-brand-navy flex flex-col">
      <nav className="border-b border-white/10 px-4 py-2">
        <div className="max-w-3xl mx-auto">
          <Image src="/logo.png" alt="VelociPlan" width={130} height={39} className="w-24 sm:w-32 h-auto" />
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6">
        <div className="text-center max-w-md w-full">
          <div className="text-4xl sm:text-5xl mb-5 sm:mb-6">↩️</div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Pagamento cancelado
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mb-8 leading-relaxed">
            Não foi feito nenhum pagamento. O teu plano continua disponível para
            pré-visualização — podes pagar quando quiseres.
          </p>
          <Link
            href="/plano"
            className="inline-block bg-brand-blue hover:bg-brand-blue-dark text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Voltar ao Plano
          </Link>
        </div>
      </div>
    </div>
  );
}
