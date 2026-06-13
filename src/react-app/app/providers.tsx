'use client';

import type { ReactNode } from 'react';

import type { Locale, ThemeMode } from '@tanlabs/platform';
import { AppProviders as SharedAppProviders } from '@tanlabs/providers';
import { Toaster } from '@tanlabs/components';

import { CLIENT_LOCALE_COOKIE, CLIENT_THEME_COOKIE } from '@/auth-config';
import { PublicAuthRuntimeRoot } from './public-auth-runtime-root';

export function AppProviders({
  children,
  locale,
  theme,
}: {
  children: ReactNode;
  locale: Locale;
  theme: ThemeMode;
}) {
  return (
    <SharedAppProviders
      locale={locale}
      localeCookieName={CLIENT_LOCALE_COOKIE}
      theme={theme}
      themeCookieName={CLIENT_THEME_COOKIE}
      preservePathOnLocaleChange
    >
      <PublicAuthRuntimeRoot />
      <Toaster />
      {children}
    </SharedAppProviders>
  );
}
