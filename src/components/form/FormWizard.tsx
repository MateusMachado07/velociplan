"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ── Form draft type ────────────────────────────────────────────────
// Uses strings instead of strict enums so unselected fields start as ""
type FormDraft = {
  fitnessLevel: string;
  objetivo: string;
  diasPorSemana: number;
  diasDisponiveis: string[];
  volumeAtual: string;
  tipoCiclismo: string;
  equipamento: {
    medidorPotencia: boolean;
    monitorFrequencia: boolean;
    treinadorIndoor: boolean;
  };
  idade: string;
  peso: string;
  sexoBiologico: string;
  lesoes: string;
  informacaoAdicional: string;
};

const INITIAL: FormDraft = {
  fitnessLevel: "",
  objetivo: "",
  diasPorSemana: 0,
  diasDisponiveis: [],
  volumeAtual: "",
  tipoCiclismo: "",
  equipamento: {
    medidorPotencia: false,
    monitorFrequencia: false,
    treinadorIndoor: false,
  },
  idade: "",
  peso: "",
  sexoBiologico: "",
  lesoes: "",
  informacaoAdicional: "",
};

const TOTAL_STEPS = 9;

const STEP_TITLES = [
  "Nível de Fitness",
  "Objetivo Principal",
  "Dias de Treino",
  "Volume de Treino Atual",
  "Tipo de Ciclismo",
  "Equipamento",
  "Informação Pessoal",
  "Lesões ou Limitações",
  "Informação Adicional",
];

// ── Reusable selection card ────────────────────────────────────────
function SelectionCard({
  label,
  description,
  icon,
  selected,
  onClick,
}: {
  label: string;
  description?: string;
  icon?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-xl border-2 transition-all",
        selected
          ? "border-brand-blue bg-brand-blue/10"
          : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
      )}
    >
      {icon && <span className="text-2xl mb-2 block">{icon}</span>}
      <p className="font-semibold text-white">{label}</p>
      {description && (
        <p className="text-sm text-gray-400 mt-1 leading-snug">{description}</p>
      )}
    </button>
  );
}

// ── Step prop type ─────────────────────────────────────────────────
type StepProps = {
  data: FormDraft;
  setData: React.Dispatch<React.SetStateAction<FormDraft>>;
};

