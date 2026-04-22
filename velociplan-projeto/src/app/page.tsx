import Link from "next/link";
import Image from "next/image";
import CountdownTimer from "@/components/CountdownTimer";

// ── SVG Icon components (Heroicons v2 outline) ────────────────────────────────
function IconCpu() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
    </svg>
  );
}

function IconDocument() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  );
}

function IconSliders() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
    </svg>
  );
}

function IconBanknotes() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
    </svg>
  );
}

// ── PDF Mockup ─────────────────────────────────────────────────────────────────
type MockupSessao = {
  dia: string;
  tipo: string | null;
  duracao?: string;
  descricao?: string;
};

type MockupSemana = {
  numero: number;
  titulo: string;
  fase: string;
  sessoes: MockupSessao[];
};

function getBadgeClass(tipo: string): string {
  const map: Record<string, string> = {
    "Recuperação Activa": "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
    "Endurance":          "bg-[#1E90FF]/15 border-[#1E90FF]/30 text-[#60a5fa]",
    "Força e Cadência":   "bg-yellow-500/15 border-yellow-500/30 text-yellow-400",
    "Saída Longa":        "bg-violet-500/15 border-violet-500/30 text-violet-400",
    "Tempo (Limiar)":     "bg-orange-500/15 border-orange-500/30 text-orange-400",
    "Intervalos de Alta Intensidade": "bg-red-500/15 border-red-500/30 text-red-400",
    "Fartlek":            "bg-purple-500/15 border-purple-500/30 text-purple-400",
    "Prova":              "bg-amber-500/15 border-amber-500/30 text-amber-400",
  };
  return map[tipo] ?? "bg-white/10 border-white/20 text-gray-400";
}

