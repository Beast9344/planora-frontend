'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

type AuroraCanvasProps = {
  className?: string;
  /** Number of drifting light blobs. */
  blobs?: number;
  /** Number of dust particles in the field. */
  particles?: number;
  /** Overall strength, 0-1. Lower it if content sits directly on top. */
  intensity?: number;
};

type Blob = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  color: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
};

/** Fallbacks for browsers that cannot parse oklch() in a canvas context. */
const FALLBACK_LIGHT = ['rgb(60,86,180)', 'rgb(88,74,192)', 'rgb(38,98,164)'];
const FALLBACK_DARK = ['rgb(148,176,255)', 'rgb(164,160,255)', 'rgb(138,196,255)'];

function readPalette(root: HTMLElement, isDark: boolean, ctx: CanvasRenderingContext2D) {
  const styles = getComputedStyle(root);
  const fallback = isDark ? FALLBACK_DARK : FALLBACK_LIGHT;

  return (['--brand-1', '--brand-2', '--brand-3'] as const).map((token, i) => {
    const raw = styles.getPropertyValue(token).trim();
    if (!raw) return fallback[i];

    // Canvas silently ignores values it cannot parse, so probe with a sentinel.
    const sentinel = '#ff00ff';
    ctx.fillStyle = sentinel;
    ctx.fillStyle = raw;
    return ctx.fillStyle === sentinel ? fallback[i] : raw;
  });
}

/**
 * Animated aurora + dust field painted behind the hero.
 *
 * Colours are read straight from the --brand-* custom properties, so this stays
 * inside the existing palette and re-reads itself when next-themes flips the
 * `dark` class on <html>. Purely decorative: aria-hidden, no text, and it stops
 * entirely for prefers-reduced-motion, when scrolled out of view, or when the
 * tab is hidden.
 */
export function AuroraCanvas({
  className,
  blobs = 5,
  particles = 46,
  intensity = 1,
}: AuroraCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let width = 0;
    let height = 0;
    let dpr = 1;
    let palette = readPalette(root, root.classList.contains('dark'), ctx);
    let blobList: Blob[] = [];
    let dust: Particle[] = [];
    let frame = 0;
    let onScreen = true;
    let running = false;
    let t = 0;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const seed = () => {
      blobList = Array.from({ length: blobs }, (_, i) => ({
        x: rand(0.1, 0.9) * width,
        y: rand(0.05, 0.75) * height,
        r: rand(0.28, 0.52) * Math.max(width, height) * 0.6,
        vx: rand(-0.14, 0.14),
        vy: rand(-0.1, 0.1),
        color: i % 3,
      }));

      dust = Array.from({ length: particles }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: rand(-0.18, 0.18),
        vy: rand(-0.24, -0.04),
        r: rand(0.7, 2.1),
        a: rand(0.18, 0.6),
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const paintStatic = () => {
      ctx.clearRect(0, 0, width, height);
      blobList.forEach((b) => {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, palette[b.color]);
        g.addColorStop(1, 'transparent');
        ctx.globalAlpha = 0.16 * intensity;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const draw = () => {
      t += 0.0035;
      ctx.clearRect(0, 0, width, height);

      // --- drifting aurora blobs ---
      ctx.globalCompositeOperation = 'lighter';
      blobList.forEach((b, i) => {
        b.x += b.vx + Math.sin(t + i) * 0.22;
        b.y += b.vy + Math.cos(t * 1.3 + i) * 0.16;

        const pad = b.r * 0.5;
        if (b.x < -pad) b.x = width + pad;
        if (b.x > width + pad) b.x = -pad;
        if (b.y < -pad) b.y = height + pad;
        if (b.y > height + pad) b.y = -pad;

        const breathe = 1 + Math.sin(t * 2 + i * 1.7) * 0.08;
        const r = b.r * breathe;

        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
        g.addColorStop(0, palette[b.color]);
        g.addColorStop(1, 'transparent');
        ctx.globalAlpha = 0.17 * intensity;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- dust field ---
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = palette[0];
      dust.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -6) {
          p.y = height + 6;
          p.x = Math.random() * width;
        }
        if (p.x < -6) p.x = width + 6;
        if (p.x > width + 6) p.x = -6;

        ctx.globalAlpha = p.a * 0.55 * intensity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running || reduceMotion.matches || document.hidden || !onScreen) return;
      running = true;
      frame = requestAnimationFrame(draw);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    resize();

    if (reduceMotion.matches) {
      paintStatic();
    } else {
      start();
    }

    const onResize = () => {
      resize();
      if (reduceMotion.matches) paintStatic();
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    const onMotionChange = () => {
      stop();
      if (reduceMotion.matches) paintStatic();
      else start();
    };

    // next-themes toggles the `dark` class on <html>; re-read the palette.
    const themeObserver = new MutationObserver(() => {
      palette = readPalette(root, root.classList.contains('dark'), ctx);
      if (reduceMotion.matches) paintStatic();
    });
    themeObserver.observe(root, { attributes: true, attributeFilter: ['class'] });

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? true;
        if (onScreen) start();
        else stop();
      },
      { threshold: 0 },
    );
    visibilityObserver.observe(canvas);

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    reduceMotion.addEventListener('change', onMotionChange);

    return () => {
      stop();
      themeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      reduceMotion.removeEventListener('change', onMotionChange);
    };
  }, [blobs, particles, intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    />
  );
}

export default AuroraCanvas;
