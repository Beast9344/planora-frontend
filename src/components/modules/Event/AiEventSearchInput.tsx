'use client';

import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { platformServices } from '@/services/platform.services';

type AiEventSearchInputProps = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
};

type SuggestionItem = {
  text: string;
  hint: string;
  type?: string;
};

const asRecord = (value: unknown): Record<string, unknown> => {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
};

const AiEventSearchInput = ({
  name,
  defaultValue = '',
  placeholder = 'Search events',
}: AiEventSearchInputProps) => {
  const [term, setTerm] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const normalizedTerm = useMemo(() => term.trim(), [term]);

  useEffect(() => {
    let isCancelled = false;

    const timer = setTimeout(async () => {
      setIsLoading(true);

      try {
        const response = await platformServices.getEventSearchSuggestions({
          q: normalizedTerm || undefined,
          limit: 8,
        });

        if (isCancelled) {
          return;
        }

        const payload = asRecord(response.data);
        const rawSuggestions = Array.isArray(payload.suggestions)
          ? payload.suggestions
          : [];

        const nextSuggestions = rawSuggestions
          .map(item => {
            const suggestion = asRecord(item);
            const text =
              typeof suggestion.text === 'string' ? suggestion.text : '';
            const hint =
              typeof suggestion.hint === 'string' ? suggestion.hint : '';
            const type =
              typeof suggestion.type === 'string' ? suggestion.type : '';

            return {
              text,
              hint,
              type,
            };
          })
          .filter(item => item.text);

        setSuggestions(nextSuggestions);
      } catch {
        if (!isCancelled) {
          setSuggestions([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [normalizedTerm]);

  return (
    <div className="relative sm:col-span-2 md:col-span-4 lg:col-span-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name={name}
          value={term}
          onChange={event => setTerm(event.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            setTimeout(() => {
              setIsOpen(false);
            }, 120);
          }}
          placeholder={placeholder}
          className="h-11 border border-border/70 bg-card pl-10 pr-24 text-foreground dark:border-white/20"
          autoComplete="off"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
          AI
        </span>
      </div>

      {isOpen && (isLoading || suggestions.length > 0) ? (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          <div className="border-b border-border bg-muted/40 px-3 py-2 text-xs font-semibold text-muted-foreground">
            {isLoading
              ? 'AI is preparing suggestions...'
              : 'Suggested searches'}
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {suggestions.slice(0, 8).map(item => (
              <button
                type="button"
                key={`${item.text}-${item.hint}`}
                onMouseDown={() => {
                  setTerm(item.text);
                  setIsOpen(false);
                }}
                className="flex w-full items-center justify-between px-3 py-2 text-left transition hover:bg-muted"
              >
                <span className="line-clamp-1 text-sm text-foreground">
                  {item.text}
                </span>
                <span className="ml-3 text-xs text-muted-foreground">
                  {item.hint || item.type || 'Suggestion'}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <p className="mt-1 text-xs text-primary-foreground/80 dark:text-muted-foreground">
        Smart suggestions update as you type. Press Enter to search quickly.
      </p>
    </div>
  );
};

export default AiEventSearchInput;
