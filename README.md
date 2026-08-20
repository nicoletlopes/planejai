# Planej.ai

Aplicação web de planejamento financeiro pessoal. O usuário simula uma meta
(ex: uma viagem, um carro, um casamento), informando renda, custos fixos e
dívidas, e recebe:

- um diagnóstico financeiro gerado por IA, avaliando se a meta é viável no
  prazo informado;
- um chat para tirar dúvidas adicionais sobre o próprio plano;
- um histórico com todas as simulações já feitas.

> Projeto desenvolvido como parte do desafio **Educador Financeiro com IA**
> do [Santander Open Academy](https://www.dio.me/) em parceria com a
> [DIO](https://www.dio.me/), a partir do template criado pela instrutora em
> [digitalinnovationone/planejai](https://github.com/digitalinnovationone/planejai).

## Funcionalidades

- **Simulação guiada**: formulário em etapas (renda, custos fixos, dívidas,
  nome/custo/prazo da meta).
- **Diagnóstico financeiro por IA**: análise de viabilidade, sugestões de
  economia, renda extra e investimentos, gerada via API do Google Gemini.
- **Chat sobre a meta**: perguntas livres sobre o plano gerado, respondidas
  pela IA com o contexto da simulação.
- **Histórico de simulações**: lista de todas as simulações salvas, com
  exclusão e acesso rápido ao resultado de cada uma.
- **Tema claro/escuro**, com preferência salva entre sessões.

## Tecnologias

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) — build e dev server
- [Tailwind CSS v4](https://tailwindcss.com/) — estilização utilitária
- [React Router](https://reactrouter.com/) — roteamento
- [lucide-react](https://lucide.dev/) — ícones
- [react-loading-skeleton](https://github.com/dvtng/react-loading-skeleton) — estados de carregamento
- API do [Google Gemini](https://ai.google.dev/) — geração do diagnóstico e das respostas do chat

## Decisões de arquitetura

Algumas decisões tomadas ao longo do desenvolvimento, e o porquê:

- **Sem backend.** A aplicação é 100% client-side e chama a API do Gemini
  diretamente do navegador, usando uma chave configurada via variável de
  ambiente (`VITE_GEMINI_API_KEY`). Isso simplifica o projeto para fins de
  estudo, mas **expõe a chave no bundle do cliente** — não é uma abordagem
  adequada para produção, onde essa chamada deveria passar por um backend
  próprio.

- **Persistência parcial em `localStorage`.** Simulações e o diagnóstico
  gerado pela IA são salvos em `localStorage` (`useSimulationStorage`), o que
  permite revisitar uma simulação e vê-la no histórico depois de fechar o
  navegador. Já as **mensagens do chat existem só durante a sessão** (estado
  em memória, via `useChat`) — ao recarregar a página, a conversa é
  reiniciada. Essa foi uma escolha deliberada de simplicidade: persistir o
  chat exigiria estender o formato salvo de cada simulação, e o histórico de
  perguntas/respostas não é essencial para o objetivo principal do app (o
  diagnóstico).

- **Dois prompts, dois formatos de resposta.** A geração do diagnóstico
  (`buildAIPrompt`) pede à IA uma resposta em JSON estruturado, com um schema
  fixo (viabilidade, diagnóstico, sugestões, etc.), parseado em
  `services/aiService.ts`. Já o chat (`buildChatSystemInstruction`) pede
  texto simples e curto, sem markdown — formatos diferentes para
  necessidades diferentes, em vez de forçar as duas conversas no mesmo
  schema.

- **Mitigação de prompt injection no chat.** A pergunta do usuário é
  enviada separada das regras/persona da IA, usando o campo
  `systemInstruction` da API do Gemini (em vez de concatenar tudo numa
  única string). A instrução de sistema deixa explícito que ela tem
  prioridade sobre qualquer coisa dita na mensagem do usuário, restringe o
  assistente a responder apenas sobre o plano financeiro da pessoa e pede
  para ignorar tentativas de alterar a persona, as regras ou revelar o
  próprio texto de instrução. É uma mitigação, não uma garantia absoluta —
  como não há backend validando a pergunta antes de enviá-la (ver ponto
  acima), um usuário determinado ainda pode tentar contornar essas regras;
  o ganho real de uma defesa mais forte viria de mover essa chamada para
  um backend com moderação própria.

- **Scroll automático do chat baseado em dado, não em "já rodou".** Ao
  enviar uma pergunta, o card do insight rola sozinho até o fim da
  conversa. A primeira implementação usava uma ref "já é a primeira
  renderização?" para não rolar no carregamento inicial da página — mas
  isso quebrava sob `StrictMode` (o React monta/desmonta/remonta efeitos de
  propósito em desenvolvimento, o que consumia essa flag antes da hora e
  disparava o scroll mesmo sem nenhuma mensagem enviada). A solução final
  compara o tamanho atual da lista de mensagens com o tamanho anterior
  (guardado numa ref): só rola quando uma mensagem foi de fato adicionada,
  o que é verdade independente de quantas vezes o efeito rodar.

- **Componentes compartilhados extensíveis por props.** Em vez de duplicar
  variações de um mesmo componente, peças como `Button` e `Card` crescem por
  meio de props opcionais (ex: `Button` tem `iconSize`/`iconStrokeWidth` para
  customizar o ícone sem alterar o padrão dos demais botões; `Card` tem um
  modo `bare` que remove o "casco" visual quando precisa ser reaproveitado
  dentro de outro card, como no resumo financeiro da página de resultado).

- **Tema via CSS custom properties + cascade layers.** As cores do tema
  claro/escuro vivem em variáveis CSS (`src/styles/theme.css`), trocadas via
  atributo `data-theme` no `<html>` (`ThemeProvider`/`useTheme`), com a
  preferência do usuário salva em `localStorage`. Estilos base (como o
  stroke padrão dos ícones) ficam dentro de `@layer base`, para que
  utilitários do Tailwind sempre consigam sobrescrevê-los quando necessário.

## Estrutura de pastas

```
src/
├── components/
│   ├── layout/       # Layout raiz (Header + Outlet do roteador)
│   ├── shared/        # Componentes reutilizáveis (Button, Input, Card, Divider...)
│   └── features/      # Componentes específicos de cada área
│       ├── Simulation/        # Formulário guiado de simulação
│       ├── SimulationResults/ # Cards de resultado e insight da IA
│       ├── Insights/          # Conteúdo do diagnóstico, chat e estados de erro
│       └── Historic/          # Lista de simulações salvas
├── pages/            # Páginas roteadas (formulário, resultado, histórico)
├── hooks/             # Lógica de estado reutilizável (chat, insight, storage, tema)
├── data/              # Dados estáticos e construção dos prompts de IA
├── services/          # Integração com a API do Gemini
├── utils/             # Funções puras (moeda, cálculo de economia mensal)
├── context/           # Contexto de tema
└── styles/            # Variáveis de tema (CSS)
```

## Rodando localmente

Pré-requisitos: [Node.js](https://nodejs.org/) 20+ e [pnpm](https://pnpm.io/).

```bash
# instalar dependências
pnpm install

# configurar a chave da API do Gemini
cp .env.example .env.local
# edite .env.local e preencha VITE_GEMINI_API_KEY

# rodar em modo desenvolvimento
pnpm dev
```

## Scripts disponíveis

| Comando                        | Descrição                                 |
| ------------------------------ | ----------------------------------------- |
| `pnpm dev`                     | Sobe o servidor de desenvolvimento (Vite) |
| `pnpm build`                   | Type-check + build de produção            |
| `pnpm preview`                 | Serve o build de produção localmente      |
| `pnpm lint` / `lint:fix`       | Roda o ESLint                             |
| `pnpm format` / `format:check` | Roda o Prettier                           |

## Créditos

Desafio proposto pelo [Santander Open Academy](https://www.dio.me/) em
parceria com a [DIO](https://www.dio.me/), com base no template do curso
disponível em
[digitalinnovationone/planejai](https://github.com/digitalinnovationone/planejai).
