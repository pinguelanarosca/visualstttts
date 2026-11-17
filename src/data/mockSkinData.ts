export type SurfaceView = 'overview' | 'hud' | 'popup' | 'options';
export type OptionsTabId = 'chaves' | 'agentes' | 'atalhos' | 'historico' | 'chatgpt';
export type ModalityId = 'tts' | 'stt' | 'lens';

export interface DictationTaskSkin {
  id: string;
  kind: 'Ditado' | 'Narração' | 'Lens';
  title: string;
  status: 'Gravando' | 'Concluído' | 'Pausado';
  origin: string;
  blocksSent: number;
  duration: string;
  previewText: string;
}

export interface AgentPersonaSkin {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  ttsModel: string;
  ttsVoice: string;
  ttsPrompt: string;
  sttModel: string;
  sttMode: string;
  sttPrompt: string;
  lensModel: string;
  lensMode: string;
  lensPrompt: string;
}

export const DEFAULT_TRANSCRIPTION_INSTRUCTIONS = `Transcreva fielmente a fala do usuário, priorizando português brasileiro.
Sua função é transcrever, não conversar, responder perguntas, traduzir ou completar pensamentos.
Preserve o significado, a ordem das palavras e as repetições realmente pronunciadas.
Utilize pontuação natural e conservadora.
Não introduza palavras, frases, interpretações ou suposições em outros idiomas que não estejam presentes na fala.`;

export const INITIAL_TASKS: DictationTaskSkin[] = [
  {
    id: 'task-1',
    kind: 'Ditado',
    title: 'Microfone',
    status: 'Gravando',
    origin: 'aba 1606667314',
    blocksSent: 0,
    duration: '00:14',
    previewText: 'Capturando fluxo de fala contínuo em tempo real no campo ativo...',
  },
  {
    id: 'task-2',
    kind: 'Ditado',
    title: 'Eu quero Eu ...',
    status: 'Concluído',
    origin: 'aba 1606667314',
    blocksSent: 12,
    duration: '00:28',
    previewText: 'Eu quero redesenhar a interface inteira com transparência e efeitos fluidos.',
  },
  {
    id: 'task-3',
    kind: 'Ditado',
    title: 'chanfro em t...',
    status: 'Concluído',
    origin: 'aba 1606667091',
    blocksSent: 7,
    duration: '00:19',
    previewText: 'Chanfro em todos os painéis flutuantes com borda especular suave.',
  },
  {
    id: 'task-4',
    kind: 'Ditado',
    title: 'Ah. Eu quero...',
    status: 'Concluído',
    origin: 'aba 1606666842',
    blocksSent: 5,
    duration: '00:11',
    previewText: 'Ah, eu quero manter todas as opções acessíveis sem poluição visual.',
  },
];

