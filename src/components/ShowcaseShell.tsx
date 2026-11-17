import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Sliders } from 'lucide-react';
import { type SurfaceView } from '../data/mockSkinData';
import { GlassHud } from './GlassHud';
import { ChromePopup } from './ChromePopup';
import { OptionsWindow } from './OptionsWindow';
import { DraggableWindow, type WindowOffset } from './DraggableWindow';

const SURFACE_VIEWS: { id: SurfaceView; label: string }[] = [
  { id: 'overview', label: 'Todas as Superfícies' },
  { id: 'hud', label: 'HUD Flutuante' },
  { id: 'popup', label: 'Pop-up Chrome' },
  { id: 'options', label: 'Janela de Opções' },
];

const INITIAL_OFFSETS: Record<string, WindowOffset> = {
  hud: { x: 0, y: 0 },
  popup: { x: 0, y: 0 },
  options: { x: 0, y: 0 },
};

export function ShowcaseShell() {
  const [surface, setSurface] = useState<SurfaceView>('overview');
  const [isRecording, setIsRecording] = useState(true);
  const [isNarrating, setIsNarrating] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState('dev');
  const [glassOpacity, setGlassOpacity] = useState(0.64);
  const [offsets, setOffsets] =
    useState<Record<string, WindowOffset>>(INITIAL_OFFSETS);
  const [zOrder, setZOrder] = useState<string[]>(['options', 'hud', 'popup']);

  const updateOffset = (id: string, next: WindowOffset) => {
    setOffsets((prev) => ({ ...prev, [id]: next }));
  };

  const bringToFront = (id: string) => {
    setZOrder((prev) => {
      if (prev[prev.length - 1] === id) return prev;
      return [...prev.filter((item) => item !== id), id];
    });
  };

  const getZIndex = (id: string) => {
    const idx = zOrder.indexOf(id);
    return 10 + (idx === -1 ? 0 : idx);
  };

  const hasMoved = Object.values(offsets).some((o) => o.x !== 0 || o.y !== 0);

  return (
    <div className="min-h-screen w-full text-slate-100">
      {/* Clean 3-zone Top Bar following design contract */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#070b14]/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3 sm:px-8">
          {/* Zone 1: Brand Title */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setSurface('overview');
            }}
            className="font-display text-lg font-semibold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            FalaMermo
          </a>

          {/* Zone 2: Navigation View Links */}
          <nav
            aria-label="Superfícies do redesign"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300"
          >
            {SURFACE_VIEWS.map((view) => {
              const active = surface === view.id;
              return (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => setSurface(view.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors ${
                    active ? 'text-white' : 'hover:text-white'
                  }`}
                >
                  {view.label}
                  {active && (
                    <motion.span
                      layoutId="nav-surface-underline"
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-sky-400"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Visual State Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsRecording((r) => !r)}
              className={`rounded-xl border px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                isRecording
                  ? 'border-rose-400/45 bg-rose-500/25 text-rose-100 hover:bg-rose-500/35'
                  : 'border-sky-400/40 bg-sky-500/25 text-sky-100 hover:bg-sky-500/35'
              }`}
            >
              {isRecording ? 'Simular Em Espera' : 'Simular Gravando'}
            </button>
          </div>
        </div>

        {/* Mobile surface selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-t border-white/[0.06] px-4 py-2 md:hidden">
          {SURFACE_VIEWS.map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => setSurface(view.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                surface === view.id
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </header>

      <main id="top" className="mx-auto max-w-7xl space-y-6 px-5 py-5 sm:px-8">
        {/* Compact floating visual controls bar without bulky hero container */}
        <div className="flex flex-wrap items-center justify-end gap-2.5">
          {hasMoved && (
            <button
              type="button"
              onClick={() => setOffsets(INITIAL_OFFSETS)}
              className="glass-panel-subtle flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-white/20 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5 text-sky-300" />
              <span>Resetar posições</span>
            </button>
          )}

          <label className="glass-panel-subtle flex items-center gap-3 rounded-xl px-4 py-2 text-xs">
            <Sliders className="h-3.5 w-3.5 text-sky-300 shrink-0" />
            <span className="text-slate-200 whitespace-nowrap">
              Transparência
            </span>
            <input
              type="range"
              min={0.3}
              max={0.9}
              step={0.01}
              value={glassOpacity}
              onChange={(e) => setGlassOpacity(Number(e.target.value))}
              className="glass-slider w-24"
            />
            <span className="font-mono-tabular w-9 text-right text-slate-200">
              {Math.round(glassOpacity * 100)}%
            </span>
          </label>
        </div>

        {/* Active Surface Showcase over real desktop environment background */}
        <AnimatePresence mode="wait">
          {surface === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10"
            >
              {/* Floating Draggable HUD + Chrome Popup directly over the background environment */}
              <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-start">
                <DraggableWindow
                  id="hud"
                  label="01. HUD Flutuante"
                  offset={offsets.hud}
                  onChangeOffset={updateOffset}
                  zIndex={getZIndex('hud')}
                  onFocus={bringToFront}
                  className="w-full max-w-[472px] lg:mt-48"
                  actionSlot={
                    <button
                      type="button"
                      onClick={() => setSurface('hud')}
                      className="text-[11px] font-medium text-sky-300 hover:text-sky-200"
                    >
                      Isolar
                    </button>
                  }
                >
                  <GlassHud
                    isRecording={isRecording}
                    onToggleRecording={() => setIsRecording((r) => !r)}
                    isNarrating={isNarrating}
                    onToggleNarrating={() => setIsNarrating((n) => !n)}
                    selectedAgentId={selectedAgentId}
                    onSelectAgent={setSelectedAgentId}
                    onOpenOptions={() => setSurface('options')}
                    glassOpacity={glassOpacity}
                  />
                </DraggableWindow>

                <DraggableWindow
                  id="popup"
                  label="02. Pop-up do Chrome"
                  offset={offsets.popup}
                  onChangeOffset={updateOffset}
                  zIndex={getZIndex('popup')}
                  onFocus={bringToFront}
                  className="w-full max-w-[392px]"
                  actionSlot={
                    <button
                      type="button"
                      onClick={() => setSurface('popup')}
                      className="text-[11px] font-medium text-sky-300 hover:text-sky-200"
                    >
                      Isolar
                    </button>
                  }
                >
                  <ChromePopup
                    isRecording={isRecording}
                    onToggleRecording={() => setIsRecording((r) => !r)}
                    isNarrating={isNarrating}
                    onToggleNarrating={() => setIsNarrating((n) => !n)}
                    selectedAgentId={selectedAgentId}
                    onSelectAgent={setSelectedAgentId}
                    onOpenOptions={() => setSurface('options')}
                    glassOpacity={glassOpacity}
                  />
                </DraggableWindow>
              </div>

              {/* Draggable Options Window */}
              <DraggableWindow
                id="options"
                label="03. Janela de Opções da Aplicação"
                offset={offsets.options}
                onChangeOffset={updateOffset}
                zIndex={getZIndex('options')}
                onFocus={bringToFront}
                className="w-full"
                actionSlot={
                  <button
                    type="button"
                    onClick={() => setSurface('options')}
                    className="text-[11px] font-medium text-sky-300 hover:text-sky-200"
                  >
                    Focar
                  </button>
                }
              >
                <OptionsWindow
                  selectedAgentId={selectedAgentId}
                  onSelectAgent={setSelectedAgentId}
                  isNarrating={isNarrating}
                  onToggleNarrating={() => setIsNarrating((n) => !n)}
                  glassOpacity={glassOpacity}
                />
              </DraggableWindow>
            </motion.div>
          )}

          {surface === 'hud' && (
            <motion.div
              key="hud"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="flex min-h-[72vh] items-center justify-center py-6"
            >
              <DraggableWindow
                id="hud"
                label="01. HUD Flutuante"
                offset={offsets.hud}
                onChangeOffset={updateOffset}
                zIndex={getZIndex('hud')}
                onFocus={bringToFront}
                className="w-full max-w-[472px]"
              >
                <GlassHud
                  isRecording={isRecording}
                  onToggleRecording={() => setIsRecording((r) => !r)}
                  isNarrating={isNarrating}
                  onToggleNarrating={() => setIsNarrating((n) => !n)}
                  selectedAgentId={selectedAgentId}
                  onSelectAgent={setSelectedAgentId}
                  onOpenOptions={() => setSurface('options')}
                  glassOpacity={glassOpacity}
                />
              </DraggableWindow>
            </motion.div>
          )}

          {surface === 'popup' && (
            <motion.div
              key="popup"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="flex min-h-[72vh] items-start justify-end py-2"
            >
              <DraggableWindow
                id="popup"
                label="02. Pop-up do Chrome"
                offset={offsets.popup}
                onChangeOffset={updateOffset}
                zIndex={getZIndex('popup')}
                onFocus={bringToFront}
                className="w-full max-w-[392px]"
              >
                <ChromePopup
                  isRecording={isRecording}
                  onToggleRecording={() => setIsRecording((r) => !r)}
                  isNarrating={isNarrating}
                  onToggleNarrating={() => setIsNarrating((n) => !n)}
                  selectedAgentId={selectedAgentId}
                  onSelectAgent={setSelectedAgentId}
                  onOpenOptions={() => setSurface('options')}
                  glassOpacity={glassOpacity}
                />
              </DraggableWindow>
            </motion.div>
          )}

          {surface === 'options' && (
            <motion.div
              key="options"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              <DraggableWindow
                id="options"
                label="03. Janela de Opções da Aplicação"
                offset={offsets.options}
                onChangeOffset={updateOffset}
                zIndex={getZIndex('options')}
                onFocus={bringToFront}
                className="w-full"
              >
                <OptionsWindow
                  selectedAgentId={selectedAgentId}
                  onSelectAgent={setSelectedAgentId}
                  isNarrating={isNarrating}
                  onToggleNarrating={() => setIsNarrating((n) => !n)}
                  glassOpacity={glassOpacity}
                />
              </DraggableWindow>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
