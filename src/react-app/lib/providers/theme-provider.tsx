'use client';

import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  type Locale,
  PREFERENCE_COOKIE_MAX_AGE,
  type ResolvedThemeMode,
  type ThemeMode,
  isLocale,
  localeCookieName,
  resolveThemeValue,
  setClientCookie,
  themeCookieName,
} from '@tanlabs/platform';

const LOCALES = ['en', 'vi', 'ja', 'ko'] as const;

function getSystemTheme(): ResolvedThemeMode {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(themeMode: ThemeMode): ResolvedThemeMode {
  const resolvedTheme = resolveThemeValue(themeMode, getSystemTheme());

  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = resolvedTheme;
  }

  return resolvedTheme;
}

type LocaleContextValue = {
  locale: Locale;
  setLocale: (value: Locale) => void;
};

type ThemeContextValue = {
  theme: ResolvedThemeMode;
  themeMode: ThemeMode;
  setTheme: (value: ThemeMode) => void;
};

const LocaleContext = React.createContext<LocaleContextValue>({
  locale: 'en',
  setLocale: () => undefined,
});

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: 'light',
  themeMode: 'system',
  setTheme: () => undefined,
});

export function AppProviders({
  children,
  locale = 'en',
  theme = 'system',
  preservePathOnLocaleChange,
  useViewTransitionOnLocaleChange,
  localeCookieName: appLocaleCookieName = localeCookieName,
  themeCookieName: appThemeCookieName = themeCookieName,
}: {
  locale?: Locale | string;
  theme?: ThemeMode;
  localeCookieName?: string;
  themeCookieName?: string;
  preservePathOnLocaleChange?: boolean;
  useViewTransitionOnLocaleChange?: boolean;
  children?: React.ReactNode;
}) {
  void preservePathOnLocaleChange;
  void useViewTransitionOnLocaleChange;

  const navigate = useNavigate();
  const [currentLocale, setCurrentLocale] = React.useState<Locale>(
    isLocale(locale) ? locale : 'en',
  );
  const [themeMode, setThemeMode] = React.useState<ThemeMode>(theme);
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedThemeMode>(() =>
    resolveThemeValue(theme, 'light'),
  );

  React.useEffect(() => {
    if (!isLocale(locale)) {
      return;
    }

    setCurrentLocale(locale);
    document.documentElement.lang = locale;
  }, [locale]);

  React.useEffect(() => {
    setThemeMode(theme);
  }, [theme]);

  React.useLayoutEffect(() => {
    setResolvedTheme(applyTheme(themeMode));
  }, [themeMode]);

  React.useEffect(() => {
    if (
      themeMode !== 'system' ||
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      setResolvedTheme(applyTheme('system'));
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [themeMode]);

  const setLocale = React.useCallback(
    (value: Locale) => {
      if (!LOCALES.includes(value)) {
        return;
      }

      setCurrentLocale(value);
      document.documentElement.lang = value;
      setClientCookie(appLocaleCookieName, value, { maxAge: PREFERENCE_COOKIE_MAX_AGE });
      React.startTransition(() => {
        navigate(0);
      });
    },
    [appLocaleCookieName, navigate],
  );

  const setTheme = React.useCallback(
    (value: ThemeMode) => {
      setThemeMode(value);
      setResolvedTheme(applyTheme(value));
      setClientCookie(appThemeCookieName, value, { maxAge: PREFERENCE_COOKIE_MAX_AGE });
    },
    [appThemeCookieName],
  );

  const localeValue = React.useMemo(
    () => ({
      locale: currentLocale,
      setLocale,
    }),
    [currentLocale, setLocale],
  );

  const themeValue = React.useMemo(
    () => ({
      theme: resolvedTheme,
      themeMode,
      setTheme,
    }),
    [resolvedTheme, setTheme, themeMode],
  );

  return (
    <LocaleContext.Provider value={localeValue}>
      <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return React.useContext(LocaleContext);
}

export function useTheme() {
  return React.useContext(ThemeContext);
}