export const AGENT_PERSONAS: AgentPersonaSkin[] = [
  {
    id: 'dev',
    name: 'Assistente de Código & Dev',
    shortLabel: 'Assistente de Código & Dev — Fenrir',
    description:
      'Leitura técnica de código-fonte, erros e sintaxe; transcrição com termos de programação.',
    ttsModel: 'Gemini 3.8 Live',
    ttsVoice: 'Fenrir · WebSocket Live',
    ttsPrompt:
      'Você é um engenheiro de software sênior. Ao ler código ou stacktraces, verbalize a lógica, parâmetros e estruturas de controle de forma inteligível sem omitir detalhes críticos.',
    sttModel: 'Gemini 3.8 Live',
    sttMode: 'Ditado com as instruções da persona',
    sttPrompt:
      'Transcreva o áudio preservando convenções de programação (camelCase, snake_case), palavras-chave de linguagem e blocos de código com indentação natural.',
    lensModel: 'Gemini 3.5 Flash-Lite',
    lensMode: 'Interpretação da região selecionada',
    lensPrompt:
      'Analise o código, erro no console ou interface de desenvolvimento na tela e proponha a solução técnica.',
  },
  {
    id: 'editorial',
    name: 'Redator & Revisão Executiva',
    shortLabel: 'Redator & Revisão Executiva — Aoede',
    description:
      'Narração natural com pausas editoriais e ditado fluido para documentos e mensagens longas.',
    ttsModel: 'Gemini 3.8 Live',
    ttsVoice: 'Aoede · WebSocket Live',
    ttsPrompt:
      'Leia textos corporativos e artigos com ritmo claro, entonação equilibrada e pausas discretas em títulos e listas.',
    sttModel: 'Gemini 3.8 Live',
    sttMode: 'Ditado com pontuação editorial',
    sttPrompt:
      'Transcreva priorizando clareza gramatical em português brasileiro, removendo hesitações sem alterar a intenção original.',
    lensModel: 'Gemini 3.5 Flash-Lite',
    lensMode: 'Resumo visual contextual',
    lensPrompt:
      'Resuma o documento ou gráfico capturado na região selecionada destacando pontos de decisão.',
  },
  {
    id: 'bilingual',
    name: 'Pesquisador Bilíngue PT/EN',
    shortLabel: 'Pesquisador Bilíngue — Puck',
    description:
      'Alternância precisa entre português e termos técnicos em inglês durante leituras e ditados.',
    ttsModel: 'Gemini 3.8 Live',
    ttsVoice: 'Puck · WebSocket Live',
    ttsPrompt:
      'Pronuncie termos em inglês técnico com fonética natural mantendo a fluência principal em português brasileiro.',
    sttModel: 'Gemini 3.8 Live',
    sttMode: 'Transcrição mista PT-BR / EN-US',
    sttPrompt:
      'Mantenha anglicismos e termos acadêmicos em inglês sem traduzi-los automaticamente durante a transcrição.',
    lensModel: 'Gemini 3.5 Flash-Lite',
    lensMode: 'Leitura de papers e diagramas',
    lensPrompt:
      'Explique fórmulas, diagramas e trechos em inglês capturados na tela diretamente em português técnico.',
  },
];

export const KEYBOARD_SHORTCUTS_SKIN = [
  {
    id: 'toggle-stt',
    action: 'Iniciar / Parar Ditado no campo ativo',
    scope: 'Global no navegador',
    keys: ['Alt', 'Shift', 'D'],
  },
  {
    id: 'toggle-tts',
    action: 'Narrar texto selecionado (TTS)',
    scope: 'Página ativa',
    keys: ['Alt', 'Shift', 'L'],
  },
  {
    id: 'capture-lens',
    action: 'Capturar região da tela (Lens)',
    scope: 'Sobreposição visual',
    keys: ['Alt', 'Shift', 'V'],
  },
  {
    id: 'pause-playback',
    action: 'Pausar / Retomar Narração',
    scope: 'Player global',
    keys: ['Alt', 'Shift', 'P'],
  },
  {
    id: 'toggle-hud',
    action: 'Alternar modo compacto do HUD flutuante',
    scope: 'HUD na página',
    keys: ['Alt', 'Shift', 'H'],
  },
];

export const HISTORY_LOGS_SKIN = [
  {
    id: 'log-1',
    time: '05:50:12',
    type: 'STT' as const,
    agent: 'Assistente de Código & Dev',
    detail: 'Sessão Live iniciada · Silero 0.4% / TEN 14.7%',
    duration: '14s',
  },
  {
    id: 'log-2',
    time: '05:48:39',
    type: 'TTS' as const,
    agent: 'Assistente de Código & Dev',
    detail: 'Buffer PCM 5s pré-carregado · Voz Fenrir',
    duration: '42s',
  },
  {
    id: 'log-3',
    time: '05:45:03',
    type: 'Lens' as const,
    agent: 'Assistente de Código & Dev',
    detail: 'Região capturada · Gemini 3.5 Flash-Lite',
    duration: '2.1s',
  },
  {
    id: 'log-4',
    time: '05:41:18',
    type: 'STT' as const,
    agent: 'Assistente de Código & Dev',
    detail: 'Ditado concluído · 12 blocos entregues ao campo',
    duration: '28s',
  },
];
