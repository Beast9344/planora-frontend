'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { useIsoLayoutEffect } from './useIsoLayoutEffect';

type RevealDirection = 'up' | 'left' | 'right' | 'scale';

type RevealProps = {
  children: ReactNode;
  /** Which way the content travels in from. Defaults to 'up'. */
  direction?: RevealDirection;
  /** Stagger in milliseconds. Use with an index: delay={i * 70}. */
  delay?: number;
  /** Fraction of the element that must be visible before revealing. */
  threshold?: number;
  /** Reveal a little before the element reaches the viewport edge. */
  rootMargin?: string;
  /** Render as something other than a div (e.g. 'li', 'section', 'article'). */
  as?: ElementType;
  className?: string;
};

const directionClass: Record<RevealDirection, string> = {
  up: '',
  left: 'reveal-left',
  right: 'reveal-right',
  scale: 'reveal-scale',
};

/**
 * Fades and slides its children in the first time they scroll into view.
 *
 * The Home sections are server components, so this thin client wrapper is how
 * they get scroll-driven motion without becoming client components themselves.
 *
 * Three deliberate choices:
 *  - The hidden start state is added from a layout effect, before the browser
 *    paints. Server-rendered markup therefore carries no `reveal` class, which
 *    means a visitor without JavaScript sees everything, and a visitor with it
 *    never sees a flash of visible-then-hidden content.
 *  - Classes are toggled straight on the node instead of through state, so
 *    scrolling past fifty cards costs zero React re-renders.
 *  - Children are only ever dimmed with opacity, never unmounted, so the text
 *    stays in the HTML for crawlers and assistive tech.
 */
export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
  as: Tag = 'div',
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  /** Whether this instance actually took over the element's visibility. */
  const armed = useRef(false);

  useIsoLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return;
    }

    armed.current = true;
    node.classList.add('reveal');
    const dir = directionClass[direction];
    if (dir) node.classList.add(dir);

    return () => {
      armed.current = false;
      node.classList.remove('reveal', 'reveal-left', 'reveal-right', 'reveal-scale');
    };
  }, [direction]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !armed.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          node.classList.add('reveal-in');
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <Tag
      ref={ref}
      className={cn(className)}
      style={
        delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined
      }
    >
      {children}
    </Tag>
  );
}

export default Reveal;
