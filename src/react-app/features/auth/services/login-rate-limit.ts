import { deleteClientCookie, getClientCookie, setClientCookie } from '@/lib/platform';

import { LOGIN_RATE_LIMIT_COOKIE, clearSession } from '@/shared/auth';

export function setLoginRateLimitCookie(blockedUntil: number) {
  const maxAge = Math.max(1, Math.ceil((blockedUntil - Date.now()) / 1000));
  setClientCookie(LOGIN_RATE_LIMIT_COOKIE, `${blockedUntil}`, { maxAge });
}

export function clearLoginRateLimitCookie() {
  deleteClientCookie(LOGIN_RATE_LIMIT_COOKIE);
}

export function getCookieValue(name: string): string | null {
  return getClientCookie(name);
}

export function restoreLoginRateLimit(): number | null {
  const cookieBlockedUntil = getCookieValue(LOGIN_RATE_LIMIT_COOKIE);
  const parsed = Number(cookieBlockedUntil ?? '');
  const now = Date.now();

  if (!Number.isFinite(parsed) || parsed <= now) {
    clearStoredLoginRateLimit();
    return null;
  }

  clearSession();
  setLoginRateLimitCookie(parsed);
  return parsed;
}

export function persistLoginRateLimit(blockedUntil: number) {
  clearSession();
  setLoginRateLimitCookie(blockedUntil);
}

export function clearStoredLoginRateLimit() {
  clearLoginRateLimitCookie();
}
