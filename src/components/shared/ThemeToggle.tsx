'use client';

import { Toggle } from '@/components/ui/toggle';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <Toggle
      pressed={isDark}
      onPressedChange={pressed => setTheme(pressed ? 'dark' : 'light')}
      variant="outline"
      size="sm"
      className="gap-2"
      aria-label="Toggle theme"
    >
      {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
      <span className="text-xs">{isDark ? 'Dark' : 'Light'}</span>
    </Toggle>
  );
};

export default ThemeToggle;
