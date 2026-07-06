'use client';

import { useEffect } from 'react';

import { createPublicAuthRequests } from '@/features/auth/lib/public-auth-requests';
import {
  fetchPublicOAuthConfig,
  setPublicOAuthConfig,
} from '@/features/auth/lib/public-oauth-config';

import { CLIENT_LOGIN_RATE_LIMIT_COOKIE, CLIENT_PUBLIC_ROUTES } from '@/auth-config';
import { getClientConfig } from '@/shared/config/env';
import { CLIENT_API_ROUTES } from '@/shared/http';
import { clearSession, saveSession } from '@/shared/auth';
import { configurePublicAuthRuntime } from '@/shared/auth/public-auth-runtime';
import { buildOpenShopLoginUrl } from '@/shared/routing/shop-login';
import { api } from '@/shared/http/client';

let configured = false;

function ensurePublicAuthRuntimeConfigured() {
  if (configured) {
    return;
  }

  const cfg = getClientConfig();
  configurePublicAuthRuntime({
    routes: {
      login: buildOpenShopLoginUrl(),
      register: CLIENT_PUBLIC_ROUTES.register,
      verifyEmail: CLIENT_PUBLIC_ROUTES.verifyEmail,
      accountSetup: buildOpenShopLoginUrl(),
      forgotPassword: CLIENT_PUBLIC_ROUTES.forgotPassword,
      resetPassword: buildOpenShopLoginUrl(),
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

  useEffect(() => {
    const cfg = getClientConfig();
    void fetchPublicOAuthConfig(cfg.apiBaseUrl).then(setPublicOAuthConfig);
  }, []);

  return null;
}
