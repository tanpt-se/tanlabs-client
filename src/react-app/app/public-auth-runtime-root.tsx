'use client';

import { createPublicAuthRequests } from '@/features/auth/lib/public-auth-requests';

import { CLIENT_LOGIN_RATE_LIMIT_COOKIE, CLIENT_PUBLIC_ROUTES } from '@/auth-config';
import { getClientConfig } from '@/shared/config/env';
import { CLIENT_API_ROUTES } from '@/shared/http';
import { clearSession, saveSession } from '@/shared/auth';
import { configurePublicAuthRuntime } from '@/shared/auth/public-auth-runtime';
import { api } from '@/shared/http/client';

let configured = false;

function ensurePublicAuthRuntimeConfigured() {
  if (configured) {
    return;
  }

  const cfg = getClientConfig();
  configurePublicAuthRuntime({
    routes: {
      login: CLIENT_PUBLIC_ROUTES.login,
      register: CLIENT_PUBLIC_ROUTES.register,
      verifyEmail: CLIENT_PUBLIC_ROUTES.verifyEmail,
      accountSetup: CLIENT_PUBLIC_ROUTES.login,
      forgotPassword: CLIENT_PUBLIC_ROUTES.forgotPassword,
      resetPassword: CLIENT_PUBLIC_ROUTES.login,
    },
    requests: createPublicAuthRequests({
      post: (path, body) => api.post(path, body),
      paths: {
        login: CLIENT_API_ROUTES.auth.login,
        forgotPassword: CLIENT_API_ROUTES.auth.forgotPassword,
        resetPassword: '/auth/reset-password',
        register: CLIENT_API_ROUTES.auth.register,
        verifyEmail: CLIENT_API_ROUTES.auth.verifyEmail,
        resendEmailVerification: CLIENT_API_ROUTES.auth.resendEmailVerification,
        accountSetup: '/auth/account-setup',
      },
    }),
    getApiBaseUrl: () => cfg.apiBaseUrl,
    getTurnstileSiteKey: () => cfg.turnstile.siteKey || undefined,
    getGoogleOAuthEnabled: () => cfg.oauth.googleEnabled,
    apiPost: (path, body) => api.post(path, body),
    usersSocialLinkStart: (provider) => `/users/me/social-link/${provider}`,
    loginRateLimitCookieName: CLIENT_LOGIN_RATE_LIMIT_COOKIE,
    clearClientSession: () => {
      void clearSession();
    },
    saveClientSession: saveSession,
  });
  configured = true;
}

export function PublicAuthRuntimeRoot() {
  ensurePublicAuthRuntimeConfigured();

  return null;
}
