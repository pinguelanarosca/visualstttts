import { useRef, useState, type ReactNode } from 'react';
import { GripHorizontal } from 'lucide-react';

export interface WindowOffset {
  x: number;
  y: number;
}

interface DraggableWindowProps {
  id: string;
  label: string;
  offset: WindowOffset;
  onChangeOffset: (id: string, next: WindowOffset) => void;
  zIndex: number;
  onFocus: (id: string) => void;
  className?: string;
  actionSlot?: ReactNode;
  children: ReactNode;
}

export function DraggableWindow({
  id,
  label,
  offset,
  onChangeOffset,
  zIndex,
  onFocus,
  className = '',
  actionSlot,
  children,
}: DraggableWindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragOriginRef = useRef<{
    pointerX: number;
    pointerY: number;
    startX: number;
    startY: number;
  } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, select, textarea')) {
      return;
    }

    e.preventDefault();
    onFocus(id);
    setIsDragging(true);

    dragOriginRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      startX: offset.x,
      startY: offset.y,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!dragOriginRef.current) return;
      const dx = moveEvent.clientX - dragOriginRef.current.pointerX;
      const dy = moveEvent.clientY - dragOriginRef.current.pointerY;
      onChangeOffset(id, {
        x: Math.round(dragOriginRef.current.startX + dx),
        y: Math.round(dragOriginRef.current.startY + dy),
      });
    };

    const handlePointerUp = () => {
      dragOriginRef.current = null;
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <div
      data-testid={`draggable-${id}`}
      onPointerDown={() => onFocus(id)}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        zIndex,
      }}
      className={`relative transition-shadow ${
        isDragging ? 'drop-shadow-[0_28px_64px_rgba(0,0,0,0.75)]' : ''
      } ${className}`}
    >
      {/* Translucent Drag Handle Strip */}
      <div
        role="group"
        aria-label={`Mover ${label}`}
        onPointerDown={handlePointerDown}
        className={`mb-2 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/65 px-3 py-1.5 backdrop-blur-xl select-none touch-none ${
          isDragging ? 'cursor-grabbing border-sky-400/45' : 'cursor-grab hover:border-white/20'
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
          <GripHorizontal className="h-3.5 w-3.5 text-sky-300" />
          <span>{label}</span>
        </div>
        {actionSlot && <div className="shrink-0">{actionSlot}</div>}
      </div>

      {children}
    </div>
  );
}
