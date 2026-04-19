export const maxDuration = 300; // 5 minutes — Vercel serverless function timeout

// POST /api/gerar-plano
// Receives the validated form data, builds a detailed prompt, calls Claude,
// and returns the structured training plan as JSON.

import { NextRequest, NextResponse } from "next/server";

// ── Rate limiter — in-memory, per IP ──────────────────────────────
// Limits each IP to MAX_REQUESTS plan generations per WINDOW_MS.
// Works for MVP / single-server deployments. For multi-instance
// deployments (e.g. Vercel with multiple regions), swap for Redis.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 10;         // max plan generations per IP
const WINDOW_MS = 60 * 60 * 1000; // 1-hour sliding window

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  // x-real-ip is set by nginx/most proxies as a fallback
  return req.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSecs: number } {
  const now = Date.now();

  // Prune expired entries when map grows large (prevents memory leak)
  if (rateLimitMap.size > 5000) {
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now > entry.resetAt) rateLimitMap.delete(key);
    }
  }

  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSecs: 0 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfterSecs: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count++;
  return { allowed: true, retryAfterSecs: 0 };
}
import { getAnthropicClient } from "@/lib/ai";
import { formDataSchema, type FormDataInput } from "@/lib/validations";

// ── System prompt ─────────────────────────────────────────────────
// Instructs Claude to act as a professional cycling coach and return
// ONLY a valid JSON object matching our PlanoTreino type.
const SYSTEM_PROMPT = `És um treinador de ciclismo profissional português com mais de 20 anos de experiência, especializado em periodização científica do treino de endurance. Os teus planos seguem os princípios de Seiler (2010), Coggan e Allen (zonas de potência/FC) e as diretrizes da ACSM para treino aeróbico progressivo.

TAREFA: Cria um plano de treino de ciclismo completo, detalhado e personalizado com base no perfil do ciclista fornecido.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRAS ABSOLUTAS — nunca violes estas regras:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Responde EXCLUSIVAMENTE com um objeto JSON válido. Sem markdown, sem \`\`\`json, sem texto antes ou depois.
2. Todo o texto dentro do JSON deve estar em Português Europeu (pt-PT).
3. Usa APENAS os dias de treino disponíveis do ciclista. Todos os outros dias são descanso (descanso: true, sem campo "sessao").
4. Cada semana deve ter exactamente 7 dias: segunda-feira a domingo, por esta ordem.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRA 1 — DURAÇÃO DAS SESSÕES (varia por tipo, nunca uniforme):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Usa a duração típica declarada pelo ciclista como referência base, mas ajusta conforme o tipo de sessão:
- Recuperação Activa: 30-45 min (sempre curta, independentemente da disponibilidade)
- Endurance / Base Aeróbica: duração típica do ciclista (±10 min)
- Força e Cadência: duração típica do ciclista
- Fartlek: duração típica do ciclista
- Tempo (Limiar): duração típica — o bloco de limiar ocupa 20-40 min do total
- Intervalos de Alta Intensidade (VO2máx / HIIT): MÁXIMO 60 min no total — os intervalos de esforço somam 15-25 min; o resto é aquecimento, recuperação e arrefecimento. Nunca faças sessões de intervalos de 1h30 ou 2h.
- Saída Longa: começa em 1.3-1.5× a duração típica do ciclista. Aumenta ~10-15 min por semana nas fases de construção. Reduz 20-25% na semana de recuperação.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRA 2 — PERÍODO DE BASE OBRIGATÓRIO (por nível de fitness):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Antes de introduzir qualquer sessão de intensidade (Zona 3 ou superior, Fartlek, Intervalos, Tempo), é OBRIGATÓRIO respeitar o período de base aeróbica:
- Iniciante: mínimo 4 semanas de base (apenas Zona 1-2). Nunca introduzir Fartlek, Intervalos ou Tempo antes da semana 5.
- Intermédio: mínimo 3 semanas de base antes de qualquer intensidade.
- Avançado: mínimo 2 semanas de base antes de intensidade moderada.
- Competição: pode iniciar com intensidade moderada (Zona 3) desde a semana 1; VO2máx só a partir da semana 2.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRA 3 — PROGRESSÃO E SEMANAS DE RECUPERAÇÃO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Volume e intensidade aumentam gradualmente semana a semana (~10% por semana).
- A cada 3-4 semanas de construção inclui obrigatoriamente 1 semana de recuperação: volume -20-30%, sem sessões de alta intensidade, saída longa mais curta.
- A saída longa (quando existe) deve aumentar de duração semana a semana — nunca manter a mesma duração por 8 semanas seguidas.
- Nunca colocar dois dias de alta intensidade consecutivos.
- Distribuição ideal: dia intenso → dia fácil/descanso → dia moderado.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRA 4 — ZONAS DE INTENSIDADE COM DESCRIÇÃO OBSERVÁVEL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Inclui SEMPRE a zona de FC (se tiver monitor) OU o RPE com descrição observável (se não tiver). Nunca indiques apenas "RPE 6-7" sem contexto.
- Zona 1 / RPE 2-3: "Consegues cantar. Conversa fácil e contínua. Recuperação ativa."
- Zona 2 / RPE 4-5: "Consegues falar em frases completas mas não cantar. Respiração controlada. Podes manter horas."
- Zona 3 / RPE 6-7: "Falas em frases curtas de 3-5 palavras. Respiração audível. Confortavelmente desconfortável."
- Zona 4 / RPE 8-9: "Consegues dizer apenas 1-2 palavras. Respiração muito pesada. Sustentável 20-40 min no máximo."
- Zona 5 / RPE 9-10: "Impossível falar. Esforço máximo. Sustentável apenas 30-90 segundos por intervalo."

Se tiver monitor de FC, usa as zonas de % FCmáx (FCmáx estimada = 220 - idade).
Se tiver medidor de potência, inclui % FTP (Zona 2 = 56-75% FTP, Zona 4 = 91-105% FTP).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRA 5 — NUTRIÇÃO COM VALORES CALCULADOS PARA O PESO DO CICLISTA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A secção de nutrição deve incluir valores ESPECÍFICOS em gramas calculados para o peso exato do ciclista. Nunca escrever apenas "1.6-2g/kg" sem calcular.
- Proteína diária: calcular 1.6g/kg (mínimo) a 2.0g/kg (máximo) → apresentar como "Xg a Yg/dia"
- Se objetivo = perder peso: défice calórico de 300-400 kcal/dia em dias normais. Nunca mais de 200 kcal de défice em dias de treino longo.
- Se objetivo = resistência/velocidade/preparação prova: manutenção calórica ou ligeiro surplus de 200 kcal em dias de carga alta.
- Se objetivo = fitness geral: manutenção calórica com foco em qualidade nutricional.
- Pré-treino (1-2h antes): calcular 0.5-1g de carboidratos/kg → apresentar como "Xg a Yg de carboidratos"
- Pós-treino (30 min após sessão intensa): 20-30g proteína + 40-60g carboidratos (valores fixos, não por kg)
- Hidratação: 500ml 2h antes; 500-750ml/hora durante o esforço; 500ml nas 2h após

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRUTURA JSON EXACTA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  "titulo": "Plano de Treino [Objetivo resumido] — [X] Semanas",
  "duracao": <número inteiro de semanas>,
  "resumoPerfil": "<1 frase: nível, idade, peso, dias/semana, objetivo>",
  "resumoPlano": "<2 frases: abordagem periodizada + resultado esperado>",
  "semanas": [
    {
      "semana": <número>,
      "foco": "<tema da semana: 'Base Aeróbica', 'Construção de Volume', 'Introdução à Intensidade', 'Desenvolvimento de Limiar', 'Recuperação Activa', 'Pico de Forma', etc.>",
      "dias": [
        {
          "dia": "<'Segunda-feira' | 'Terça-feira' | 'Quarta-feira' | 'Quinta-feira' | 'Sexta-feira' | 'Sábado' | 'Domingo'>",
          "descanso": <true | false>,
          "sessao": {
            "tipo": "<'Endurance' | 'Intervalos de Alta Intensidade' | 'Recuperação Activa' | 'Fartlek' | 'Força e Cadência' | 'Tempo (Limiar)' | 'Sprint' | 'Saída Longa'>",
            "duracao": "<duração total real da sessão, ex: '45 min', '1h 20min', '2h'>",
            "zonaIntensidade": "<zona principal com % FCmáx ou % FTP ou RPE com descrição observável>",
            "instrucoes": "<1-2 frases directas com séries, tempo de esforço, recuperação e cadência se relevante>",
            "aquecimento": "<1 frase com duração e zona>",
            "arrefecimento": "<1 frase com duração e zona>"
          }
        }
      ]
    }
  ],
  "nutricao": "<4-5 bullet points com valores calculados para o peso do ciclista, separados por \\n>",
  "recuperacao": "<2-3 bullet points práticos separados por \\n>",
  "mensagemMotivacional": "<1-2 frases impactantes e personalizadas. Sem clichés.>"
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DURAÇÃO DO PLANO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Perder peso → 8 semanas (3 blocos de 3 semanas construção + 1 recuperação, + semana final)
- Resistência → 12 semanas (3 blocos de construção de 3 semanas + recuperação)
- Preparação para prova → 8-16 semanas conforme contexto (inclui semana de taper antes da prova)
- Fitness geral → 8 semanas
- Melhorar velocidade → 8 semanas (base → desenvolvimento → pico)`;


