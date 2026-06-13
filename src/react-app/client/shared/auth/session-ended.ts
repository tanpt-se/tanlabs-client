import { deleteClientCookie } from '@tanlabs/platform';

import { clientAuthConfig } from '@/auth-config';
import { clearSession } from '@/shared/auth';

const defaultNormalizeReason = (incomingReason: string | null) => ({
  reason: incomingReason === 'session-ended' ? 'session-ended' : 'session-revoked',
});

export function resolveSessionEndedLoginUrl(requestUrl: string): URL {
  const incomingReason = new URL(requestUrl).searchParams.get('reason');
  const resolved = (clientAuthConfig.sessionEnded?.normalizeReason ?? defaultNormalizeReason)(
    incomingReason,
  );
  const redirectUrl = new URL(clientAuthConfig.routes.login, requestUrl);
  redirectUrl.searchParams.set('reason', resolved.reason);
  return redirectUrl;
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

export function handleSessionEnded(): string {
  clearAuthCookies();
  clearSession();
  const url = resolveSessionEndedLoginUrl(window.location.href);
  return `${url.pathname}${url.search}`;
}
