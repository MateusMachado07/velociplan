import { z } from "zod";

// Zod is a validation library — it checks that data has the right shape
// and gives clear error messages if not.
// This schema mirrors the FormData type in src/types/index.ts

export const formDataSchema = z.object({
  fitnessLevel: z.enum(["iniciante", "intermedio", "avancado", "competicao"]),

  objetivo: z.enum([
    "perder_peso",
    "resistencia",
    "preparacao_corrida",
    "fitness_geral",
    "velocidade",
  ]),

  diasPorSemana: z.number().int().min(1).max(7),
  diasDisponiveis: z.array(z.string()).min(1),

  volumeAtual: z.string().min(1, "Por favor indica o teu volume atual."),

  tipoCiclismo: z.enum(["estrada", "mtb", "gravel", "indoor", "misto"]),

  equipamento: z.object({
    medidorPotencia: z.boolean(),
    monitorFrequencia: z.boolean(),
    treinadorIndoor: z.boolean(),
  }),

  idade: z.number().int().min(10).max(100),
  peso: z.number().min(30).max(250), // kg
  sexoBiologico: z.enum(["masculino", "feminino"]),

  lesoes: z.string(), // optional free text
  informacaoAdicional: z.string(), // optional free text
});

export type FormDataInput = z.infer<typeof formDataSchema>;