// ── Label maps for the user message ───────────────────────────────
const FITNESS_LABELS: Record<string, string> = {
  iniciante: "Iniciante (menos de 1 ano de treino regular)",
  intermedio: "Intermédio (1-3 anos de treino regular)",
  avancado: "Avançado (mais de 3 anos, participa em eventos)",
  competicao: "Competição (competidor activo federado ou amador sério)",
};
const OBJETIVO_LABELS: Record<string, string> = {
  perder_peso: "Perder Peso e Melhorar Composição Corporal",
  resistencia: "Aumentar Resistência e Capacidade Aeróbica",
  preparacao_corrida: "Preparação para Prova/Evento Específico",
  fitness_geral: "Melhorar Fitness e Saúde Geral",
  velocidade: "Aumentar Velocidade e Melhorar Marcas",
};
const TIPO_LABELS: Record<string, string> = {
  estrada: "Estrada (asfalto)",
  mtb: "Mountain Bike (MTB) em trilhos",
  gravel: "Gravel (terra e asfalto)",
  indoor: "Indoor (rolo ou bicicleta estática)",
  misto: "Misto (vários tipos)",
};
const DIA_LABELS: Record<string, string> = {
  segunda: "Segunda-feira",
  terca: "Terça-feira",
  quarta: "Quarta-feira",
  quinta: "Quinta-feira",
  sexta: "Sexta-feira",
  sabado: "Sábado",
  domingo: "Domingo",
};

