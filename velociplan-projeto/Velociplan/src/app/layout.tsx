import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VelociPlan — Plano de Treino de Ciclismo Personalizado",
  description:
    "Gera o teu plano de treino de ciclismo personalizado com Inteligência Artificial. Descarrega em PDF. Feito para ciclistas portugueses.",
  keywords: ["ciclismo", "plano de treino", "bicicleta", "treino personalizado"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
