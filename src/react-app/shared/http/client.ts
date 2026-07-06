import { createBrowserApiClient, createCsrfHeadersBuilder } from '@/lib/platform';

import { getClientConfig } from '@/shared/config/env';
import {
  canAttemptSilentAuthRefresh,
  getToken,
  hasRefreshCookie,
  resetClientAuthState,
  saveRefresh,
} from '@/shared/auth';
import { isClientProtectedPath, SESSION_TERMINATED_ROUTE } from '@/shared/routing';
import { stashAuthReturnPath } from '@/shared/routing/login-url';

const csrfProtectedPaths = new Set(['/auth/logout', '/auth/2fa/disable']);

function shouldRedirectShopGuestToLogin(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return isClientProtectedPath(window.location.pathname);
}

export const { api, logoutSession, refreshSession } = createBrowserApiClient({
  apiBaseUrl: getClientConfig().apiBaseUrl,
  buildDefaultHeaders: () => ({ 'x-auth-client': 'web' }),
  buildSensitiveActionHeaders: createCsrfHeadersBuilder(getClientConfig, csrfProtectedPaths),
  clearSession: resetClientAuthState,
  getToken,
  saveRefresh,
  shouldAttemptSilentRefresh: () => hasRefreshCookie() && canAttemptSilentAuthRefresh(),
  shouldRedirectUnauthenticated: shouldRedirectShopGuestToLogin,
  redirectToLogin: () => {
    if (typeof window === 'undefined' || !shouldRedirectShopGuestToLogin()) {
      return;
    }

    stashAuthReturnPath(`${window.location.pathname}${window.location.search}`);
    window.location.href = SESSION_TERMINATED_ROUTE;
  },
});
