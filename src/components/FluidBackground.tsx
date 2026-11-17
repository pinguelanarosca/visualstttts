export function FluidBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0b0f17]"
    >
      <img
        src="/assets/aistudio/image_aba04a32.png"
        alt=""
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover object-top select-none"
      />
      {/* Subtle scrim so glass highlights and foreground UI remain legible without hiding the desktop */}
      <div className="absolute inset-0 bg-slate-950/20" />
    </div>
  );
}
