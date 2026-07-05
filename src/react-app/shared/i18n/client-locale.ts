import { getClientCookie, isLocale, type Locale } from '@/lib/platform';

import { CLIENT_LOCALE_COOKIE, CLIENT_THEME_COOKIE } from '@/auth-config';

export function getClientLocale(): Locale {
  const cookieValue = getClientCookie(CLIENT_LOCALE_COOKIE);
  return cookieValue && isLocale(cookieValue) ? cookieValue : 'en';
}

export function getClientTheme(): 'light' | 'dark' | 'system' {
  const cookieValue = getClientCookie(CLIENT_THEME_COOKIE);
  if (cookieValue === 'light' || cookieValue === 'dark' || cookieValue === 'system') {
    return cookieValue;
  }
  return 'system';
}
