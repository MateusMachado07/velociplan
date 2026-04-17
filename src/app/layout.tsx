import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "VelociPlan — Plano de Treino de Ciclismo Personalizado por IA",
    template: "%s | VelociPlan",
  },
  description:
    "Cria o teu plano de treino de ciclismo personalizado com Inteligência Artificial em menos de 40 segundos. Semana a semana, com intensidades, aquecimentos e nutrição. PDF completo por €9,99.",
  keywords: [
    "plano de treino ciclismo",
    "treino ciclismo personalizado",
    "plano ciclista portugal",
    "bicicleta treino IA",
    "plano ciclismo pdf",
    "treino bicicleta estrada",
    "treino mountain bike",
    "periodização ciclismo",
    "cycling training plan",
  ],
  authors: [{ name: "VelociPlan" }],
  creator: "VelociPlan",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    siteName: "VelociPlan",
    title: "VelociPlan — Plano de Treino de Ciclismo Personalizado por IA",
    description:
      "Cria o teu plano de treino de ciclismo personalizado com IA em 40 segundos. Periodização profissional, nutrição e PDF completo por €9,99.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VelociPlan — Plano de Treino de Ciclismo por IA",
    description:
      "Plano de ciclismo personalizado por IA em segundos. PDF completo por €9,99.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-18055852636" strategy="afterInteractive" />
        <Script id="google-ads" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-18055852636');
        `}</Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