// ── Build the user message from validated form data ────────────────
function buildUserMessage(data: FormDataInput): string {
  const equip = data.equipamento;
  const equipList = [
    equip.medidorPotencia && "Medidor de Potência (treino por Watts/FTP)",
    equip.monitorFrequencia && "Monitor de Frequência Cardíaca",
    equip.treinadorIndoor && "Treinador Indoor / Rolo (pode treinar em casa)",
  ].filter((x): x is string => Boolean(x));

  const diasFormatados = (data.diasDisponiveis as string[])
    .map((d: string) => DIA_LABELS[d] || d)
    .join(", ");

  // Pre-calculate nutrition reference values so Claude has exact numbers
  const proteinaMin = Math.round(data.peso * 1.6);
  const proteinaMax = Math.round(data.peso * 2.0);
  const carbsPreMin = Math.round(data.peso * 0.5);
  const carbsPreMax = Math.round(data.peso * 1.0);

  return `PERFIL COMPLETO DO CICLISTA:

• Nível de Fitness: ${FITNESS_LABELS[data.fitnessLevel] ?? data.fitnessLevel}
• Objetivo Principal: ${OBJETIVO_LABELS[data.objetivo] ?? data.objetivo}
• Dias de Treino Disponíveis: ${diasFormatados} (${data.diasPorSemana} dias por semana)

• Volume de Treino Actual: ${data.volumeAtual}
• Tipo de Ciclismo: ${TIPO_LABELS[data.tipoCiclismo] ?? data.tipoCiclismo}
• Equipamento Disponível: ${equipList.length > 0 ? equipList.join("; ") : "Sem equipamento específico (usa RPE com descrição observável)"}
• Idade: ${data.idade} anos
• Peso: ${data.peso} kg (proteína diária de referência: ${proteinaMin}g a ${proteinaMax}g/dia; carboidratos pré-treino: ${carbsPreMin}g a ${carbsPreMax}g)
• Sexo Biológico: ${data.sexoBiologico === "masculino" ? "Masculino" : "Feminino"}
• FCmáx estimada: ${220 - data.idade} bpm (usa este valor para calcular zonas de FC se o ciclista tiver monitor)
• Lesões / Limitações: ${data.lesoes?.trim() || "Nenhuma lesão ou limitação reportada"}
• Informação Adicional: ${data.informacaoAdicional?.trim() || "Sem informação adicional"}

LEMBRETES CRÍTICOS PARA ESTE PERFIL:
${data.fitnessLevel === "iniciante" ? "⚠️ INICIANTE: obrigatório mínimo 4 semanas de base aeróbica (Zona 1-2 apenas) antes de qualquer intensidade." : ""}
${data.fitnessLevel === "intermedio" ? "⚠️ INTERMÉDIO: obrigatório mínimo 3 semanas de base antes de intensidade." : ""}
- Duração das sessões deve variar por tipo: intervalos ≤60 min total; saída longa começa maior e cresce ~10-15 min/semana.
- Nutrição: usa os valores em gramas calculados acima (${proteinaMin}g-${proteinaMax}g proteína; ${carbsPreMin}g-${carbsPreMax}g carboidratos pré-treino).

Cria um plano de treino completo, detalhado e ultra-personalizado para este ciclista. Devolve APENAS o JSON válido, sem qualquer outro texto.`;
}

