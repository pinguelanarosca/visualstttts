import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  Square,
  Play,
  Pause,
  ScanEye,
  Maximize2,
  Minimize2,
  Settings,
  Volume2,
  ChevronDown,
  Zap,
} from 'lucide-react';
import { AGENT_PERSONAS } from '../data/mockSkinData';
import { FluidWaveform } from './FluidWaveform';

interface GlassHudProps {
  isRecording: boolean;
  onToggleRecording: () => void;
  isNarrating: boolean;
  onToggleNarrating: () => void;
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
  onOpenOptions: () => void;
  glassOpacity: number;
}

export function GlassHud({
  isRecording,
  onToggleRecording,
  isNarrating,
  onToggleNarrating,
  selectedAgentId,
  onSelectAgent,
  onOpenOptions,
  glassOpacity,
}: GlassHudProps) {
  const [expanded, setExpanded] = useState(true);
  const [lensActive, setLensActive] = useState(false);

  const activeAgent =
    AGENT_PERSONAS.find((a) => a.id === selectedAgentId) ?? AGENT_PERSONAS[0];

  const shellStyle = {
    background: `linear-gradient(160deg, rgba(20, 28, 46, ${glassOpacity}) 0%, rgba(10, 15, 26, ${Math.min(
      0.92,
      glassOpacity + 0.1
    )}) 100%)`,
  };

  return (
    <motion.div
      layout
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      style={shellStyle}
      className="glass-shell relative w-full max-w-[472px] overflow-hidden rounded-2xl text-slate-100"
    >
      {/* Subtle fluid specular sheen across top edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/45 to-transparent"
      />

      {/* Compact Top Bar of the Floating HUD */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-colors ${
              isRecording
                ? 'border-rose-400/40 bg-rose-500/15 text-rose-300'
                : 'border-sky-400/30 bg-sky-500/15 text-sky-300'
            }`}
          >
            <Zap className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-semibold tracking-tight text-white">
                FalaMermo
              </span>
              <span className="text-slate-500" aria-hidden="true">
                ·
              </span>
              <span
                className={`font-mono-tabular whitespace-nowrap text-xs font-medium ${
                  isRecording ? 'text-rose-300' : 'text-sky-300'
                }`}
              >
                {isRecording ? '1 Gravando' : 'Em espera'}
              </span>
            </div>
            <p className="font-mono-tabular truncate text-[11px] text-slate-400">
              Silero {isRecording ? '0.4%' : '0.0%'} · TEN{' '}
              {isRecording ? '14.7%' : '0.0%'} · rec. 0
            </p>
          </div>
        </div>

        {/* HUD Quick Transport Controls */}
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleRecording}
            aria-label={isRecording ? 'Parar ditado no HUD' : 'Iniciar ditado no HUD'}
            className={`flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-medium whitespace-nowrap transition-all ${
              isRecording
                ? 'border-rose-400/45 bg-rose-500/20 text-rose-100 hover:bg-rose-500/30'
                : 'border-sky-400/35 bg-sky-500/20 text-sky-100 hover:bg-sky-500/30'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="h-3.5 w-3.5 fill-current" />
                <span>Parar</span>
              </>
            ) : (
              <>
                <Mic className="h-3.5 w-3.5" />
                <span>Ditar</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleNarrating}
            aria-label={isNarrating ? 'Pausar narração' : 'Reproduzir narração'}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
              isNarrating
                ? 'border-sky-400/40 bg-sky-500/20 text-sky-200'
                : 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.09]'
            }`}
          >
            {isNarrating ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5 translate-x-[0.5px]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setLensActive((v) => !v)}
            aria-label="Alternar seleção visual Lens"
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
              lensActive
                ? 'border-emerald-400/45 bg-emerald-500/20 text-emerald-200'
                : 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.09]'
            }`}
          >
            <ScanEye className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? 'Recolher HUD' : 'Expandir HUD'}
            aria-expanded={expanded}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:bg-white/[0.09]"
          >
            {expanded ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Live Fluid Waveform Ribbon */}
      <div className="px-4 pb-2">
        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-black/25 px-2.5 py-1">
          <FluidWaveform
            active={isRecording || isNarrating}
            tone={isRecording ? 'crimson' : 'sky'}
            height={28}
          />
        </div>
      </div>

      {/* Expanded Drawer of the HUD */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-white/[0.07]"
          >
            <div className="space-y-3 px-4 py-3.5">
              {/* Live Interim Text Stream Preview */}
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
                <div className="mb-1.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Inserção em tempo real · aba 1606667314</span>
                  <span className="font-mono-tabular">
                    {isRecording ? '0 blocos enviados' : 'Aguardando fala'}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-200">
                  {lensActive
                    ? 'Lens ativo: arraste sobre qualquer bloco de código ou erro na página para interpretar com Gemini 3.5 Flash-Lite.'
                    : isRecording
                      ? '“Transcreva fielmente a fala priorizando português brasileiro sem alterar termos técnicos...”'
                      : 'Selecione um campo de texto ou pressione Alt+Shift+D para iniciar o ditado contínuo.'}
                </p>
              </div>

              {/* Agent & Quick Narration Bar */}
              <div className="flex items-center justify-between gap-2">
                <div className="relative min-w-0 flex-1">
                  <select
                    aria-label="Agente ativo no HUD"
                    value={activeAgent.id}
                    onChange={(e) => onSelectAgent(e.target.value)}
                    className="glass-input w-full appearance-none rounded-xl py-2 pl-3 pr-8 text-xs font-medium text-slate-200"
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
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <span className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-2 font-mono-tabular text-[11px]">
                    <Volume2 className="h-3.5 w-3.5 text-sky-300" />
                    1.0×
                  </span>
                  <button
                    type="button"
                    onClick={onOpenOptions}
                    aria-label="Abrir configurações completas"
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:bg-white/[0.1] hover:text-white"
                  >
                    <Settings className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
