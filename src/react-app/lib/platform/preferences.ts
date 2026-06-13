export type Locale = 'en' | 'vi' | 'ja' | 'ko';
export type ResolvedThemeMode = 'light' | 'dark';
export type ThemeMode = 'system' | ResolvedThemeMode;

export const localeCookieName = 'authlab-locale';
export const themeCookieName = 'authlab-theme';
export const PREFERENCE_COOKIE_MAX_AGE = 31_536_000;

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'en' || value === 'vi' || value === 'ja' || value === 'ko';
}

export function resolveLocale(value: string | null | undefined, fallback: Locale = 'en'): Locale {
  return isLocale(value) ? value : fallback;
}

export function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark';
}

export function resolveThemeMode(
  value: string | null | undefined,
  fallback: ThemeMode = 'system',
): ThemeMode {
  return isThemeMode(value) ? value : fallback;
}

export function resolveThemeValue(
  themeMode: ThemeMode,
  deviceTheme: ResolvedThemeMode = 'light',
): ResolvedThemeMode {
  return themeMode === 'system' ? deviceTheme : themeMode;
}
