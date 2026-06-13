import { createBrowserApiClient, createCsrfHeadersBuilder } from '@tanlabs/platform';

import { getClientConfig } from '@/config/env';
import { clearSession, getToken, saveRefresh } from '@/shared/auth';
import { SESSION_TERMINATED_ROUTE } from '@/shared/routing';

const csrfProtectedPaths = new Set(['/auth/logout', '/auth/2fa/disable']);

export const { api, logoutSession, refreshSession } = createBrowserApiClient({
  apiBaseUrl: getClientConfig().apiBaseUrl,
  buildDefaultHeaders: () => ({ 'x-auth-client': 'web' }),
  buildSensitiveActionHeaders: createCsrfHeadersBuilder(getClientConfig, csrfProtectedPaths),
  clearSession,
  getToken,
  saveRefresh,
  redirectToLogin: () => {
    if (typeof window !== 'undefined') {
      window.location.href = SESSION_TERMINATED_ROUTE;
    }
  },
});
