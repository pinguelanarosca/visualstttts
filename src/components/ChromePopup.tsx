import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  Minus,
  X,
  Square,
  Mic,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  Settings,
  Rewind,
  Play,
  Pause,
  FastForward,
  Plus,
  RotateCcw,
} from 'lucide-react';
import {
  AGENT_PERSONAS,
  INITIAL_TASKS,
  type DictationTaskSkin,
} from '../data/mockSkinData';
import { FluidWaveform } from './FluidWaveform';

interface ChromePopupProps {
  isRecording: boolean;
  onToggleRecording: () => void;
  isNarrating: boolean;
  onToggleNarrating: () => void;
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
  onOpenOptions: () => void;
  glassOpacity: number;
}

export function ChromePopup({
  isRecording,
  onToggleRecording,
  isNarrating,
  onToggleNarrating,
  selectedAgentId,
  onSelectAgent,
  onOpenOptions,
  glassOpacity,
}: ChromePopupProps) {
  const [tasks, setTasks] = useState<DictationTaskSkin[]>(INITIAL_TASKS);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'task-1': true,
  });
  const [volume, setVolume] = useState(85);
  const [speed, setSpeed] = useState(1.0);
  const [minimized, setMinimized] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const dismissTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addVisualTask = () => {
    const nextNum = tasks.length + 1;
    const newTask: DictationTaskSkin = {
      id: `task-new-${Date.now()}`,
      kind: 'Ditado',
      title: `Captura #${nextNum}`,
      status: 'Concluído',
      origin: 'aba 1606667314',
      blocksSent: 3,
      duration: '00:08',
      previewText: 'Nova entrada adicionada apenas para demonstração visual da fila.',
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const shellStyle = {
    background: `linear-gradient(170deg, rgba(20, 27, 44, ${glassOpacity}) 0%, rgba(10, 14, 24, ${Math.min(
      0.94,
      glassOpacity + 0.14
    )}) 100%)`,
  };

  const recordingCount = isRecording
    ? tasks.filter((t) => t.status === 'Gravando').length || 1
    : 0;

  return (
    <div
      style={shellStyle}
      className="glass-shell relative w-full max-w-[392px] overflow-hidden rounded-[22px] text-slate-100"
    >
      {/* Top specular highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />

      {/* Header matching image_254576b8.png */}
      <div className="flex items-center justify-between gap-2 px-4 pb-2.5 pt-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-amber-400/25 bg-amber-400/10 text-amber-300">
            <Zap className="h-3.5 w-3.5 fill-amber-300/30" />
          </span>
          <span className="font-display text-[15px] font-semibold tracking-tight text-white whitespace-nowrap">
            FalaMermo
          </span>
          <span className="text-slate-600" aria-hidden="true">
            ·
          </span>
          <button
            type="button"
            onClick={onToggleRecording}
            className={`font-mono-tabular text-[11px] font-semibold tracking-wide transition-colors whitespace-nowrap ${
              isRecording
                ? 'text-rose-300 hover:text-rose-200'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isRecording ? `${recordingCount} GRAVANDO` : 'PRONTO'}
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setMinimized((m) => !m)}
            aria-label={minimized ? 'Expandir pop-up' : 'Minimizar pop-up'}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.07] hover:text-white"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setMinimized(true)}
            aria-label="Fechar visualizador do pop-up"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.07] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onToggleRecording}
            aria-label={
              isRecording ? 'Interromper todas as gravações' : 'Iniciar gravação'
            }
            className={`ml-0.5 flex h-8 w-9 items-center justify-center rounded-xl border transition-all ${
              isRecording
                ? 'border-rose-400/45 bg-rose-500/25 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.22)] hover:bg-rose-500/35'
                : 'border-white/10 bg-white/[0.05] text-slate-300 hover:bg-white/[0.1]'
            }`}
          >
            <Square className="h-3.5 w-3.5 fill-current" />
          </button>
        </div>
      </div>

      {/* Telemetry VAD line */}
      <div className="border-b border-white/[0.07] px-4 pb-3">
        <p className="font-mono-tabular text-[11.5px] leading-relaxed text-slate-400">
          Silero {isRecording ? '0.4%' : '0.0%'} · TEN{' '}
          {isRecording ? '14.7%' : '0.0%'} · sem dupla confirmação ·
          recuperações 0
        </p>
      </div>

      <AnimatePresence initial={false}>
        {!minimized && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            {/* Tarefas globais + Agent Selector */}
            <div className="space-y-3 px-4 py-3.5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-semibold text-white">
                  Tarefas globais{' '}
                  <span className="font-mono-tabular text-slate-400">
                    ({tasks.length})
                  </span>
                </h3>
                {tasks.length < INITIAL_TASKS.length && (
                  <button
                    type="button"
                    onClick={() => setTasks(INITIAL_TASKS)}
                    className="flex items-center gap-1 text-[11px] font-medium text-sky-300 hover:text-sky-200"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Restaurar
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative min-w-0 flex-1">
                  <select
                    aria-label="Selecionar agente no pop-up"
                    value={selectedAgentId}
                    onChange={(e) => onSelectAgent(e.target.value)}
                    className="glass-input w-full appearance-none rounded-xl py-2.5 pl-3 pr-9 text-xs font-medium text-slate-100"
                  >
                    {AGENT_PERSONAS.map((agent) => (
                      <option
                        key={agent.id}
                        value={agent.id}
                        className="bg-[#0c1220] text-slate-100"
                      >
                        {agent.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>

                <button
                  type="button"
                  onClick={onOpenOptions}
                  aria-label="Abrir configurações da aplicação"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sky-300 transition-colors hover:border-sky-400/35 hover:bg-sky-500/15"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>

              {/* Tasks list */}
              <div className="space-y-2">
                {tasks.map((task) => {
                  const isActiveTask = task.status === 'Gravando' && isRecording;
                  const isExpanded = !!expandedIds[task.id];

                  return (
                    <div
                      key={task.id}
                      className={`overflow-hidden rounded-2xl border transition-colors ${
                        isActiveTask
                          ? 'border-sky-400/45 bg-sky-500/[0.08] shadow-[inset_0_1px_0_rgba(125,211,252,0.18)]'
                          : 'border-white/[0.08] bg-white/[0.025] hover:border-white/[0.14]'
                      }`}
                    >
                      {/* Row Header */}
                      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                        <div className="flex min-w-0 items-center gap-2">
                          <Mic
                            className={`h-3.5 w-3.5 shrink-0 ${
                              isActiveTask ? 'text-sky-300' : 'text-slate-400'
                            }`}
                          />
                          <span className="text-xs font-semibold text-white">
                            {task.kind}
                          </span>
                          <span className="truncate text-xs text-slate-400">
                            {task.title}
                          </span>
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                          <span
                            className={`mr-1 text-xs font-medium ${
                              isActiveTask ? 'text-sky-300' : 'text-slate-300'
                            }`}
                          >
                            {isActiveTask ? 'Gravando' : 'Concluído'}
                          </span>

                          <button
                            type="button"
                            onClick={() => toggleExpand(task.id)}
                            aria-label={
                              isExpanded
                                ? `Recolher ${task.title}`
                                : `Expandir ${task.title}`
                            }
                            aria-expanded={isExpanded}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-slate-300 transition-colors hover:bg-white/[0.1]"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={onOpenOptions}
                            aria-label={`Abrir detalhes de ${task.title}`}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-slate-300 transition-colors hover:bg-white/[0.1]"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => dismissTask(task.id)}
                            aria-label={`Remover ${task.title}`}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-slate-300 transition-colors hover:border-rose-400/30 hover:bg-rose-500/15 hover:text-rose-200"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{
                              duration: 0.18,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-2.5 border-t border-white/[0.06] px-3 pb-3 pt-2.5">
                              <div className="flex items-center justify-between text-[11.5px] text-slate-400">
                                <span>Origem: {task.origin}</span>
                                <span className="font-mono-tabular">
                                  {task.blocksSent} blocos enviados
                                </span>
                              </div>

                              {isActiveTask ? (
                                <div className="flex items-center gap-2.5">
                                  <div className="flex-1 rounded-lg bg-black/25 px-2 py-0.5">
                                    <FluidWaveform
                                      active={isRecording}
                                      tone="sky"
                                      height={24}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={onToggleRecording}
                                    aria-label="Parar captura desta tarefa"
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] text-slate-100 transition-colors hover:bg-rose-500/20 hover:text-rose-200"
                                  >
                                    <Square className="h-3 w-3 fill-current" />
                                  </button>
                                </div>
                              ) : (
                                <p className="text-xs leading-relaxed text-slate-300">
                                  {task.previewText}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Narration Transport Section */}
            <div className="space-y-3 border-t border-white/[0.08] bg-black/20 px-4 py-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-sky-300">
                  Narração · {isNarrating ? 'Reproduzindo' : 'Pausado'}
                </span>
                <span className="font-mono-tabular text-[11px] text-slate-400">
                  PCM 5s buffer
                </span>
              </div>

              {/* 4 Transport Buttons matching screenshot layout */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  aria-label="Retroceder 5 segundos"
                  className="flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-amber-300 transition-colors hover:bg-white/[0.09]"
                >
                  <Rewind className="h-4 w-4 fill-current" />
                </button>

                <button
                  type="button"
                  onClick={onToggleNarrating}
                  aria-label={
                    isNarrating ? 'Pausar narração' : 'Iniciar narração'
                  }
                  className="flex h-10 items-center justify-center rounded-xl border border-sky-400/50 bg-sky-500/80 text-white shadow-[0_6px_20px_rgba(14,165,233,0.3)] transition-all hover:bg-sky-500"
                >
                  {isNarrating ? (
                    <Pause className="h-4 w-4 fill-current" />
                  ) : (
                    <Play className="h-4 w-4 translate-x-[0.5px] fill-current" />
                  )}
                </button>

                <button
                  type="button"
                  aria-label="Avançar 5 segundos"
                  className="flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-amber-300 transition-colors hover:bg-white/[0.09]"
                >
                  <FastForward className="h-4 w-4 fill-current" />
                </button>

                <button
                  type="button"
                  onClick={addVisualTask}
                  aria-label="Adicionar entrada visual à fila"
                  className="flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-200 transition-colors hover:bg-white/[0.09]"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Volume & Speed Sliders */}
              <div className="grid grid-cols-2 gap-3 pt-0.5">
                <label className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200">Volume</span>
                    <span className="font-mono-tabular text-[11px] text-slate-400">
                      {volume}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="glass-slider w-full"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200">Velocidade</span>
                    <span className="font-mono-tabular text-[11px] text-slate-400">
                      {speed.toFixed(1)}×
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="glass-slider w-full"
                  />
                </label>
              </div>

              <p className="text-[11px] leading-relaxed text-slate-400">
                Setas: 5 s de PCM já recebido (até 60 s de retrocesso). Seek por
                palavra indisponível.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
