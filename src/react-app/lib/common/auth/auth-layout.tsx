'use client';

import type { ReactNode } from 'react';

import { BrandMark, LocaleFlag } from '@tanlabs/assets';
import {
  Button,
  CONTENT_VIEW_TRANSITION_NAME,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@tanlabs/components';
import { BaseLayout, ThemeToggleButton, useLocale } from '@tanlabs/providers';
import { ChevronRight } from 'lucide-react';

import { LANGUAGE_LABELS, LOCALE_OPTIONS } from '../i18n/locale-options';

function LocaleSelector() {
  const { locale, setLocale } = useLocale();
  const languageLabel = LANGUAGE_LABELS[locale] ?? LANGUAGE_LABELS.en;
  const activeLocale =
    LOCALE_OPTIONS.find((option) => option.value === locale)?.label ?? LOCALE_OPTIONS[0].label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={languageLabel} className="h-9 gap-2 px-2.5">
          <span aria-hidden="true" className="inline-flex h-4 w-4 items-center justify-center">
            <LocaleFlag locale={locale} />
          </span>
          <span className="hidden sm:inline">{activeLocale}</span>
          <ChevronRight className="text-muted-foreground size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="bg-card w-(--radix-dropdown-menu-trigger-width) min-w-44 rounded-xl p-1 shadow-(--shadow-panel)"
      >
        <DropdownMenuLabel>{languageLabel}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => {
            setLocale(value as typeof locale);
          }}
        >
          {LOCALE_OPTIONS.map(({ value, label }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <span className="mr-2 shrink-0">
                <LocaleFlag locale={value} />
              </span>
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AuthLayout({
  app = 'web',
  children,
  contentViewTransitionName,
}: {
  app?: 'web' | 'admin';
  children: ReactNode;
  contentViewTransitionName?: string;
}) {
  const contentContainerClassName =
    contentViewTransitionName === CONTENT_VIEW_TRANSITION_NAME
      ? 'w-full [view-transition-name:content-view-transition]'
      : 'w-full';

  return (
    <BaseLayout className="relative flex h-dvh items-stretch justify-center overflow-hidden bg-(--shell-stage-bg) p-3 xl:p-4">
      <div className="h-full min-h-0 w-full max-w-[1660px] overflow-auto">
        <div className="relative flex min-h-[calc(100dvh-6rem)] items-center justify-center">
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <LocaleSelector />
            <ThemeToggleButton />
          </div>
          <div className="w-full">
            <div className="mx-auto flex min-h-[calc(100dvh-6rem)] w-full max-w-6xl items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
              <div className="w-full max-w-md space-y-4">
                <div className="flex justify-center">
                  <BrandMark app={app} className="inline-flex items-center" />
                </div>
                <div className={contentContainerClassName}>{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