const SEMANAS_DATA: MockupSemana[] = [
  {
    numero: 1, titulo: "Semana 1", fase: "Base Aeróbica",
    sessoes: [
      { dia: "Segunda", tipo: "Recuperação Activa", duracao: "40 min", descricao: "Pedalada completamente solta, sem qualquer esforço percetível. Cadência elevada 90-100 rpm, terreno plano." },
      { dia: "Terça", tipo: "Endurance", duracao: "1h 15min", descricao: "Ritmo contínuo e estável em Zona 2 durante toda a sessão. Cadência 85-95 rpm, terreno ondulado moderado." },
      { dia: "Quarta", tipo: "Força e Cadência", duracao: "1h 10min", descricao: "Alterna 3 séries de 8 min a cadência baixa 50-60 rpm (força) com 5 min a cadência alta 100-110 rpm (fluidez neuromuscular). Recuperação entre séries em Zona 1." },
      { dia: "Quinta", tipo: "Endurance", duracao: "1h 20min", descricao: "Pedalada contínua em Zona 2 com foco em manter a cadência de 88-95 rpm durante toda a sessão. Terreno variado." },
      { dia: "Sexta", tipo: "Recuperação Activa", duracao: "35 min", descricao: "Saída completamente leve para soltar as pernas antes da saída longa do sábado. Plano, sem esforços." },
      { dia: "Sábado", tipo: "Saída Longa", duracao: "2h 30min", descricao: "Saída de base aeróbica longa a ritmo controlado. Mantém Zona 2 estrita, sem subidas em Zona 3. Foca na nutrição e hidratação ao longo do percurso." },
      { dia: "Domingo", tipo: null },
    ],
  },
  {
    numero: 2, titulo: "Semana 2", fase: "Base Aeróbica — Aumento de Volume",
    sessoes: [
      { dia: "Segunda", tipo: "Recuperação Activa", duracao: "40 min", descricao: "Recuperação total. Sem esforço. Cadência livre a 90-100 rpm em plano." },
      { dia: "Terça", tipo: "Endurance", duracao: "1h 20min", descricao: "Sessão de endurance contínua. Introduz 2 subidas moderadas sem ultrapassar Zona 2. Cadência 85-95 rpm." },
      { dia: "Quarta", tipo: "Força e Cadência", duracao: "1h 15min", descricao: "4 séries de 8 min a 50-60 rpm (força muscular) + 5 min a 100-110 rpm (velocidade de pedal). Recuperação de 3 min em Zona 1 entre séries." },
      { dia: "Quinta", tipo: "Endurance", duracao: "1h 30min", descricao: "Volume aeróbico contínuo em Zona 2 estrita. Terreno ondulado, cadência constante de 88-95 rpm. Sem picos de FC." },
      { dia: "Sexta", tipo: "Recuperação Activa", duracao: "40 min", descricao: "Prepara as pernas para a saída longa de sábado. Plano, cadência 90-100 rpm, ritmo de passeio." },
      { dia: "Sábado", tipo: "Saída Longa", duracao: "2h 45min", descricao: "Aumenta 15 min face à semana anterior. Mantém Zona 2 estrita. Pratica alimentação a cada 45 min durante a saída." },
      { dia: "Domingo", tipo: null },
    ],
  },
  {
    numero: 3, titulo: "Semana 3", fase: "Base Aeróbica — Consolidação",
    sessoes: [
      { dia: "Segunda", tipo: "Recuperação Activa", duracao: "40 min", descricao: "Pedal solto de recuperação. Sem qualquer esforço. Terreno plano." },
      { dia: "Terça", tipo: "Endurance", duracao: "1h 30min", descricao: "Sessão contínua com ênfase na eficiência técnica de pedalada. Cadência 90-95 rpm, terreno variado." },
      { dia: "Quarta", tipo: "Força e Cadência", duracao: "1h 20min", descricao: "4 séries de 10 min a 50-60 rpm (força) + 5 min a 100-110 rpm (velocidade). Recuperação de 3 min em Zona 1. Progressão face à semana anterior (+2 min por série de força)." },
      { dia: "Quinta", tipo: "Endurance", duracao: "1h 35min", descricao: "Endurance progressivo. Na última meia hora, mantém o limite superior da Zona 2 (130-133 bpm). Cadência 88-95 rpm." },
      { dia: "Sexta", tipo: "Recuperação Activa", duracao: "40 min", descricao: "Pernas leves antes da saída longa. Terreno plano, cadência livre." },
      { dia: "Sábado", tipo: "Saída Longa", duracao: "3h", descricao: "Mais 15 min que a semana anterior. Percurso com algum relevo. Mantém FC estritamente em Zona 2 nas subidas. Hidrata e come regularmente." },
      { dia: "Domingo", tipo: null },
    ],
  },
  {
    numero: 4, titulo: "Semana 4", fase: "Recuperação Activa",
    sessoes: [
      { dia: "Segunda", tipo: "Recuperação Activa", duracao: "35 min", descricao: "Pedal completamente solto. Semana de recuperação — volume e intensidade reduzidos 25%. Deixa o corpo assimilar as 3 semanas anteriores." },
      { dia: "Terça", tipo: "Endurance", duracao: "1h", descricao: "Volume reduzido. Sessão suave em Zona 2 baixa (111-122 bpm). Sem pressão. Cadência confortável de 88-95 rpm." },
      { dia: "Quarta", tipo: "Recuperação Activa", duracao: "40 min", descricao: "Sessão de mobilização ativa. Pedalada solta com foco no movimento circular completo. Sem pressão nos pedais." },
      { dia: "Quinta", tipo: "Endurance", duracao: "1h 10min", descricao: "Endurance leve com foco na técnica de pedalada. Cadência 90-100 rpm, sem subidas exigentes." },
      { dia: "Sexta", tipo: "Recuperação Activa", duracao: "35 min", descricao: "Saída curta de ativação. Prepara as pernas para a saída longa reduzida de sábado." },
      { dia: "Sábado", tipo: "Saída Longa", duracao: "2h 15min", descricao: "Saída longa reduzida em 25% face à semana 3. Terreno plano a moderado. Zona 2 baixa (111-122 bpm). Desfruta do esforço sem pressão." },
      { dia: "Domingo", tipo: null },
    ],
  },
  {
    numero: 5, titulo: "Semana 5", fase: "Introdução à Intensidade — Limiar",
    sessoes: [
      { dia: "Segunda", tipo: "Recuperação Activa", duracao: "40 min", descricao: "Recuperação ativa. Pedalada solta após semana de recuperação, prepara a primeira semana com intensidade." },
      { dia: "Terça", tipo: "Tempo (Limiar)", duracao: "1h 15min", descricao: "Aquecimento + 2 blocos de 12 min em Zona 4 (163-168 bpm) com recuperação de 5 min em Zona 2 entre blocos + arrefecimento. Cadência 85-92 rpm." },
      { dia: "Quarta", tipo: "Endurance", duracao: "1h 20min", descricao: "Sessão de recuperação aeróbica após o esforço de limiar de terça. Zona 2 estrita, sem ultrapassar 133 bpm. Cadência 88-95 rpm." },
      { dia: "Quinta", tipo: "Intervalos de Alta Intensidade", duracao: "55 min", descricao: "5 intervalos de 3 min em Zona 5 (175-185 bpm) com recuperação de 3 min em Zona 1-2 entre cada intervalo. Volume total de esforço intenso: 15 min." },
      { dia: "Sexta", tipo: "Recuperação Activa", duracao: "40 min", descricao: "Recuperação obrigatória após dois dias intensos. Terreno plano, cadência alta e leve." },
      { dia: "Sábado", tipo: "Saída Longa", duracao: "3h", descricao: "Retoma do volume longo com 3h. Zona 2 estrita. Percurso ondulado. Pratica estratégia de nutrição de corrida (come a cada 45 min)." },
      { dia: "Domingo", tipo: null },
    ],
  },
  {
    numero: 6, titulo: "Semana 6", fase: "Desenvolvimento de Intensidade",
    sessoes: [
      { dia: "Segunda", tipo: "Recuperação Activa", duracao: "40 min", descricao: "Recuperação ativa após a saída longa de sábado. Pedal completamente solto em terreno plano." },
      { dia: "Terça", tipo: "Tempo (Limiar)", duracao: "1h 20min", descricao: "2 blocos de 15 min em Zona 4 (163-172 bpm) com recuperação de 5 min em Zona 2 entre blocos. Cadência 85-92 rpm. Progressão de 3 min face à semana anterior." },
      { dia: "Quarta", tipo: "Endurance", duracao: "1h 25min", descricao: "Endurance aeróbico de recuperação ativa. Mantém Zona 2 sem ultrapassar 133 bpm. Foco na pedalada eficiente, 90-95 rpm." },
      { dia: "Quinta", tipo: "Intervalos de Alta Intensidade", duracao: "55 min", descricao: "6 intervalos de 3 min em Zona 5 (175-185 bpm) com recuperação de 3 min em Zona 1-2. Volume total de esforço intenso: 18 min." },
      { dia: "Sexta", tipo: "Fartlek", duracao: "1h 20min", descricao: "Fartlek livre: 45 min em Zona 2 com 6-8 acelerações espontâneas de 1-2 min para Zona 3 (148-153 bpm) ao longo do percurso, conforme o terreno." },
      { dia: "Sábado", tipo: "Saída Longa", duracao: "3h 15min", descricao: "Mais 15 min que a semana anterior. Terreno com relevo moderado. Nos últimos 30 min, mantém o limite superior da Zona 2 (130-133 bpm)." },
      { dia: "Domingo", tipo: null },
    ],
  },
  {
    numero: 7, titulo: "Semana 7", fase: "Desenvolvimento de Intensidade — Pico de Bloco",
    sessoes: [
      { dia: "Segunda", tipo: "Recuperação Activa", duracao: "40 min", descricao: "Recuperação total após semana de carga elevada. Pedal completamente solto, terreno plano." },
      { dia: "Terça", tipo: "Tempo (Limiar)", duracao: "1h 25min", descricao: "3 blocos de 12 min em Zona 4 (163-172 bpm) com recuperação de 5 min em Zona 2. Cadência 88-92 rpm. Volume total de limiar: 36 min." },
      { dia: "Quarta", tipo: "Endurance", duracao: "1h 30min", descricao: "Sessão aeróbica de recuperação ativa entre os dois dias intensos. Zona 2 estrita. Cadência 88-95 rpm." },
      { dia: "Quinta", tipo: "Intervalos de Alta Intensidade", duracao: "58 min", descricao: "6 intervalos de 3 min 30 seg em Zona 5 (175-185 bpm) com recuperação de 3 min em Zona 1-2. Volume total de esforço intenso: 21 min." },
      { dia: "Sexta", tipo: "Fartlek", duracao: "1h 25min", descricao: "Fartlek estruturado: 50 min em Zona 2 com 8 acelerações de 1 min 30 seg para Zona 3 (148-153 bpm) a cada 5-6 min. Recuperação em Zona 2 entre acelerações." },
      { dia: "Sábado", tipo: "Saída Longa", duracao: "3h 30min", descricao: "Mais 15 min que a semana anterior. Percurso exigente com relevo real. Nos últimos 40 min, insere 3 esforços de 5 min em Zona 3 (148-153 bpm) nas subidas." },
      { dia: "Domingo", tipo: null },
    ],
  },
  {
    numero: 8, titulo: "Semana 8", fase: "Recuperação Activa",
    sessoes: [
      { dia: "Segunda", tipo: "Recuperação Activa", duracao: "35 min", descricao: "Semana de recuperação obrigatória. Volume e intensidade -25%. Pedal solto, sem esforço." },
      { dia: "Terça", tipo: "Endurance", duracao: "1h", descricao: "Endurance leve de recuperação. Zona 2 baixa (111-122 bpm). Sem subidas exigentes. Cadência 90-95 rpm." },
      { dia: "Quarta", tipo: "Recuperação Activa", duracao: "40 min", descricao: "Sessão de ativação suave. Foco no movimento e fluidez da pedalada. Sem pressão." },
      { dia: "Quinta", tipo: "Tempo (Limiar)", duracao: "55 min", descricao: "Sessão de limiar reduzida: 1 bloco de 15 min em Zona 4 (163-172 bpm). Apenas para manter o estímulo. Sem exageros." },
      { dia: "Sexta", tipo: "Recuperação Activa", duracao: "35 min", descricao: "Pernas leves antes da saída reduzida de sábado. Terreno plano." },
      { dia: "Sábado", tipo: "Saída Longa", duracao: "2h 30min", descricao: "Saída longa reduzida em 25% face à semana 7. Zona 2 baixa, terreno moderado. O corpo precisa de assimilar as 3 semanas intensas anteriores." },
      { dia: "Domingo", tipo: null },
    ],
  },
  {
    numero: 9, titulo: "Semana 9", fase: "Pico de Forma — Específico de Prova",
    sessoes: [
      { dia: "Segunda", tipo: "Recuperação Activa", duracao: "40 min", descricao: "Recuperação ativa após a semana de recuperação. Prepara o terceiro bloco de intensidade." },
      { dia: "Terça", tipo: "Intervalos de Alta Intensidade", duracao: "58 min", descricao: "5 intervalos de 4 min em Zona 5 (175-185 bpm) com recuperação de 3 min em Zona 1-2. Volume total de esforço intenso: 20 min. Foco na qualidade dos esforços." },
      { dia: "Quarta", tipo: "Endurance", duracao: "1h 30min", descricao: "Endurance aeróbico de recuperação ativa. Zona 2 estrita. Cadência 90-95 rpm, terreno moderado." },
      { dia: "Quinta", tipo: "Tempo (Limiar)", duracao: "1h 25min", descricao: "3 blocos de 13 min em Zona 4 (163-172 bpm) com recuperação de 5 min em Zona 2. Volume total de limiar: 39 min. Cadência 88-92 rpm." },
      { dia: "Sexta", tipo: "Recuperação Activa", duracao: "40 min", descricao: "Recuperação obrigatória entre os dois dias intensos e a saída longa de sábado." },
      { dia: "Sábado", tipo: "Saída Longa", duracao: "3h 45min", descricao: "Saída longa de pico de bloco. Percurso com relevo exigente. Nos últimos 45 min, integra 4 esforços de 5 min em Zona 3-4 (148-168 bpm) nas subidas mais longas." },
      { dia: "Domingo", tipo: null },
    ],
  },
  {
    numero: 10, titulo: "Semana 10", fase: "Pico de Forma — Qualidade Máxima",
    sessoes: [
      { dia: "Segunda", tipo: "Recuperação Activa", duracao: "40 min", descricao: "Recuperação total após a saída longa mais exigente do plano. Pedal completamente solto." },
      { dia: "Terça", tipo: "Intervalos de Alta Intensidade", duracao: "60 min", descricao: "6 intervalos de 3 min 30 seg em Zona 5 (175-185 bpm) com recuperação de 3 min em Zona 1-2. Volume total de esforço intenso: 21 min." },
      { dia: "Quarta", tipo: "Endurance", duracao: "1h 30min", descricao: "Endurance de recuperação ativa. Zona 2 estrita. Cadência 90-95 rpm." },
      { dia: "Quinta", tipo: "Tempo (Limiar)", duracao: "1h 30min", descricao: "2 blocos de 20 min em Zona 4 (163-172 bpm) com recuperação de 8 min em Zona 2. Volume total de limiar: 40 min. Cadência 88-92 rpm." },
      { dia: "Sexta", tipo: "Fartlek", duracao: "1h 25min", descricao: "Fartlek de simulação de prova: 50 min em Zona 2 com 5 acelerações de 2 min em Zona 4 (163-172 bpm) intercaladas a cada 8-10 min. Simula os esforços de subida em corrida." },
      { dia: "Sábado", tipo: "Saída Longa", duracao: "4h", descricao: "Saída longa de 4h — pico do plano. Percurso que simule o perfil da prova-alvo. Na segunda metade, mantém Zona 2 alta (128-133 bpm). Pratica toda a estratégia de alimentação e hidratação de corrida." },
      { dia: "Domingo", tipo: null },
    ],
  },
  {
    numero: 11, titulo: "Semana 11", fase: "Taper — Redução de Volume, Manutenção de Intensidade",
    sessoes: [
      { dia: "Segunda", tipo: "Recuperação Activa", duracao: "35 min", descricao: "Início do taper. Volume reduzido -30%. Pedal completamente solto, sem qualquer esforço." },
      { dia: "Terça", tipo: "Intervalos de Alta Intensidade", duracao: "50 min", descricao: "4 intervalos de 3 min em Zona 5 (175-185 bpm) com recuperação de 3 min em Zona 1-2. Volume de esforço reduzido: 12 min. Mantém a qualidade dos esforços, nunca o volume." },
      { dia: "Quarta", tipo: "Endurance", duracao: "1h", descricao: "Sessão aeróbica reduzida de manutenção. Zona 2 estrita e confortável. Cadência 90-95 rpm." },
      { dia: "Quinta", tipo: "Tempo (Limiar)", duracao: "55 min", descricao: "1 bloco de 15 min em Zona 4 (163-172 bpm). Sessão curta para manter o estímulo de limiar. Sente a potência sem gastar reservas." },
      { dia: "Sexta", tipo: "Recuperação Activa", duracao: "35 min", descricao: "Pré-pré-prova. Pedal solto, nada de esforço. As pernas precisam de estar completamente frescas." },
      { dia: "Sábado", tipo: "Saída Longa", duracao: "2h", descricao: "Saída longa de taper — volume reduzido a 50% do pico (de 4h para 2h). Ritmo confortável. Inclui 10 min de aquecimento específico simulando o ritmo de largada da prova." },
      { dia: "Domingo", tipo: null },
    ],
  },
  {
    numero: 12, titulo: "Semana 12", fase: "Semana de Prova — Ativação e Competição",
    sessoes: [
      { dia: "Segunda", tipo: "Recuperação Activa", duracao: "30 min", descricao: "Pedal de ativação mínima. Mantém as pernas a mexer sem qualquer esforço. Nenhuma fadiga deve acumular esta semana." },
      { dia: "Terça", tipo: "Intervalos de Alta Intensidade", duracao: "45 min", descricao: "3 intervalos de 2 min 30 seg em Zona 5 (175-185 bpm) com recuperação de 3 min. Volume de esforço mínimo: 7,5 min. O objetivo é ativar o sistema, não acumular fadiga." },
      { dia: "Quarta", tipo: "Endurance", duracao: "50 min", descricao: "Sessão de manutenção aeróbica mínima. Zona 2 muito confortável. Foco mental e visualização da prova durante o esforço." },
      { dia: "Quinta", tipo: "Recuperação Activa", duracao: "30 min", descricao: "Ativação pré-prova. Pedal completamente solto com 4-5 acelerações de 10 seg em Zona 4 para manter a reatividade muscular. Nada mais." },
      { dia: "Sexta", tipo: null },
      { dia: "Sábado", tipo: null },
      { dia: "Domingo", tipo: null },
    ],
  },
];

