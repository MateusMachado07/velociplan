// ============================================================
// VelociPlan — Shared TypeScript Types
// These types are used across the entire app (form, AI, PDF, Stripe)
// ============================================================

// All the data collected from the multi-step form
export interface FormData {
  // Step 1 — Fitness level
  fitnessLevel: "iniciante" | "intermedio" | "avancado" | "competicao";

  // Step 2 — Primary goal
  objetivo:
    | "perder_peso"
    | "resistencia"
    | "preparacao_corrida"
    | "fitness_geral"
    | "velocidade";

  // Step 3 — Training schedule
  diasPorSemana: number;
  diasDisponiveis: string[]; // e.g. ["segunda", "quarta", "sexta"]

  // Step 4 — Session duration
  duracaoSessao: "30min" | "1h" | "1h30" | "2h_mais";

  // Step 5 — Current training volume
  volumeAtual: string; // e.g. "100km/semana" or "5h/semana"

  // Step 6 — Cycling type
  tipoCiclismo: "estrada" | "mtb" | "gravel" | "indoor" | "misto";

  // Step 7 — Equipment
  equipamento: {
    medidorPotencia: boolean;
    monitorFrequencia: boolean;
    treinadorIndoor: boolean;
  };

  // Step 8 — Personal info
  idade: number;
  sexoBiologico: "masculino" | "feminino";

  // Step 9 — Injuries / limitations
  lesoes: string; // free text, empty string if none

  // Final free-text field
  informacaoAdicional: string;
}

// A single training session within a day
export interface Sessao {
  tipo: string; // e.g. "Endurance", "Intervalos", "Recuperação"
  duracao: string; // e.g. "1h30"
  zonaIntensidade: string; // e.g. "Zona 2" or "RPE 6-7"
  instrucoes: string; // specific workout instructions
  aquecimento: string;
  arrefecimento: string;
}

// A single day in the training plan
export interface DiaTreino {
  dia: string; // e.g. "Segunda-feira"
  descanso: boolean; // true = rest day
  sessao?: Sessao;
}

// A full week of training
export interface SemanaTreino {
  semana: number; // week number, e.g. 1
  foco: string; // e.g. "Base Aeróbica", "Intensidade", "Recuperação"
  dias: DiaTreino[];
}

// The full structured training plan returned by the AI
export interface PlanoTreino {
  titulo: string; // e.g. "Plano de Treino — 8 Semanas"
  duracao: number; // total weeks, e.g. 8
  resumoPerfil: string; // short summary of the user's profile
  resumoPlano: string; // motivational overview paragraph
  semanas: SemanaTreino[];
  nutricao: string; // nutrition guidance section
  recuperacao: string; // recovery guidance section
  mensagemMotivacional: string; // closing motivational message
}

// The payload stored in the browser session after AI generation
// Used to link the plan with the Stripe payment
export interface SessaoPlano {
  plano: PlanoTreino;
  formData: FormData;
  geradoEm: string; // ISO date string
  pago: boolean;
  stripeSessionId?: string;
}