// ── Route handler ─────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 0. Rate limit — 3 plans per IP per hour
  const ip = getClientIp(req);
  const { allowed, retryAfterSecs } = checkRateLimit(ip);
  if (!allowed) {
    const minutes = Math.ceil(retryAfterSecs / 60);
    return NextResponse.json(
      { error: `Atingiste o limite de planos gerados por hora. Tenta novamente em ${minutes} minuto${minutes !== 1 ? "s" : ""}.` },
      { status: 429, headers: { "Retry-After": String(retryAfterSecs) } }
    );
  }

  try {
    // 1. Parse request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Pedido inválido. Certifica-te que os dados do formulário foram enviados correctamente." },
        { status: 400 }
      );
    }

    // 2. Validate with Zod — rejects bad data before hitting the AI
    const validation = formDataSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Dados do formulário inválidos. Por favor preenche o formulário novamente.",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    // 3. Get the AI client (throws if ANTHROPIC_API_KEY is missing)
    const anthropic = getAnthropicClient();

    // 4. Call Claude API
    const aiResponse = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildUserMessage(validation.data),
        },
      ],
    });

    // 5. Extract text content from the response
    const contentBlock = aiResponse.content[0];
    if (!contentBlock || contentBlock.type !== "text") {
      throw new Error("A IA devolveu uma resposta num formato inesperado.");
    }

    // 6. Parse the JSON — Claude may occasionally wrap it in ```json ... ```
    const rawText = contentBlock.text.trim();
    const jsonString = rawText.startsWith("```")
      ? rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")
      : rawText;

    let plano: unknown;
    try {
      plano = JSON.parse(jsonString);
    } catch {
      console.error(
        "[gerar-plano] Failed to parse AI JSON response. First 500 chars:",
        jsonString.slice(0, 500)
      );
      return NextResponse.json(
        {
          error: "A IA devolveu uma resposta que não conseguimos processar. Tenta novamente.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ plano });

  } catch (err: unknown) {
    console.error("[gerar-plano] Unhandled error:", err);

    // Friendly message for missing API key
    if (err instanceof Error && err.message.includes("ANTHROPIC_API_KEY")) {
      return NextResponse.json(
        {
          error: "O servidor não está configurado correctamente. Por favor contacta o suporte.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Ocorreu um erro ao gerar o teu plano. Verifica a tua ligação e tenta novamente.",
      },
      { status: 500 }
    );
  }
}
