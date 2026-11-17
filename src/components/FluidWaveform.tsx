interface FluidWaveformProps {
  active: boolean;
  tone?: 'sky' | 'crimson' | 'emerald';
  height?: number;
  className?: string;
}

export function FluidWaveform({
  active,
  tone = 'sky',
  height = 32,
  className = '',
}: FluidWaveformProps) {
  const strokeMain =
    tone === 'crimson'
      ? 'rgba(248, 113, 113, 0.85)'
      : tone === 'emerald'
        ? 'rgba(52, 211, 153, 0.85)'
        : 'rgba(56, 189, 248, 0.85)';

  const strokeSoft =
    tone === 'crimson'
      ? 'rgba(244, 63, 94, 0.32)'
      : tone === 'emerald'
        ? 'rgba(16, 185, 129, 0.32)'
        : 'rgba(59, 130, 246, 0.32)';

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      <div
        className={`flex h-full w-[200%] items-center ${
          active ? 'animate-wave-flow opacity-100' : 'opacity-45'
        } transition-opacity duration-300`}
      >
        <svg
          viewBox="0 0 400 40"
          preserveAspectRatio="none"
          className="h-full w-1/2"
        >
          <path
            d={
              active
                ? 'M0 20 Q 25 6, 50 20 T 100 20 T 150 20 T 200 20 T 250 20 T 300 20 T 350 20 T 400 20'
                : 'M0 20 Q 50 18, 100 20 T 200 20 T 300 20 T 400 20'
            }
            fill="none"
            stroke={strokeSoft}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d={
              active
                ? 'M0 20 Q 20 33, 40 20 T 80 20 T 120 20 T 160 20 T 200 20 T 240 20 T 280 20 T 320 20 T 360 20 T 400 20'
                : 'M0 20 L 400 20'
            }
            fill="none"
            stroke={strokeMain}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
        <svg
          viewBox="0 0 400 40"
          preserveAspectRatio="none"
          className="h-full w-1/2"
        >
          <path
            d={
              active
                ? 'M0 20 Q 25 6, 50 20 T 100 20 T 150 20 T 200 20 T 250 20 T 300 20 T 350 20 T 400 20'
                : 'M0 20 Q 50 18, 100 20 T 200 20 T 300 20 T 400 20'
            }
            fill="none"
            stroke={strokeSoft}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d={
              active
                ? 'M0 20 Q 20 33, 40 20 T 80 20 T 120 20 T 160 20 T 200 20 T 240 20 T 280 20 T 320 20 T 360 20 T 400 20'
                : 'M0 20 L 400 20'
            }
            fill="none"
            stroke={strokeMain}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
