'use client';

import { Button } from '@astryxdesign/core/Button';
import { MoreMenu } from '@astryxdesign/core/MoreMenu';
import { LOCALE_OPTIONS, LANGUAGE_LABELS } from '@/shared/i18n/locale-options';
import { useLocale, useTheme } from '@tanlabs/providers';

export function LocaleSelector() {
  const { locale, setLocale } = useLocale();
  const languageLabel = LANGUAGE_LABELS[locale] ?? LANGUAGE_LABELS.en;

  return (
    <MoreMenu
      size="sm"
      label={languageLabel}
      items={LOCALE_OPTIONS.map((option) => ({
        label: option.label,
        onClick: () => setLocale(option.value),
      }))}
    />
  );
}

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

export function AuthPreferenceBar() {
  return (
    <>
      <LocaleSelector />
      <ThemeToggleButton />
    </>
  );
}
