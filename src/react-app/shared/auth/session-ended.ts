import { deleteClientCookie } from '@/lib/platform';

import { clientAuthConfig } from '@/auth-config';
import { clearSession } from '@/shared/auth/session';
import { consumeAuthReturnPath } from '@/shared/routing/login-url';
import { buildOpenShopLoginUrl } from '@/shared/routing/shop-login';

const defaultNormalizeReason = (incomingReason: string | null) => ({
  reason: incomingReason === 'session-ended' ? 'session-ended' : 'session-revoked',
});

export function resolveSessionEndedLoginUrl(requestUrl: string): URL {
  const incomingReason = new URL(requestUrl).searchParams.get('reason');
  const resolved = defaultNormalizeReason(incomingReason);
  const pendingReturn = consumeAuthReturnPath();
  const path = buildOpenShopLoginUrl(pendingReturn ?? undefined, resolved.reason);
  return new URL(path, requestUrl);
}

export function clearAuthCookies(): void {
  const cookieNames = [
    clientAuthConfig.cookies.auth,
    clientAuthConfig.cookies.refresh,
    clientAuthConfig.cookies.csrf,
    ...(clientAuthConfig.sessionEnded?.extraClearCookies ?? []),
  ];

  for (const cookieName of cookieNames) {
    deleteClientCookie(cookieName);
  }
}

export function resetClientAuthState(): void {
  clearAuthCookies();
  clearSession();
}

export function handleSessionEnded(): string {
  resetClientAuthState();
  const url = resolveSessionEndedLoginUrl(window.location.href);
  return `${url.pathname}${url.search}`;
}
