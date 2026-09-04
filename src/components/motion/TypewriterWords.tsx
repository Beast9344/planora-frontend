'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

type TypewriterWordsProps = {
  /** Phrases to cycle through. The first one is what renders on the server. */
  words: string[];
  /** ms per character while typing. */
  typeSpeed?: number;
  /** ms per character while deleting. */
  deleteSpeed?: number;
  /** How long a finished phrase stays on screen. */
  holdMs?: number;
  className?: string;
  caretClassName?: string;
};

/**
 * Types and retypes a rotating phrase.
 *
 * Layout stability: the longest phrase is rendered invisibly in the same grid
 * cell, so the headline reserves its widest width up front and nothing below it
 * jumps as characters appear.
 *
 * Accessibility: the animated text is aria-hidden and a stable sr-only copy of
 * the first phrase is exposed instead, so a screen reader reads one clean
 * sentence rather than a stream of partial words. With reduced motion or without
 * JavaScript the first phrase simply sits there, fully typed, and the caret —
 * which ships hidden — is never revealed.
 */
export function TypewriterWords({
  words,
  typeSpeed = 62,
  deleteSpeed = 32,
  holdMs = 1900,
  className,
  caretClassName,
}: TypewriterWordsProps) {
  const first = words[0] ?? '';
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), first);

  const textRef = useRef<HTMLSpanElement | null>(null);
  const caretRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const textNode = textRef.current;
    const caretNode = caretRef.current;
    if (!textNode || !caretNode) return;
    if (words.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    caretNode.style.display = 'inline-block';

    let index = 0;
    let cursor = first.length;
    let deleting = false;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const step = () => {
      if (cancelled) return;

      const word = words[index];

      if (!deleting) {
        if (cursor < word.length) {
          cursor += 1;
          textNode.textContent = word.slice(0, cursor);
          timer = setTimeout(step, typeSpeed);
          return;
        }
        deleting = true;
        timer = setTimeout(step, holdMs);
        return;
      }

      if (cursor > 0) {
        cursor -= 1;
        textNode.textContent = word.slice(0, cursor);
        timer = setTimeout(step, deleteSpeed);
        return;
      }

      deleting = false;
      index = (index + 1) % words.length;
      timer = setTimeout(step, typeSpeed * 3);
    };

    timer = setTimeout(step, holdMs);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      caretNode.style.display = 'none';
      textNode.textContent = first;
    };
    // `first` is derived from `words`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, typeSpeed, deleteSpeed, holdMs]);

  return (
    <>
      <span className="sr-only">{first}</span>
      <span aria-hidden="true" className="relative inline-grid align-bottom">
        <span className="invisible col-start-1 row-start-1 whitespace-pre">{longest}</span>
        <span className="col-start-1 row-start-1 text-left whitespace-pre">
          <span ref={textRef} className={className}>
            {first}
          </span>
          <span
            ref={caretRef}
            // Inline display beats any utility class, so the caret is reliably
            // absent until the effect below actually starts typing.
            style={{ display: 'none' }}
            className={cn(
              'animate-caret ml-0.5 h-[0.86em] w-[0.06em] translate-y-[0.06em] bg-current align-baseline',
              caretClassName,
            )}
          />
        </span>
      </span>
    </>
  );
}

export default TypewriterWords;
