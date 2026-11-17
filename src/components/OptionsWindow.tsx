import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  ArrowUpRight,
  KeyRound,
  Bot,
  Keyboard,
  History,
  MessageSquareCode,
  Volume2,
  Mic,
  ScanEye,
  Play,
  Pause,
  Rewind,
  FastForward,
  Check,
  X,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import {
  AGENT_PERSONAS,
  DEFAULT_TRANSCRIPTION_INSTRUCTIONS,
  HISTORY_LOGS_SKIN,
  KEYBOARD_SHORTCUTS_SKIN,
  type ModalityId,
  type OptionsTabId,
} from '../data/mockSkinData';

interface OptionsWindowProps {
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
  isNarrating: boolean;
  onToggleNarrating: () => void;
  glassOpacity: number;
}

const TABS: { id: OptionsTabId; label: string; icon: typeof KeyRound }[] = [
  { id: 'chaves', label: 'Chaves Gemini', icon: KeyRound },
  { id: 'agentes', label: 'Agentes & Personas', icon: Bot },
  { id: 'atalhos', label: 'Atalhos', icon: Keyboard },
  { id: 'historico', label: 'Histórico & Logs', icon: History },
  { id: 'chatgpt', label: 'ChatGPT', icon: MessageSquareCode },
];

export function OptionsWindow({
  selectedAgentId,
  onSelectAgent,
  isNarrating,
  onToggleNarrating,
  glassOpacity,
}: OptionsWindowProps) {
  const [activeTab, setActiveTab] = useState<OptionsTabId>('agentes');
  const [volume, setVolume] = useState(85);
  const [speed, setSpeed] = useState(1.0);
  const [dictationInsertion, setDictationInsertion] = useState('realtime');
  const [vadMode, setVadMode] = useState('silero_ten');
  const [instructions, setInstructions] = useState(
    DEFAULT_TRANSCRIPTION_INSTRUCTIONS
  );
  const [language, setLanguage] = useState('pt-BR');
  const [vocabulary, setVocabulary] = useState('');
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [editingModality, setEditingModality] = useState<ModalityId | null>(
    null
  );
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Visual-only toggles for secondary tabs
  const [chatgptAutoInject, setChatgptAutoInject] = useState(true);
  const [chatgptEnterSend, setChatgptEnterSend] = useState(false);
  const [geminiFallback, setGeminiFallback] = useState(true);

  const activeAgent =
    AGENT_PERSONAS.find((a) => a.id === selectedAgentId) ?? AGENT_PERSONAS[0];

  const triggerFeedback = (message: string) => {
    setSaveFeedback(message);
    window.setTimeout(() => setSaveFeedback(null), 2600);
  };

  const shellStyle = {
    background: `linear-gradient(175deg, rgba(18, 25, 40, ${glassOpacity}) 0%, rgba(9, 13, 22, ${Math.min(
      0.92,
      glassOpacity + 0.12
    )}) 100%)`,
  };

  return (
    <div
      style={shellStyle}
      className="glass-shell relative w-full overflow-hidden rounded-[26px] text-slate-100"
    >
      {/* Top specular highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/35 to-transparent"
      />

      {/* Simulated Chrome Options Window Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] bg-white/[0.02] px-6 py-3.5">
        <div className="flex items-center gap-3">
          <span className="font-display text-base font-semibold tracking-tight text-white">
            EXT TTS STT
          </span>
          <span className="text-slate-600" aria-hidden="true">
            ·
          </span>
          <span className="text-xs font-medium text-slate-400">
            Configurações da Extensão
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowDiagnostics(true)}
          className="flex items-center gap-1.5 text-xs font-medium text-sky-300 transition-colors hover:text-sky-200 whitespace-nowrap"
        >
          <span>Central de Diagnóstico</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Main Options Content */}
      <div className="mx-auto max-w-5xl space-y-6 p-6 sm:p-8">
        {/* Top Narration Bar (from top of image_da81915d.png) */}
        <section className="glass-panel rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Retroceder 5 segundos na narração"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-amber-300 transition-colors hover:bg-white/[0.09]"
              >
                <Rewind className="h-4 w-4 fill-current" />
              </button>
              <button
                type="button"
                onClick={onToggleNarrating}
                aria-label={
                  isNarrating ? 'Pausar narração' : 'Reproduzir narração'
                }
                className="flex h-9 items-center gap-2 rounded-xl border border-sky-400/45 bg-sky-500/80 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-sky-500"
              >
                {isNarrating ? (
                  <>
                    <Pause className="h-3.5 w-3.5 fill-current" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Narração</span>
                  </>
                )}
              </button>
              <button
                type="button"
                aria-label="Avançar 5 segundos na narração"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-amber-300 transition-colors hover:bg-white/[0.09]"
              >
                <FastForward className="h-4 w-4 fill-current" />
              </button>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 md:max-w-xl">
              <label className="flex items-center gap-3">
                <span className="w-14 shrink-0 text-xs font-medium text-slate-200">
                  Volume
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="glass-slider flex-1"
                />
                <span className="font-mono-tabular w-9 text-right text-xs text-slate-400">
                  {volume}%
                </span>
              </label>

              <label className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-xs font-medium text-slate-200">
                  Velocidade
                </span>
                <input
                  type="range"
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="glass-slider flex-1"
                />
                <span className="font-mono-tabular w-9 text-right text-xs text-slate-400">
                  {speed.toFixed(1)}×
                </span>
              </label>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Selecione uma narração TTS para navegar. Setas: 5 s de PCM já
            recebido (até 60 s de retrocesso). Seek por palavra indisponível.
          </p>
        </section>

        {/* Inserção do ditado + Detector de voz */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section className="glass-panel rounded-2xl p-5">
            <label
              htmlFor="dictation-insertion"
              className="block font-display text-sm font-semibold text-white"
            >
              Inserção do ditado
            </label>
            <div className="relative mt-3">
              <select
                id="dictation-insertion"
                value={dictationInsertion}
                onChange={(e) => setDictationInsertion(e.target.value)}
                className="glass-input w-full appearance-none rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-slate-100"
              >
                <option value="realtime" className="bg-[#0c1220]">
                  Em tempo real
                </option>
                <option value="on_finish" className="bg-[#0c1220]">
                  Ao finalizar (com transformação do agente)
                </option>
                <option value="floating_review" className="bg-[#0c1220]">
                  Revisão flutuante antes de inserir
                </option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Usa exclusivamente o campo original. Resultados provisórios podem
              mudar; edições manuais interrompem a inserção automática para
              proteger seu texto. Em tempo real suspende a transformação do
              agente; Ao finalizar restaura sua preferência.
            </p>
          </section>

          <section className="glass-panel rounded-2xl p-5">
            <label
              htmlFor="vad-detector"
              className="block font-display text-sm font-semibold text-white"
            >
              Detector de voz do ditado no campo
            </label>
            <div className="relative mt-3">
              <select
                id="vad-detector"
                value={vadMode}
                onChange={(e) => setVadMode(e.target.value)}
                className="glass-input w-full appearance-none rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-slate-100"
              >
                <option value="silero_ten" className="bg-[#0c1220]">
                  Silero + TEN (dupla confirmação)
                </option>
                <option value="silero_only" className="bg-[#0c1220]">
                  Somente Silero VAD
                </option>
                <option value="ten_only" className="bg-[#0c1220]">
                  Somente TEN VAD
                </option>
                <option value="continuous" className="bg-[#0c1220]">
                  Captura contínua (sem corte automático)
                </option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Início de fala exige Silero ≥ 50% e TEN ≥ 50% em janelas
              temporalmente correlacionadas. Falhas recuperam o detector com PCM
              em buffer.
            </p>
          </section>
        </div>

        {/* Reconhecimento STT */}
        <section className="glass-panel space-y-5 rounded-2xl p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-semibold text-white">
                Reconhecimento STT
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Preferências globais para os próximos ditados, em todos os
                agentes.
              </p>
            </div>
            <AnimatePresence>
              {saveFeedback && (
                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-400/35 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-200"
                >
                  <Check className="h-3.5 w-3.5" />
                  {saveFeedback}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="stt-instructions"
              className="block text-xs font-medium text-slate-200"
            >
              Instruções de transcrição
            </label>
            <textarea
              id="stt-instructions"
              rows={5}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="glass-input w-full resize-y rounded-xl p-3.5 text-sm leading-relaxed text-slate-100"
            />
            <p className="text-xs text-slate-400">
              O texto orienta a sessão Live. O reconhecimento de fala tem
              parâmetros próprios e o Gemini pode ignorar as instruções ao
              transcrever a entrada.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="stt-language"
                className="block text-xs font-medium text-slate-200"
              >
                Idioma preferencial
              </label>
              <div className="relative">
                <select
                  id="stt-language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="glass-input w-full appearance-none rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-slate-100"
                >
                  <option value="pt-BR" className="bg-[#0c1220]">
                    Português (Brasil)
                  </option>
                  <option value="en-US" className="bg-[#0c1220]">
                    Inglês (EUA)
                  </option>
                  <option value="es-ES" className="bg-[#0c1220]">
                    Espanhol
                  </option>
                  <option value="auto" className="bg-[#0c1220]">
                    Detecção automática
                  </option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="stt-vocab"
                className="block text-xs font-medium text-slate-200"
              >
                Vocabulário personalizado
              </label>
              <textarea
                id="stt-vocab"
                rows={3}
                value={vocabulary}
                onChange={(e) => setVocabulary(e.target.value)}
                placeholder="Ex.: FalaMermo, Silero, camelCase, WebSocket..."
                className="glass-input w-full resize-y rounded-xl p-3 text-sm text-slate-100 placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs text-slate-400">
            <p>
              Uma expressão por linha, até 1.000 termos. Inclua nomes próprios,
              siglas e termos técnicos.
            </p>
            <p>
              Gemini 3.8 Live (modelo no editor) aceita dica de idioma e aceita
              vocabulário personalizado. Cada modelo de fallback usa os campos
              que suporta.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() =>
                triggerFeedback('Preferências aplicadas na visualização')
              }
              className="rounded-xl border border-emerald-400/40 bg-emerald-500/80 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-500"
            >
              Salvar reconhecimento
            </button>
            <button
              type="button"
              onClick={() => {
                setInstructions(DEFAULT_TRANSCRIPTION_INSTRUCTIONS);
                setLanguage('pt-BR');
                setVocabulary('');
                triggerFeedback('Padrão visual restaurado');
              }}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-white/[0.09]"
            >
              Restaurar padrão
            </button>
          </div>
        </section>

        {/* Tabs Navigation (5 tabs exact from screenshots) */}
        <div className="border-b border-white/[0.08]">
          <nav
            aria-label="Seções de configuração"
            className="-mb-px flex flex-wrap gap-1.5 sm:gap-2"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 rounded-t-xl px-3.5 py-2.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 ${
                      isActive ? 'text-sky-300' : 'text-slate-500'
                    }`}
                  />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="options-tab-underline"
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-sky-400"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Tab Viewport */}
        <AnimatePresence mode="wait">
          {activeTab === 'agentes' && (
            <motion.div
              key="agentes"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              {/* Agentes e personas header bar */}
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="font-display text-lg font-semibold text-white">
                    Agentes e personas
                  </h2>
                  <p className="text-xs text-slate-400">
                    Escolha o agente ativo e personalize cada modalidade.
                  </p>
                </div>

                <div className="flex flex-wrap items-end gap-2.5">
                  <div
                    aria-hidden="true"
                    className="flex h-[34px] w-[34px] items-center justify-center rounded-xl border border-emerald-400/35 bg-emerald-500/20 font-display text-xs font-bold text-emerald-200"
                  >
                    AS
                  </div>

                  <div className="min-w-[230px]">
                    <span className="mb-1 block text-[11px] text-slate-400">
                      Agente ativo no navegador
                    </span>
                    <div className="relative">
                      <select
                        aria-label="Agente ativo no navegador"
                        value={activeAgent.id}
                        onChange={(e) => onSelectAgent(e.target.value)}
                        className="glass-input w-full appearance-none rounded-xl py-2 pl-3 pr-8 text-xs font-medium text-slate-100"
                      >
                        {AGENT_PERSONAS.map((agent) => (
                          <option
                            key={agent.id}
                            value={agent.id}
                            className="bg-[#0c1220]"
                          >
                            {agent.shortLabel}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectAgent('dev');
                      triggerFeedback('Persona padrão selecionada');
                    }}
                    className="flex h-[34px] items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs font-medium text-slate-300 transition-colors hover:bg-white/[0.09] hover:text-white"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>De fábrica</span>
                  </button>
                </div>
              </div>

              {/* 3 Modality Cards: TTS, STT, Lens */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* TTS Card */}
                <article className="glass-panel flex flex-col justify-between rounded-2xl p-5 transition-colors hover:border-sky-400/30">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-500/15 text-sky-300">
                        <Volume2 className="h-5 w-5" />
                      </div>
                      <span className="font-mono-tabular text-[11px] font-semibold tracking-wider text-sky-300/90">
                        LEITURA
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-lg font-semibold text-white">
                        TTS
                      </h3>
                      <p className="text-xs text-slate-400">Texto em voz</p>
                    </div>

                    <div className="space-y-1.5 border-t border-white/[0.06] pt-3">
                      <p className="text-xs font-semibold text-slate-100">
                        {activeAgent.name}
                      </p>
                      <p className="text-xs leading-relaxed text-slate-400">
                        {activeAgent.description}
                      </p>
                    </div>

                    <div className="space-y-1 font-mono-tabular text-[11.5px]">
                      <p className="text-sky-300">{activeAgent.ttsModel}</p>
                      <p className="text-slate-400">{activeAgent.ttsVoice}</p>
                    </div>

                    <p className="line-clamp-3 text-xs leading-relaxed text-slate-300">
                      {activeAgent.ttsPrompt}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditingModality('tts')}
                    className="mt-5 flex w-full items-center justify-between border-t border-white/[0.06] pt-3.5 text-xs font-medium text-sky-300 transition-colors hover:text-sky-200"
                  >
                    <span>Personalizar voz e narração</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </article>

                {/* STT Card */}
                <article className="glass-panel flex flex-col justify-between rounded-2xl p-5 transition-colors hover:border-emerald-400/30">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-500/15 text-emerald-300">
                        <Mic className="h-5 w-5" />
                      </div>
                      <span className="font-mono-tabular text-[11px] font-semibold tracking-wider text-emerald-300/90">
                        DITADO
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-lg font-semibold text-white">
                        STT
                      </h3>
                      <p className="text-xs text-slate-400">Voz em texto</p>
                    </div>

                    <div className="space-y-1.5 border-t border-white/[0.06] pt-3">
                      <p className="text-xs font-semibold text-slate-100">
                        {activeAgent.name}
                      </p>
                      <p className="text-xs leading-relaxed text-slate-400">
                        {activeAgent.description}
                      </p>
                    </div>

                    <div className="space-y-1 font-mono-tabular text-[11.5px]">
                      <p className="text-emerald-300">{activeAgent.sttModel}</p>
                      <p className="text-slate-400">{activeAgent.sttMode}</p>
                    </div>

                    <p className="line-clamp-3 text-xs leading-relaxed text-slate-300">
                      {activeAgent.sttPrompt}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditingModality('stt')}
                    className="mt-5 flex w-full items-center justify-between border-t border-white/[0.06] pt-3.5 text-xs font-medium text-emerald-300 transition-colors hover:text-emerald-200"
                  >
                    <span>Personalizar transcrição</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </article>

                {/* Lens Card */}
                <article className="glass-panel flex flex-col justify-between rounded-2xl p-5 transition-colors hover:border-indigo-400/30">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/30 bg-indigo-500/15 text-indigo-300">
                        <ScanEye className="h-5 w-5" />
                      </div>
                      <span className="font-mono-tabular text-[11px] font-semibold tracking-wider text-indigo-300/90">
                        VISÃO
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-lg font-semibold text-white">
                        Lens
                      </h3>
                      <p className="text-xs text-slate-400">Tela em contexto</p>
                    </div>

                    <div className="space-y-1.5 border-t border-white/[0.06] pt-3">
                      <p className="text-xs font-semibold text-slate-100">
                        {activeAgent.name}
                      </p>
                      <p className="text-xs leading-relaxed text-slate-400">
                        {activeAgent.description}
                      </p>
                    </div>

                    <div className="space-y-1 font-mono-tabular text-[11.5px]">
                      <p className="text-indigo-300">{activeAgent.lensModel}</p>
                      <p className="text-slate-400">{activeAgent.lensMode}</p>
                    </div>

                    <p className="line-clamp-3 text-xs leading-relaxed text-slate-300">
                      {activeAgent.lensPrompt}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditingModality('lens')}
                    className="mt-5 flex w-full items-center justify-between border-t border-white/[0.06] pt-3.5 text-xs font-medium text-indigo-300 transition-colors hover:text-indigo-200"
                  >
                    <span>Personalizar interpretação</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </article>
              </div>
            </motion.div>
          )}

          {activeTab === 'chaves' && (
            <motion.div
              key="chaves"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="glass-panel space-y-4 rounded-2xl p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-base font-semibold text-white">
                    Chaves Gemini
                  </h3>
                  <p className="text-xs text-slate-400">
                    Carcaça visual do gerenciador de credenciais e fallback de
                    modelos.
                  </p>
                </div>
                <span className="font-mono-tabular text-xs text-slate-400">
                  Somente layout visual
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-xs font-medium text-slate-200">
                    Chave principal (placeholder visual)
                  </span>
                  <input
                    type="password"
                    readOnly
                    value="••••••••••••••••••••••••••••"
                    className="glass-input w-full rounded-xl px-3.5 py-2.5 font-mono-tabular text-xs text-slate-300"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-medium text-slate-200">
                    Ordem de fallback
                  </span>
                  <input
                    type="text"
                    readOnly
                    value="Gemini 3.8 Live → Gemini 3.5 Flash-Lite"
                    className="glass-input w-full rounded-xl px-3.5 py-2.5 font-mono-tabular text-xs text-slate-300"
                  />
                </label>
              </div>

              <label className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-xs text-slate-200">
                <span>Alternar automaticamente para fallback em caso de limite</span>
                <input
                  type="checkbox"
                  checked={geminiFallback}
                  onChange={(e) => setGeminiFallback(e.target.checked)}
                  className="h-4 w-4 accent-sky-400"
                />
              </label>
            </motion.div>
          )}

          {activeTab === 'atalhos' && (
            <motion.div
              key="atalhos"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="glass-panel overflow-hidden rounded-2xl"
            >
              <div className="border-b border-white/[0.07] px-5 py-4">
                <h3 className="font-display text-base font-semibold text-white">
                  Atalhos do teclado
                </h3>
                <p className="text-xs text-slate-400">
                  Mapeamento visual de comandos rápidos para HUD, Ditado,
                  Narração e Lens.
                </p>
              </div>
              <div className="divide-y divide-white/[0.06]">
                {KEYBOARD_SHORTCUTS_SKIN.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
                  >
                    <div>
                      <p className="text-xs font-medium text-slate-100">
                        {item.action}
                      </p>
                      <p className="text-[11px] text-slate-400">{item.scope}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {item.keys.map((k) => (
                        <kbd
                          key={k}
                          className="font-mono-tabular rounded-lg border border-white/15 bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-slate-200"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'historico' && (
            <motion.div
              key="historico"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="glass-panel overflow-hidden rounded-2xl"
            >
              <div className="border-b border-white/[0.07] px-5 py-4">
                <h3 className="font-display text-base font-semibold text-white">
                  Histórico & Logs
                </h3>
                <p className="text-xs text-slate-400">
                  Registro visual estático de sessões recentes de STT, TTS e
                  Lens.
                </p>
              </div>
              <div className="divide-y divide-white/[0.06]">
                {HISTORY_LOGS_SKIN.map((row) => (
                  <div
                    key={row.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono-tabular text-slate-400">
                        {row.time}
                      </span>
                      <span className="font-mono-tabular font-semibold text-sky-300">
                        {row.type}
                      </span>
                      <span className="text-slate-200">{row.detail}</span>
                    </div>
                    <span className="font-mono-tabular text-slate-400">
                      {row.duration}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'chatgpt' && (
            <motion.div
              key="chatgpt"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="glass-panel space-y-4 rounded-2xl p-6"
            >
              <div>
                <h3 className="font-display text-base font-semibold text-white">
                  Integração visual ChatGPT
                </h3>
                <p className="text-xs text-slate-400">
                  Controles visuais para injeção do botão de ditado e leitura na
                  interface web do ChatGPT.
                </p>
              </div>
              <div className="space-y-2.5">
                <label className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-xs text-slate-200">
                  <span>Exibir gatilho flutuante ao lado do campo de prompt</span>
                  <input
                    type="checkbox"
                    checked={chatgptAutoInject}
                    onChange={(e) => setChatgptAutoInject(e.target.checked)}
                    className="h-4 w-4 accent-sky-400"
                  />
                </label>
                <label className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-xs text-slate-200">
                  <span>Enviar mensagem automaticamente ao concluir ditado</span>
                  <input
                    type="checkbox"
                    checked={chatgptEnterSend}
                    onChange={(e) => setChatgptEnterSend(e.target.checked)}
                    className="h-4 w-4 accent-sky-400"
                  />
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Visual Slide-Over Drawer for Modality Personalization */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {editingModality && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm"
                onClick={() => setEditingModality(null)}
              >
                <motion.div
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 40, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="glass-shell h-full w-full max-w-md space-y-5 overflow-y-auto p-6"
                >
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                    <div className="flex items-center gap-2.5">
                      <SlidersHorizontal className="h-4 w-4 text-sky-300" />
                      <h3 className="font-display text-base font-semibold text-white">
                        Personalizar{' '}
                        {editingModality === 'tts'
                          ? 'Voz e Narração (TTS)'
                          : editingModality === 'stt'
                            ? 'Transcrição (STT)'
                            : 'Interpretação (Lens)'}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingModality(null)}
                      aria-label="Fechar painel de personalização"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-slate-300 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <span className="text-slate-400">Persona selecionada</span>
                      <p className="mt-0.5 font-semibold text-white">
                        {activeAgent.name}
                      </p>
                    </div>

                    <label className="block space-y-1.5">
                      <span className="font-medium text-slate-200">
                        Modelo configurado
                      </span>
                      <input
                        type="text"
                        readOnly
                        value={
                          editingModality === 'tts'
                            ? activeAgent.ttsModel
                            : editingModality === 'stt'
                              ? activeAgent.sttModel
                              : activeAgent.lensModel
                        }
                        className="glass-input w-full rounded-xl px-3.5 py-2.5 font-mono-tabular text-slate-200"
                      />
                    </label>

                    <label className="block space-y-1.5">
                      <span className="font-medium text-slate-200">
                        Instruções da modalidade (visualização)
                      </span>
                      <textarea
                        key={`${activeAgent.id}-${editingModality}`}
                        rows={6}
                        defaultValue={
                          editingModality === 'tts'
                            ? activeAgent.ttsPrompt
                            : editingModality === 'stt'
                              ? activeAgent.sttPrompt
                              : activeAgent.lensPrompt
                        }
                        className="glass-input w-full rounded-xl p-3.5 leading-relaxed text-slate-100"
                      />
                    </label>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingModality(null)}
                        className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/[0.1]"
                      >
                        Fechar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingModality(null);
                          triggerFeedback(
                            'Visualização da modalidade atualizada'
                          );
                        }}
                        className="rounded-xl border border-sky-400/45 bg-sky-500/80 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-500"
                      >
                        Aplicar na carcaça
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* Visual Modal for Central de Diagnóstico */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {showDiagnostics && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                onClick={() => setShowDiagnostics(false)}
              >
                <motion.div
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="glass-shell w-full max-w-lg space-y-4 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <h3 className="font-display text-base font-semibold text-white">
                      Central de Diagnóstico (Shell Visual)
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowDiagnostics(false)}
                      aria-label="Fechar diagnóstico"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-slate-300 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 font-mono-tabular text-xs">
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
                      <span className="text-slate-400">VAD Silero</span>
                      <p className="mt-1 text-sm font-semibold text-white">
                        0.4%
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
                      <span className="text-slate-400">VAD TEN</span>
                      <p className="mt-1 text-sm font-semibold text-white">
                        14.7%
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
                      <span className="text-slate-400">Recuperações PCM</span>
                      <p className="mt-1 text-sm font-semibold text-white">0</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
                      <span className="text-slate-400">WebSocket Live</span>
                      <p className="mt-1 text-sm font-semibold text-sky-300">
                        Protótipo UI
                      </p>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-400">
                    Esta janela representa exclusivamente o redesenho visual da
                    Central de Diagnóstico, sem telemetria real ou chamadas de
                    rede.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