// ══════════════════════════════════════════════════════════════════
// STEP 1 — Nível de Fitness
// ══════════════════════════════════════════════════════════════════
function StepFitnessLevel({ data, setData }: StepProps) {
  const options = [
    {
      value: "iniciante",
      label: "Iniciante",
      icon: "🌱",
      description: "Pratico ciclismo há menos de 1 ano ou raramente treino.",
    },
    {
      value: "intermedio",
      label: "Intermédio",
      icon: "🚴",
      description: "Treino regularmente há 1–3 anos e faço passeios com algum esforço.",
    },
    {
      value: "avancado",
      label: "Avançado",
      icon: "⚡",
      description: "Treino seriamente há mais de 3 anos e participo em eventos.",
    },
    {
      value: "competicao",
      label: "Competição",
      icon: "🏆",
      description: "Competidor ativo — corridas, cronos ou eventos federados.",
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((o) => (
        <SelectionCard
          key={o.value}
          icon={o.icon}
          label={o.label}
          description={o.description}
          selected={data.fitnessLevel === o.value}
          onClick={() =>
            setData((prev) => ({ ...prev, fitnessLevel: o.value }))
          }
        />
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// STEP 2 — Objetivo Principal
// ══════════════════════════════════════════════════════════════════
function StepObjetivo({ data, setData }: StepProps) {
  const options = [
    {
      value: "perder_peso",
      label: "Perder Peso",
      icon: "⚖️",
      description: "Quero queimar gordura e melhorar a composição corporal.",
    },
    {
      value: "resistencia",
      label: "Resistência",
      icon: "🛣️",
      description: "Quero aumentar o fôlego e conseguir distâncias maiores.",
    },
    {
      value: "preparacao_corrida",
      label: "Preparação para Prova",
      icon: "🏁",
      description: "Tenho uma prova ou evento específico para preparar.",
    },
    {
      value: "fitness_geral",
      label: "Fitness Geral",
      icon: "💪",
      description: "Quero melhorar a saúde e o bem-estar geral com ciclismo.",
    },
    {
      value: "velocidade",
      label: "Melhorar Velocidade",
      icon: "🚀",
      description: "Quero ser mais rápido e melhorar as minhas marcas.",
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((o) => (
        <SelectionCard
          key={o.value}
          icon={o.icon}
          label={o.label}
          description={o.description}
          selected={data.objetivo === o.value}
          onClick={() => setData((prev) => ({ ...prev, objetivo: o.value }))}
        />
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// STEP 3 — Dias de Treino
// ══════════════════════════════════════════════════════════════════
function StepDias({
  data,
  toggleDia,
}: {
  data: FormDraft;
  toggleDia: (dia: string) => void;
}) {
  const dias = [
    { value: "segunda", label: "Seg" },
    { value: "terca", label: "Ter" },
    { value: "quarta", label: "Qua" },
    { value: "quinta", label: "Qui" },
    { value: "sexta", label: "Sex" },
    { value: "sabado", label: "Sáb" },
    { value: "domingo", label: "Dom" },
  ];
  return (
    <div>
      <p className="text-gray-300 mb-5">
        Seleciona os dias em que normalmente consegues treinar:
      </p>
      <div className="flex flex-wrap gap-3 mb-5">
        {dias.map((d) => {
          const selected = data.diasDisponiveis.includes(d.value);
          return (
            <button
              key={d.value}
              type="button"
              onClick={() => toggleDia(d.value)}
              className={cn(
                "w-14 h-14 rounded-xl font-semibold text-sm border-2 transition-all",
                selected
                  ? "bg-brand-blue border-brand-blue text-white"
                  : "bg-white/5 border-white/10 text-gray-300 hover:border-white/30"
              )}
            >
              {d.label}
            </button>
          );
        })}
      </div>
      {data.diasDisponiveis.length > 0 ? (
        <p className="text-brand-blue-light text-sm font-medium">
          ✓ {data.diasDisponiveis.length} dia
          {data.diasDisponiveis.length !== 1 ? "s" : ""} selecionado
          {data.diasDisponiveis.length !== 1 ? "s" : ""}
        </p>
      ) : (
        <p className="text-gray-500 text-sm">
          Nenhum dia selecionado ainda.
        </p>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// STEP 4 — Volume Atual
// ══════════════════════════════════════════════════════════════════
function StepVolume({ data, setData }: StepProps) {
  return (
    <div>
      <p className="text-gray-300 mb-5">
        Quanto ciclismo fazes atualmente por semana? Podes indicar em
        quilómetros (km) ou em horas.
      </p>
      <input
        type="text"
        value={data.volumeAtual}
        onChange={(e) =>
          setData((prev) => ({ ...prev, volumeAtual: e.target.value }))
        }
        placeholder="Ex: 100 km por semana, ou 5 horas por semana"
        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-blue transition-colors"
      />
      <p className="text-gray-500 text-sm mt-3">
        Se ainda não treinas regularmente, escreve{" "}
        <span className="text-gray-400">&quot;Estou a começar do zero&quot;</span> ou algo semelhante.
      </p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// STEP 5 — Tipo de Ciclismo
// ══════════════════════════════════════════════════════════════════
function StepTipoCiclismo({ data, setData }: StepProps) {
  const options = [
    {
      value: "estrada",
      label: "Estrada",
      icon: "🛣️",
      description: "Bicicleta de estrada em asfalto.",
    },
    {
      value: "mtb",
      label: "MTB",
      icon: "⛰️",
      description: "Mountain bike em trilhos e terra.",
    },
    {
      value: "gravel",
      label: "Gravel",
      icon: "🌄",
      description: "Caminhos mistos — terra e asfalto.",
    },
    {
      value: "indoor",
      label: "Indoor",
      icon: "🏠",
      description: "Rolo ou bicicleta estática em casa.",
    },
    {
      value: "misto",
      label: "Misto",
      icon: "🔄",
      description: "Combino dois ou mais tipos de ciclismo.",
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((o) => (
        <SelectionCard
          key={o.value}
          icon={o.icon}
          label={o.label}
          description={o.description}
          selected={data.tipoCiclismo === o.value}
          onClick={() =>
            setData((prev) => ({ ...prev, tipoCiclismo: o.value }))
          }
        />
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// STEP 6 — Equipamento
// ══════════════════════════════════════════════════════════════════
function StepEquipamento({ data, setData }: StepProps) {
  type EquipKey = keyof FormDraft["equipamento"];

  const items: {
    key: EquipKey;
    label: string;
    icon: string;
    description: string;
  }[] = [
    {
      key: "medidorPotencia",
      label: "Medidor de Potência",
      icon: "⚡",
      description: "Permite treinar com zonas de potência em Watts.",
    },
    {
      key: "monitorFrequencia",
      label: "Monitor de Frequência Cardíaca",
      icon: "❤️",
      description: "Permite controlar zonas de frequência cardíaca.",
    },
    {
      key: "treinadorIndoor",
      label: "Bicicleta Estática / Rolo",
      icon: "🏠",
      description: "Podes treinar em casa independentemente do clima.",
    },
  ];

  function toggle(key: EquipKey) {
    setData((prev) => ({
      ...prev,
      equipamento: {
        ...prev.equipamento,
        [key]: !prev.equipamento[key],
      },
    }));
  }

  return (
    <div>
      <p className="text-gray-300 mb-5">
        Que equipamento tens disponível? Seleciona todos os que se aplicam.
        Este passo é opcional — podes deixar tudo por selecionar.
      </p>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => toggle(item.key)}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
              data.equipamento[item.key]
                ? "border-brand-blue bg-brand-blue/10"
                : "border-white/10 bg-white/5 hover:border-white/30"
            )}
          >
            <span className="text-2xl">{item.icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-white">{item.label}</p>
              <p className="text-sm text-gray-400">{item.description}</p>
            </div>
            {/* Checkmark circle */}
            <div
              className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                data.equipamento[item.key]
                  ? "border-brand-blue bg-brand-blue"
                  : "border-gray-600"
              )}
            >
              {data.equipamento[item.key] && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// STEP 7 — Informação Pessoal
// ══════════════════════════════════════════════════════════════════
function StepInfoPessoal({ data, setData }: StepProps) {
  return (
    <div className="flex flex-col gap-7">
      {/* Idade + Peso — side by side */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-200 mb-2 font-medium">Idade</label>
          <input
            type="number"
            value={data.idade}
            min={10}
            max={100}
            onChange={(e) =>
              setData((prev) => ({ ...prev, idade: e.target.value }))
            }
            placeholder="Ex: 35"
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-blue transition-colors"
          />
        </div>
        <div>
          <label className="block text-gray-200 mb-2 font-medium">
            Peso <span className="text-gray-500 font-normal">(kg)</span>
          </label>
          <input
            type="number"
            value={data.peso}
            min={30}
            max={250}
            onChange={(e) =>
              setData((prev) => ({ ...prev, peso: e.target.value }))
            }
            placeholder="Ex: 75"
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-blue transition-colors"
          />
        </div>
      </div>

      {/* Sexo biológico */}
      <div>
        <label className="block text-gray-200 mb-1 font-medium">
          Sexo Biológico
        </label>
        <p className="text-gray-500 text-xs mb-3">
          Usado apenas para calibração fisiológica do plano de treino.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "masculino", label: "Masculino", icon: "♂️" },
            { value: "feminino", label: "Feminino", icon: "♀️" },
          ].map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() =>
                setData((prev) => ({ ...prev, sexoBiologico: o.value }))
              }
              className={cn(
                "py-4 rounded-xl border-2 font-semibold transition-all flex flex-col items-center gap-1",
                data.sexoBiologico === o.value
                  ? "border-brand-blue bg-brand-blue/10 text-white"
                  : "border-white/10 bg-white/5 text-gray-300 hover:border-white/30"
              )}
            >
              <span className="text-2xl">{o.icon}</span>
              <span>{o.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// STEP 8 — Lesões ou Limitações
// ══════════════════════════════════════════════════════════════════
function StepLesoes({ data, setData }: StepProps) {
  return (
    <div>
      <p className="text-gray-300 mb-5">
        Tens alguma lesão, dor crónica ou limitação física que devemos ter em
        conta no teu plano de treino?
      </p>
      <textarea
        value={data.lesoes}
        onChange={(e) =>
          setData((prev) => ({ ...prev, lesoes: e.target.value }))
        }
        placeholder="Ex: Tenho dores no joelho esquerdo há 3 meses. Tive uma lesão no tendão de Aquiles. Sem lesões relevantes."
        rows={5}
        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-blue transition-colors resize-none"
      />
      <p className="text-gray-500 text-sm mt-2">
        Campo opcional. Se não tens lesões, deixa em branco ou escreve{" "}
        <span className="text-gray-400">&quot;Sem lesões&quot;</span>.
      </p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// STEP 9 — Informação Adicional (campo livre final)
// ══════════════════════════════════════════════════════════════════
function StepFinal({ data, setData }: StepProps) {
  return (
    <div>
      <p className="text-gray-300 mb-5">
        Há algo mais que queiras partilhar? Descreve a tua situação, objetivos
        específicos, ou qualquer contexto que ajude a personalizar o teu plano.
      </p>
      <textarea
        value={data.informacaoAdicional}
        onChange={(e) =>
          setData((prev) => ({
            ...prev,
            informacaoAdicional: e.target.value,
          }))
        }
        placeholder="Ex: Quero preparar a Volta a Portugal amador em setembro. Trabalho por turnos — alguns dias treino de manhã cedo. Prefiro treinos com intervalos curtos durante a semana e saídas longas ao fim de semana."
        rows={6}
        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-blue transition-colors resize-none"
      />
      <p className="text-gray-500 text-sm mt-2">
        Campo opcional. Quanto mais informação deres, mais personalizado será o
        teu plano.
      </p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MAIN WIZARD COMPONENT
// Manages state, navigation, progress bar, and validation
// ══════════════════════════════════════════════════════════════════
export default function FormWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormDraft>(INITIAL);
  const [error, setError] = useState("");

  // Toggle a training day on/off
  function toggleDia(dia: string) {
    setData((prev) => {
      const exists = prev.diasDisponiveis.includes(dia);
      const updated = exists
        ? prev.diasDisponiveis.filter((d) => d !== dia)
        : [...prev.diasDisponiveis, dia];
      return {
        ...prev,
        diasDisponiveis: updated,
        diasPorSemana: updated.length,
      };
    });
  }

  // Validate the current step — returns an error message or ""
  function validate(): string {
    switch (step) {
      case 1:
        if (!data.fitnessLevel)
          return "Por favor seleciona o teu nível de fitness.";
        return "";
      case 2:
        if (!data.objetivo)
          return "Por favor seleciona o teu objetivo principal.";
        return "";
      case 3:
        if (data.diasDisponiveis.length === 0)
          return "Por favor seleciona pelo menos um dia disponível para treinar.";
        return "";
      case 4:
        if (!data.volumeAtual.trim())
          return "Por favor indica o teu volume de treino atual.";
        return "";
      case 5:
        if (!data.tipoCiclismo)
          return "Por favor seleciona o tipo de ciclismo que praticas.";
        return "";
      case 6:
        return ""; // equipment is fully optional
      case 7:
        if (!data.idade || Number(data.idade) < 10 || Number(data.idade) > 100)
          return "Por favor indica uma idade válida (entre 10 e 100 anos).";
        if (!data.peso || Number(data.peso) < 30 || Number(data.peso) > 250)
          return "Por favor indica um peso válido (entre 30 e 250 kg).";
        if (!data.sexoBiologico)
          return "Por favor seleciona o sexo biológico.";
        return "";
      case 8:
      case 9:
        return ""; // both optional free-text fields
      default:
        return "";
    }
  }

  function handleNext() {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  }

  function handleBack() {
    setError("");
    setStep((s) => s - 1);
  }

  function handleSubmit() {
    // Store the complete form data in sessionStorage.
    // The /plano page reads this to call the AI API (Phase 3).
    const payload = {
      fitnessLevel: data.fitnessLevel,
      objetivo: data.objetivo,
      diasPorSemana: data.diasDisponiveis.length,
      diasDisponiveis: data.diasDisponiveis,
      volumeAtual: data.volumeAtual,
      tipoCiclismo: data.tipoCiclismo,
      equipamento: data.equipamento,
      idade: Number(data.idade),
      peso: Number(data.peso),
      sexoBiologico: data.sexoBiologico,
      lesoes: data.lesoes,
      informacaoAdicional: data.informacaoAdicional,
    };
    sessionStorage.setItem("velociplan_form", JSON.stringify(payload));
    router.push("/plano");
  }

  const progressPercent = Math.round((step / TOTAL_STEPS) * 100);

  return (
    <div className="min-h-screen bg-brand-navy flex flex-col">
      {/* ── Top navigation ── */}
      <nav className="border-b border-white/10 px-6 py-4 flex-shrink-0">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Image src="/logo.png" alt="VelociPlan" width={180} height={54} />
          <span className="text-sm text-gray-400">
            Passo {step} de {TOTAL_STEPS}
          </span>
        </div>
      </nav>

      {/* ── Progress bar ── */}
      <div className="h-1 bg-white/10 flex-shrink-0">
        <div
          className="h-1 bg-brand-blue transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-2xl">
          {/* Step label */}
          <p className="text-brand-blue text-xs font-bold mb-2 uppercase tracking-widest">
            Passo {step} de {TOTAL_STEPS}
          </p>

          {/* Step heading */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            {STEP_TITLES[step - 1]}
          </h1>

          {/* Step content — switches based on current step */}
          <div className="mb-6">
            {step === 1 && (
              <StepFitnessLevel data={data} setData={setData} />
            )}
            {step === 2 && <StepObjetivo data={data} setData={setData} />}
            {step === 3 && (
              <StepDias data={data} toggleDia={toggleDia} />
            )}
            {step === 4 && <StepVolume data={data} setData={setData} />}
            {step === 5 && (
              <StepTipoCiclismo data={data} setData={setData} />
            )}
            {step === 6 && (
              <StepEquipamento data={data} setData={setData} />
            )}
            {step === 7 && (
              <StepInfoPessoal data={data} setData={setData} />
            )}
            {step === 8 && <StepLesoes data={data} setData={setData} />}
            {step === 9 && <StepFinal data={data} setData={setData} />}
          </div>

          {/* Validation error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-3 px-6 rounded-xl border border-white/20 text-gray-300 hover:bg-white/5 transition-colors font-medium"
              >
                ← Anterior
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-3 px-6 rounded-xl bg-brand-blue hover:bg-brand-blue-dark text-white font-bold transition-colors shadow-lg shadow-brand-blue/20"
            >
              {step === TOTAL_STEPS ? "Gerar o Meu Plano →" : "Próximo →"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
