'use client';

import { cn } from '@/lib/utils';
import { useRef, type ReactNode } from 'react';

type SpotlightProps = {
  children: ReactNode;
  className?: string;
  /** Radius of the highlight in pixels. */
  size?: number;
};

/**
 * Adds a soft highlight that follows the pointer across the card.
 *
 * Written with direct style mutation rather than React state so moving the mouse
 * never triggers a re-render. Pointer-only by design: it is decorative, adds
 * nothing on touch, and is skipped entirely under reduced motion.
 */
export function Spotlight({ children, className, size = 320 }: SpotlightProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    const host = ref.current;
    const glow = glowRef.current;
    if (!host || !glow) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = host.getBoundingClientRect();
    glow.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    glow.style.setProperty('--my', `${event.clientY - rect.top}px`);
    glow.style.opacity = '1';
  };

  const handleLeave = () => {
    if (glowRef.current) glowRef.current.style.opacity = '0';
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn('relative isolate', className)}
    >
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(var(--spot-size, 320px) circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--brand-1) 16%, transparent), transparent 70%)',
          ['--spot-size' as string]: `${size}px`,
        }}
      />
      {children}
    </div>
  );
}

export default Spotlight;
