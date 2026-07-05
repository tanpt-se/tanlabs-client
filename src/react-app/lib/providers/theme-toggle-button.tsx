'use client';

import { Button } from '@astryxdesign/core/Button';
import { useTheme } from '@tanlabs/providers';

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <Button
      label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      variant="ghost"
      size="sm"
      onClick={() => setTheme(next)}
    />
  );
}
