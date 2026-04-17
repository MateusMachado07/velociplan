# VelociPlan

Plano de treino de ciclismo personalizado gerado por IA, entregue como PDF profissional.

**Site ao vivo:** [velociplan-n3f1.vercel.app](https://velociplan-n3f1.vercel.app)

## O que é isto?

Uma aplicação web que:
1. Recolhe dados do ciclista via formulário (nível, objetivos, horário, etc.)
2. Usa IA (Claude da Anthropic) para gerar um plano de treino personalizado
3. Mostra uma pré-visualização grátis
4. Cobra €9,99 via Stripe para descarregar o PDF completo

## Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior
- Uma conta [Anthropic](https://console.anthropic.com/) para a chave da API
- Uma conta [Stripe](https://stripe.com/) para pagamentos
- [Stripe CLI](https://stripe.com/docs/stripe-cli) para testar webhooks localmente

## Instalação e execução local

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copia o ficheiro de exemplo e preenche com as tuas chaves:

```bash
cp .env.example .env.local
```

Abre `.env.local` e preenche:
- `ANTHROPIC_API_KEY` — a tua chave da API do Claude (em https://console.anthropic.com/)
- `STRIPE_SECRET_KEY` — chave secreta do Stripe (começa com `sk_test_`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — chave pública do Stripe (começa com `pk_test_`)
- `STRIPE_WEBHOOK_SECRET` — ver passo 3 abaixo
- `NEXT_PUBLIC_APP_URL` — deixa como `http://localhost:3000`

### 3. Configurar webhooks do Stripe para desenvolvimento local

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

O comando acima vai imprimir um `STRIPE_WEBHOOK_SECRET` — copia-o para o `.env.local`.

### 4. Iniciar a aplicação

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) no browser.

## Estrutura do projeto

```
src/
├── app/
│   ├── page.tsx              # Página inicial (landing page)
│   ├── gerar/page.tsx        # Formulário multi-passo
│   ├── plano/page.tsx        # Pré-visualização do plano
│   ├── sucesso/page.tsx      # Página de sucesso após pagamento
│   └── api/
│       ├── gerar-plano/      # Chamada à API do Claude
│       ├── gerar-pdf/        # Geração do PDF com Puppeteer
│       └── stripe/
│           ├── checkout/     # Criar sessão de pagamento
│           └── webhook/      # Receber confirmação de pagamento
├── components/               # Componentes de UI reutilizáveis
├── lib/
│   ├── pdf.ts                # Geração do PDF (HTML → Puppeteer)
│   ├── stripe.ts             # Cliente do Stripe
│   ├── utils.ts              # Utilitários (cn para Tailwind)
│   └── validations.ts        # Schemas de validação (Zod)
└── types/
    └── index.ts              # Tipos TypeScript partilhados
```

## Variáveis de ambiente

| Variável | Descrição | Onde obter |
|---|---|---|
| `ANTHROPIC_API_KEY` | Chave da API do Claude | [console.anthropic.com](https://console.anthropic.com/) |
| `STRIPE_SECRET_KEY` | Chave secreta do Stripe | [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Chave pública do Stripe | Mesmo lugar |
| `STRIPE_WEBHOOK_SECRET` | Segredo para verificar webhooks | Stripe CLI ou dashboard |
| `PLAN_PRICE_EUR` | Preço do plano em EUR | Define tu (padrão: `9.99`) |
| `NEXT_PUBLIC_APP_URL` | URL da app | `http://localhost:3000` em dev, URL do Vercel em produção |

## Deploy (Vercel)

O projeto está publicado no Vercel com deploy automático a cada `git push`.

Variáveis de ambiente necessárias no Vercel: todas as acima, com `NEXT_PUBLIC_APP_URL` igual ao URL do Vercel.

## Stack técnica

- **Next.js 16** — framework frontend + backend
- **TypeScript** — tipagem estática
- **Tailwind CSS** — estilos
- **Anthropic Claude API** — geração do plano de treino por IA
- **Puppeteer + Chromium** — geração do PDF no servidor
- **Stripe** — pagamentos
- **Zod** — validação de formulários
