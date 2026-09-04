'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import { useIsoLayoutEffect } from './useIsoLayoutEffect';

type CountUpProps = {
  /** The final number. Rendered as-is on the server so the value is always in the HTML. */
  value: number;
  /** Decimal places to show. Defaults to 0. */
  decimals?: number;
  /** Rendered before the number, e.g. '৳'. */
  prefix?: string;
  /** Rendered after the number, e.g. '+' or '%'. */
  suffix?: string;
  /** Animation length in ms. */
  duration?: number;
  className?: string;
};

const easeOutExpo = (x: number) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x));

/**
 * Counts from zero up to `value` the first time it scrolls into view.
 *
 * The final number is what the server renders, so it is present for crawlers and
 * is exactly what a reduced-motion or no-JavaScript visitor reads. The animation
 * writes to a single text node through a ref rather than through state: a
 * sixty-frames-per-second counter has no business re-rendering React.
 */
export function CountUp({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1500,
  className,
}: CountUpProps) {
  const hostRef = useRef<HTMLSpanElement | null>(null);
  const numberRef = useRef<HTMLSpanElement | null>(null);
  const armed = useRef(false);

  const format = (n: number) =>
    n.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  // Drop to zero before the browser paints, so there is no flash of the final
  // number followed by a restart.
  useIsoLayoutEffect(() => {
    const node = numberRef.current;
    if (!node) return;

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return;
    }

    armed.current = true;
    node.textContent = format(0);

    return () => {
      armed.current = false;
      node.textContent = format(value);
    };
  }, [value, decimals]);

  useEffect(() => {
    const host = hostRef.current;
    const node = numberRef.current;
    if (!host || !node || !armed.current) return;

    let frame = 0;
    let started = false;

    const run = () => {
      if (started) return;
      started = true;

      const startedAt = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        node.textContent = format(value * easeOutExpo(progress));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(host);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, decimals]);

  return (
    <span ref={hostRef} className={cn('nums', className)}>
      {prefix}
      <span ref={numberRef}>{format(value)}</span>
      {suffix}
    </span>
  );
}

export default CountUp;
