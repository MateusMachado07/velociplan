// POST /api/gerar-plano
// Receives the validated form data, builds a detailed prompt, calls Claude,
// and returns the structured training plan as JSON.

import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/ai";
import { formDataSchema, type FormDataInput } from "@/lib/validations";

// ── System prompt ─────────────────────────────────────────────────
// Instructs Claude to act as a professional cycling coach and return
// ONLY a valid JSON object matching our PlanoTreino type.
const SYSTEM_PROMPT = `És um treinador de ciclismo profissional português com mais de 20 anos de experiência a treinar ciclistas amadores e profissionais em Portugal. Todos os teus planos são altamente personalizados, baseados em princípios científicos de periodização do treino.

TAREFA: Cria um plano de treino de ciclismo completo, detalhado e personalizado com base no perfil do ciclista fornecido.

REGRAS CRÍTICAS — segue-as sem excepção:
1. Responde EXCLUSIVAMENTE com um objeto JSON válido. Sem markdown, sem \`\`\`json, sem texto antes ou depois. Apenas JSON puro e válido.
2. Todo o texto dentro do JSON deve estar em Português Europeu (pt-PT).
3. O plano deve ser ultra-personalizado — não genérico. Usa os dados do perfil para tomar decisões de treino específicas.
4. Usa APENAS os dias de treino disponíveis do ciclista. Todos os outros dias da semana são obrigatoriamente dias de descanso (descanso: true, sem campo "sessao").
5. Cada semana deve ter exactamente 7 dias: segunda-feira a domingo, por esta ordem.

ESTRUTURA JSON EXACTA A DEVOLVER:
{
  "titulo": "Plano de Treino [Objetivo resumido] — [X] Semanas",
  "duracao": <número inteiro de semanas>,
  "resumoPerfil": "<2-3 frases descrevendo o perfil do ciclista de forma personalizada>",
  "resumoPlano": "<parágrafo motivacional (4-6 frases) explicando a abordagem do plano, a progressão e o que o ciclista vai alcançar>",
  "semanas": [
    {
      "semana": <número da semana, começa em 1>,
      "foco": "<tema/foco da semana, ex: 'Base Aeróbica', 'Construção de Volume', 'Intensidade Progressiva', 'Recuperação Activa', 'Pico de Forma'>",
      "dias": [
        {
          "dia": "<nome completo do dia em pt-PT: 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'>",
          "descanso": <true se dia de descanso, false se dia de treino>,
          "sessao": {
            "tipo": "<tipo de treino: 'Endurance', 'Intervalos de Alta Intensidade', 'Recuperação Activa', 'Fartlek', 'Força e Cadência', 'Tempo (Limiar)', 'Sprint', 'Saída Longa'>",
            "duracao": "<duração total incluindo aquecimento e arrefecimento, ex: '1h 30min', '45 min', '2h'>",
            "zonaIntensidade": "<zona de intensidade principal: 'Zona 1 (Recuperação, <55% FCmáx)', 'Zona 2 (Aeróbico, 56-75% FCmáx)', 'Zona 3 (Tempo, 76-85% FCmáx)', 'Zona 4 (Limiar, 86-95% FCmáx)', 'Zona 5 (VO2máx, >95% FCmáx)' — adiciona RPE equivalente se sem monitor FC>",
            "instrucoes": "<descrição detalhada e específica do treino em 2-4 frases, incluindo séries/repetições se aplicável>",
            "aquecimento": "<protocolo de aquecimento específico de 5-15 min>",
            "arrefecimento": "<protocolo de arrefecimento específico de 5-10 min>"
          }
        }
      ]
    }
  ],
  "nutricao": "<guia de nutrição completo em 3-4 parágrafos, adaptado ao objetivo e à carga de treino do ciclista>",
  "recuperacao": "<guia de recuperação e descanso em 2-3 parágrafos com conselhos práticos>",
  "mensagemMotivacional": "<mensagem motivacional final, personalizada ao perfil e objectivos do ciclista — 1 parágrafo inspirador>"
}

DURAÇÃO RECOMENDADA DO PLANO:
- Perder peso → 8 semanas
- Resistência → 12 semanas
- Preparação para prova → 8-16 semanas (adapta ao contexto descrito)
- Fitness geral → 8 semanas
- Melhorar velocidade → 8 semanas

QUALIDADE DO PLANO:
- Aplica periodização progressiva: volume e intensidade aumentam gradualmente, com semanas de recuperação periódicas
- Distribui os treinos de forma inteligente (ex: não colocar dias intensos consecutivos)
- Se o ciclista tiver medidor de potência, inclui referências em %FTP. Se tiver monitor de FC, inclui zonas de FC. Se não tiver nenhum, usa RPE (1-10)
- Adapta o volume e intensidade ao nível de fitness declarado

REGRAS DE BREVIDADE (MUITO IMPORTANTE para não exceder o limite de resposta):
- Campo "instrucoes": máximo 2 frases curtas e directas
- Campo "aquecimento": máximo 1 frase
- Campo "arrefecimento": máximo 1 frase
- Campo "nutricao": máximo 2 parágrafos curtos
- Campo "recuperacao": máximo 1 parágrafo curto
- Campo "mensagemMotivacional": máximo 3 frases
- Campo "resumoPlano": máximo 3 frases`;

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
const DURACAO_LABELS: Record<string, string> = {
  "30min": "30 minutos",
  "1h": "1 hora",
  "1h30": "1 hora e 30 minutos",
  "2h_mais": "2 horas ou mais",
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

  return `PERFIL COMPLETO DO CICLISTA:

• Nível de Fitness: ${FITNESS_LABELS[data.fitnessLevel] ?? data.fitnessLevel}
• Objetivo Principal: ${OBJETIVO_LABELS[data.objetivo] ?? data.objetivo}
• Dias de Treino Disponíveis: ${diasFormatados} (${data.diasPorSemana} dias por semana)
• Duração Típica das Sessões: ${DURACAO_LABELS[data.duracaoSessao] ?? data.duracaoSessao}
• Volume de Treino Actual: ${data.volumeAtual}
• Tipo de Ciclismo: ${TIPO_LABELS[data.tipoCiclismo] ?? data.tipoCiclismo}
• Equipamento Disponível: ${equipList.length > 0 ? equipList.join("; ") : "Sem equipamento específico (usa RPE)"}
• Idade: ${data.idade} anos
• Sexo Biológico: ${data.sexoBiologico === "masculino" ? "Masculino" : "Feminino"}
• Lesões / Limitações: ${data.lesoes?.trim() || "Nenhuma lesão ou limitação reportada"}
• Informação Adicional: ${data.informacaoAdicional?.trim() || "Sem informação adicional"}

Cria um plano de treino completo, detalhado e ultra-personalizado para este ciclista. Recorda: devolve APENAS o JSON válido, sem qualquer outro texto.`;
}

// ── Route handler ─────────────────────────────────────────────────
export async function POST(req: NextRequest) {
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