function WeekCard({ semana }: { semana: MockupSemana }) {
  return (
    <div className="rounded-lg overflow-hidden border border-white/[0.08]">
      <div className="bg-[#1E90FF]/15 border-b border-[#1E90FF]/25 px-3 py-2 flex items-baseline gap-2">
        <span className="text-white text-xs font-black shrink-0">{semana.titulo}</span>
        <span className="text-[#60a5fa] text-[8px] font-bold uppercase tracking-wide leading-tight">{semana.fase}</span>
      </div>
      <div className="divide-y divide-white/[0.05]">
        {semana.sessoes.map((sessao) =>
          sessao.tipo === null ? (
            <div key={sessao.dia} className="px-3 py-1.5 flex items-center gap-2.5 bg-black/15">
              <span className="text-[8px] font-black text-[#64748b] uppercase tracking-wide w-16 shrink-0">{sessao.dia}</span>
              <span className="text-[#334155] text-[9px] italic">Descanso</span>
            </div>
          ) : (
            <div key={sessao.dia} className="px-3 py-2 flex items-start gap-2.5">
              <span className="text-[8px] font-black text-[#64748b] uppercase tracking-wide w-16 shrink-0 pt-0.5">{sessao.dia}</span>
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-block border text-[7px] font-bold px-2 py-0.5 rounded-full ${getBadgeClass(sessao.tipo)}`}>
                    {sessao.tipo}
                  </span>
                  {sessao.duracao && (
                    <span className="text-[#64748b] text-[8px]">{sessao.duracao}</span>
                  )}
                </div>
                {sessao.descricao && (
                  <p className="text-[#94a3b8] text-[8px] leading-relaxed">{sessao.descricao}</p>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function PDFMockup() {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 select-none">
      {/* Static mini-header — lives outside the scroll container */}
      <div className="bg-[#0a1520] border-b border-[#1E90FF]/25 px-5 py-2.5 flex items-center gap-3">
        <Image src="/logo.png" alt="VelociPlan" width={90} height={27} className="opacity-90 shrink-0" />
        <span className="text-[10px] text-[#60a5fa] font-semibold min-w-0 leading-tight">
          Plano de Treino Preparação para Prova — 12 Semanas
        </span>
      </div>

      <div
        className="max-h-[500px] overflow-y-auto bg-[#0D1B2A]"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#1E90FF40 #0a1520" }}
      >
        {/* Content */}
        <div className="px-5 py-4 space-y-4">

          {/* Cover block */}
          <div className="bg-[#0a1520] border border-[#1E90FF]/20 rounded-lg p-4">
            <div className="inline-block bg-[#1E90FF]/12 border border-[#1E90FF]/35 text-[#60a5fa] text-[8px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest mb-2">
              Plano Personalizado por IA
            </div>
            <div className="text-white font-black text-sm leading-snug mb-3">
              Plano de Treino Preparação para Prova — 12 Semanas
            </div>
            <div className="flex flex-wrap gap-4 mb-3">
              {["12 semanas", "70 sessões", "6 dias/semana"].map((stat) => (
                <div key={stat} className="flex items-center gap-1.5 text-[#94a3b8] text-[10px]">
                  <div className="w-1.5 h-1.5 bg-[#1E90FF] rounded-full shrink-0" />
                  {stat}
                </div>
              ))}
            </div>
            <div className="bg-[#1E90FF]/07 border border-[#1E90FF]/20 rounded-lg px-3 py-2.5 mb-2.5">
              <div className="text-[#1E90FF] text-[7px] font-black uppercase tracking-widest mb-1.5">O Teu Perfil</div>
              <p className="text-[#94a3b8] text-[9px] leading-relaxed">
                Ciclista de competição · 35 anos · 75 kg · 6 dias/semana · Objetivo: preparação para prova
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5">
              <div className="text-[#1E90FF] text-[7px] font-black uppercase tracking-widest mb-1.5">Visão Geral</div>
              <p className="text-[#94a3b8] text-[9px] leading-relaxed">
                Programa dividido em 4 fases: Base Aeróbica (sem 1–4), Desenvolvimento do Limiar (sem 5–8),
                Alta Intensidade e Especificidade (sem 9–11) e Taper para Prova (sem 12). Volume progressivo
                com semanas de descarga nas semanas 4 e 8.
              </p>
            </div>
          </div>

          {/* 12 weeks */}
          {SEMANAS_DATA.map((semana) => (
            <WeekCard key={semana.numero} semana={semana} />
          ))}

          {/* Final page — Nutrition, Recovery, Message */}
          <div className="bg-[#0a1520] border border-[#1E90FF]/20 rounded-lg p-4 space-y-3.5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-0.5 h-3 bg-[#1E90FF] rounded-full" />
                <span className="text-[#1E90FF] text-[8px] font-black uppercase tracking-widest">Nutrição</span>
              </div>
              <div className="text-[#94a3b8] text-[9px] leading-relaxed space-y-1.5">
                <p><span className="text-white font-semibold">Antes do treino:</span> Refeição leve 2–3h antes. Gel energético 15 min antes de sessões intensas.</p>
                <p><span className="text-white font-semibold">Durante:</span> 30–60 g carboidratos/hora em saídas +90 min. Água + eletrólitos cada 20 min.</p>
                <p><span className="text-white font-semibold">Após:</span> Proteína + carboidratos em 30 min. Frango + arroz ou batido de recuperação.</p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-0.5 h-3 bg-[#1E90FF] rounded-full" />
                <span className="text-[#1E90FF] text-[8px] font-black uppercase tracking-widest">Recuperação</span>
              </div>
              <p className="text-[#94a3b8] text-[9px] leading-relaxed">
                Sono 7–9 horas por noite. Rolo de espuma 10 min após treinos intensos.
                Banho frio 3–5 min (12–15°C) após saídas longas. Compressão nas pernas
                à noite nas semanas de alta carga.
              </p>
            </div>
            <div className="border-t border-white/10 pt-3">
              <p className="text-[#60a5fa] text-[9px] font-semibold italic text-center leading-relaxed">
                &quot;Doze semanas de trabalho estruturado constroem o que anos de treino aleatório
                nunca conseguem. Cada sessão tem um propósito. Confia no processo.&quot;
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Page data ─────────────────────────────────────────────────────────────────
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
    Icon: IconCpu,
    title: "IA que te conhece",
    description:
      "O teu plano é criado com base no teu perfil único — nível, objetivos, horário disponível e equipamento. Nenhum plano é igual a outro.",
  },
  {
    Icon: IconDocument,
    title: "PDF pronto a usar",
    description:
      "Um documento profissional com o teu plano semana a semana, aquecimentos, intensidades e orientações de nutrição. Imprime ou guarda no telemóvel.",
  },
  {
    Icon: IconSliders,
    title: "100% personalizado",
    description:
      "Não é um plano genérico copiado da internet. É construído especificamente para ti — com as tuas disponibilidades, limitações físicas e objetivos.",
  },
  {
    Icon: IconBanknotes,
    title: "Pagamento único · sem subscrições",
    description:
      "Pagas €9,99 uma vez e o PDF é teu para sempre. Nada de mensalidades, nada de surpresas.",
  },
];

const testimonials = [
  {
    texto: "Seis semanas depois de começar já sinto diferença real. Era a estrutura que me faltava.",
    nome: "Rui Fernandes",
    contexto: "Ciclista amador · Porto",
    avatar: "/avatars/rui.webp",
  },
  {
    texto: "Pensei que ia receber algo genérico mas era mesmo adaptado ao meu nível e às minhas disponibilidades. Aprendi o que é treinar em Zona 2. Já pedi ao marido para fazer o dele.",
    nome: "Ana Carvalho",
    contexto: "Cicloturista · Braga",
    estrelas: 4,
    avatar: "/avatars/ana.webp",
  },
  {
    texto: "Tem a mesma estrutura que o meu treinador me dava. Por uma fração do preço.",
    nome: "Gonçalo Matos",
    contexto: "Ciclista de competição · Lisboa",
    avatar: "/avatars/goncalo.webp",
  },
  {
    texto: "Comprei o plano na sexta e no sábado de manhã já estava a pedalar com um objetivo claro. A diferença de treinar com propósito é enorme.",
    nome: "Pedro Sousa",
    contexto: "Ciclista de estrada · Coimbra",
    avatar: "/avatars/pedro.webp",
  },
  {
    texto: "Comecei a pedalar há seis meses e não sabia como progredir. O plano explica tudo desde o início. Finalmente sei o que estou a fazer quando saio de casa.",
    nome: "Marta Lopes",
    contexto: "Iniciante · Faro",
    avatar: "/avatars/marta.webp",
  },
  {
    texto: "Fiz o plano de 12 semanas antes de uma granfondo e terminei muito melhor do que esperava. Já encomendei outro para a próxima época.",
    nome: "Tiago Rodrigues",
    contexto: "Ciclista amador com provas · Aveiro",
    estrelas: 4,
    avatar: "/avatars/tiago.webp",
  },
  {
    texto: "Uso para o ciclismo do triatlo. Qualidade igual a planos que já paguei muito mais.",
    nome: "Catarina Silva",
    contexto: "Triatleta · Guimarães",
    avatar: "/avatars/catarina.webp",
  },
  {
    texto: "Nunca tinha seguido um plano antes e achei que seria complicado. É muito simples de usar. Já perdi três quilos e consigo fazer as subidas que antes me matavam.",
    nome: "João Oliveira",
    contexto: "Ciclista de fim de semana · Setúbal",
    estrelas: 4,
    avatarColor: "#1E5FAA",
  },
  {
    texto: "Precisava de algo que se adaptasse ao meu horário com dias de descanso fixos. O formulário perguntou exatamente isso e o plano respeitou tudo.",
    nome: "Filipa Nunes",
    contexto: "Ciclismo de fitness · Évora",
    avatar: "/avatars/filipa.webp",
  },
  {
    texto: "Dez anos a pedalar e aprendi mais sobre periodização aqui do que em toda a minha vida.",
    nome: "André Costa",
    contexto: "Ciclista experiente · Cascais",
    avatarColor: "#166534",
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

// ── Payment trust badges — used in hero and bottom CTA ───────────────────────
function PaymentTrustBar() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-6 sm:mt-8">
      {/* Stripe */}
      <div className="flex items-center gap-1 sm:gap-1.5 border border-white/10 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 bg-white/[0.03]">
        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" viewBox="0 0 24 24" fill="#635BFF" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
        </svg>
        <span className="text-[10px] sm:text-xs text-gray-400">Powered by <span className="text-[#635BFF] font-semibold">Stripe</span></span>
      </div>
      {/* SSL */}
      <div className="flex items-center gap-1 sm:gap-1.5 border border-white/10 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 bg-white/[0.03]">
        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-400 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
        <span className="text-[10px] sm:text-xs text-gray-400">Ligação <span className="text-green-400 font-medium">SSL</span> segura</span>
      </div>
      {/* Cards */}
      <div className="flex items-center gap-1 sm:gap-1.5 border border-white/10 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 bg-white/[0.03]">
        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 21Z" />
        </svg>
        <span className="text-[10px] sm:text-xs text-gray-400">Visa · Mastercard · MB Way</span>
      </div>
    </div>
  );
}

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

      {/* ── Sticky header: announcement bar + nav ── */}
      <div className="sticky top-0 z-20 bg-brand-navy/95 backdrop-blur-sm">
        {/* Launch Offer Announcement Bar */}
        <div className="bg-brand-blue/10 border-b border-brand-blue/25 px-3 py-2 text-center">
          <p className="text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-amber-400">⏱</span>
            <span className="text-gray-300">Preço termina em</span>
            <CountdownTimer variant="inline" />
            <span className="text-gray-600 hidden sm:inline">·</span>
            <span className="text-white font-bold">€9,99</span>
            <span className="line-through text-gray-500 text-[10px] sm:text-xs">€19,99</span>
          </p>
        </div>

        {/* Navigation */}
        <nav className="border-b border-white/10 px-4 py-2">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Image src="/logo.png" alt="VelociPlan" width={130} height={39} className="w-24 sm:w-32 h-auto" />
          <div className="flex items-center gap-3">
            <a
              href="#como-funciona"
              className="hidden sm:block text-sm text-gray-400 hover:text-white transition-colors"
            >
              Como funciona
            </a>
            <Link
              href="/gerar"
              className="bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold text-sm px-3 sm:px-5 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              Gerar Plano Grátis
            </Link>
          </div>
        </div>
      </nav>
      </div>{/* end sticky header */}

      {/* ── Hero ── */}
      <section className="px-5 py-10 sm:py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-blue font-bold text-xs sm:text-sm uppercase tracking-widest mb-4">
            Cansado de treinar sem estrutura e não evoluir?
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-5">
            O teu plano de ciclismo{" "}
            <span className="gradient-text">personalizado por IA</span>,
            {" "}pronto em segundos
          </h1>

          <p className="text-sm sm:text-xl text-gray-300 mb-8 sm:mb-10 leading-relaxed">
            Preenches um formulário de 5 minutos. A IA analisa o teu perfil e
            cria um plano completo — semana a semana, com intensidades,
            aquecimentos e nutrição. Vês grátis. Pagas só para descarregar o PDF.
          </p>

          <Link
            href="/gerar"
            className="block sm:inline-block bg-brand-blue hover:bg-brand-blue-dark text-white font-bold text-base sm:text-lg px-6 sm:px-10 py-4 rounded-xl transition-colors shadow-lg shadow-brand-blue/30"
          >
            Gerar o Meu Plano Grátis →
          </Link>

          <p className="text-xs sm:text-sm text-gray-500 mt-3">
            Pré-visualização grátis · Só pagas para descarregar · Sem subscrições
          </p>

          {/* Trust badges */}
          <div className="grid grid-cols-1 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-6 mt-6 sm:mt-10 text-xs sm:text-sm text-gray-500">
            <span className="flex items-center justify-center gap-2">
              <span className="text-green-400">✓</span> Plano em 1 a 2 minutos
            </span>
            <span className="flex items-center justify-center gap-2">
              <span className="text-green-400">✓</span> Vês grátis antes de pagar
            </span>
            <span className="flex items-center justify-center gap-2">
              <span className="text-green-400">✓</span>
              <span className="line-through text-gray-600 mr-0.5">€19,99</span>
              <span className="text-white font-semibold">€9,99</span>
              <span className="text-amber-400 text-[10px] sm:text-xs font-medium">· oferta limitada</span>
            </span>
          </div>

          {/* Payment trust badges */}
          <PaymentTrustBar />
        </div>
      </section>

      {/* ── PDF Preview Mockup — scrollable simulation ── */}
      <section className="px-4 sm:px-6 py-10 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 uppercase tracking-widest">O que recebes no PDF</p>
          <PDFMockup />
          <p className="text-center text-xs text-gray-600 mt-3">
            Exemplo do formato do PDF — o teu plano terá o teu conteúdo personalizado
          </p>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="como-funciona" className="px-5 sm:px-6 py-10 sm:py-16 bg-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-3">Como funciona</h2>
          <p className="text-center text-gray-400 text-sm sm:text-base mb-8 sm:mb-12">De zero ao teu plano personalizado em menos de 5 minutos.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            {steps.map((step) => (
              <div
                key={step.numero}
                className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10 hover:border-brand-blue/30 transition-colors"
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-brand-blue/40 bg-brand-blue/10 flex items-center justify-center shrink-0">
                  <span className="text-xs sm:text-sm font-bold text-brand-blue">{step.numero}</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm sm:text-base mb-0.5 sm:mb-1">{step.titulo}</p>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{step.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-5 sm:px-6 py-10 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-3">Porquê o VelociPlan?</h2>
          <p className="text-center text-gray-400 text-sm sm:text-base mb-8 sm:mb-12">Um treinador pessoal custa centenas de euros por mês. O VelociPlan custa €9,99.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10 hover:border-brand-blue/50 transition-colors group"
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-3 sm:mb-4 group-hover:bg-brand-blue/20 transition-colors">
                  <f.Icon />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">{f.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>

          {/* Intermediate CTA */}
          <div className="text-center mt-8 sm:mt-12">
            <Link
              href="/gerar"
              className="block sm:inline-block bg-brand-blue hover:bg-brand-blue-dark text-white font-bold text-base px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-brand-blue/25"
            >
              Gerar o Meu Plano Grátis →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-10 sm:py-16 bg-white/[0.03]">
        <div className="px-6 max-w-4xl mx-auto text-center mb-6 sm:mb-12">
          <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-3">O que dizem os ciclistas</h2>
          <p className="text-gray-400 text-sm sm:text-base">Mais de 200 planos gerados. Aqui ficam alguns relatos.</p>
        </div>
        {/* Marquee wrapper — fade edges via mask-image */}
        <div
          className="overflow-hidden"
          style={{
            WebkitMaskImage: "linear-gradient(to right, transparent, white 8%, white 92%, transparent)",
            maskImage: "linear-gradient(to right, transparent, white 8%, white 92%, transparent)",
          }}
        >
          <div
            className="flex gap-3 sm:gap-5 animate-marquee py-2"
            style={{ width: "max-content" }}
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={i}
                className="w-[224px] sm:w-80 shrink-0 flex flex-col p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-2 sm:mb-4">
                  {[...Array(t.estrelas ?? 5)].map((_, j) => (
                    <svg key={j} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400">
                      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed flex-1">{t.texto}</p>

                {/* Author */}
                <div className="flex items-center gap-2 sm:gap-3 mt-3 pt-3 sm:mt-5 sm:pt-5 border-t border-white/10">
                  {t.avatar ? (
                    <Image
                      src={t.avatar}
                      alt={t.nome}
                      width={36}
                      height={36}
                      className="rounded-full object-cover shrink-0 w-7 h-7 sm:w-9 sm:h-9"
                    />
                  ) : (
                    <div
                      className="w-7 h-7 sm:w-9 sm:h-9 rounded-full shrink-0 flex items-center justify-center font-bold text-sm sm:text-base text-white"
                      style={{ backgroundColor: t.avatarColor ?? "#1E90FF" }}
                    >
                      {t.nome[0]}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-semibold text-xs sm:text-sm">{t.nome}</p>
                    <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5">{t.contexto}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-5 sm:px-6 py-10 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-3">Perguntas frequentes</h2>
          <p className="text-center text-gray-400 text-sm sm:text-base mb-8 sm:mb-12">Temos resposta para as tuas dúvidas.</p>
          <div className="space-y-2 sm:space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.pergunta}
                className="group rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                <summary className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 cursor-pointer gap-3 sm:gap-4">
                  <p className="text-white font-semibold text-sm">{faq.pergunta}</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 shrink-0 text-gray-500 transition-transform duration-200 group-open:rotate-180 group-open:text-brand-blue"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <div className="px-4 sm:px-6 pb-4 sm:pb-5">
                  <div className="h-px bg-white/10 mb-3 sm:mb-4" />
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{faq.resposta}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Bottom — distinct background with radial glow ── */}
      <section className="relative px-5 sm:px-6 py-12 sm:py-20 text-center overflow-hidden border-t border-brand-blue/20">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(30,144,255,0.10) 0%, transparent 65%)" }}
        />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">
            Pronto para treinar com{" "}
            <span className="gradient-text">inteligência</span>?
          </h2>
          <p className="text-gray-400 mb-3 text-sm sm:text-lg">
            Preenche o formulário em 5 minutos e vê o teu plano grátis.
          </p>
          <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3 sm:mb-4">
            O preço sobe em
          </p>
          <CountdownTimer variant="grid" />
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-white/5 border border-white/10 rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 mt-5 sm:mt-6 mb-6 sm:mb-8">
            <span className="text-gray-500 text-xs sm:text-sm line-through">€19,99</span>
            <span className="text-white font-bold text-lg sm:text-xl">€9,99</span>
            <span className="w-px h-4 sm:h-5 bg-white/10 hidden sm:block" />
            <span className="text-gray-400 text-xs sm:text-sm w-full sm:w-auto">pagamento único · PDF para sempre</span>
          </div>
          <Link
            href="/gerar"
            className="block sm:inline-block bg-brand-blue hover:bg-brand-blue-dark text-white font-bold text-base sm:text-lg px-6 sm:px-10 py-4 rounded-xl transition-colors shadow-lg shadow-brand-blue/30"
          >
            Gerar o Meu Plano Grátis →
          </Link>
          <PaymentTrustBar />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 px-5 sm:px-6 py-8 sm:py-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mb-5 sm:mb-6">
            <Image src="/logo.png" alt="VelociPlan" width={130} height={39} className="opacity-60 w-24 sm:w-32 h-auto" />
            <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-500">
              <Link href="/privacidade" className="hover:text-gray-300 transition-colors">Política de Privacidade</Link>
              <Link href="/termos" className="hover:text-gray-300 transition-colors">Termos e Condições</Link>
              <Link href="/reembolso" className="hover:text-gray-300 transition-colors">Política de Reembolso</Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 pt-5 sm:pt-6 border-t border-white/5 text-xs text-gray-600">
            <p>
              © {new Date().getFullYear()} VelociPlan · Portugal
              <span className="mx-2 opacity-40">·</span>
              NIF: <span className="text-gray-500">516 341 529</span>
            </p>
            <a href="mailto:suporte@velociplan.pt" className="hover:text-gray-400 transition-colors">
              suporte@velociplan.pt
            </a>
          </div>
        </div>
      </footer>

    </main>
  );
}
