import type { LoginResponse } from '@tanlabs/contracts';
import type { AuthAppConfig } from '@/features/auth/lib/auth-app-config';

import { WEB_AUTH_COOKIE, WEB_CSRF_COOKIE, WEB_REFRESH_COOKIE } from './config/auth-cookies';

export const CLIENT_LOGIN_RATE_LIMIT_COOKIE = 'client_auth_login_rate_limited_until';
export const CLIENT_LOCALE_COOKIE = 'client_authlab_locale';
export const CLIENT_THEME_COOKIE = 'client_authlab_theme';
export const LOGIN_NEXT_QUERY_PARAM = 'next';

export const CLIENT_PUBLIC_ROUTES = {
  login: '/login',
  register: '/register',
  verifyEmail: '/verify-email',
  forgotPassword: '/forgot-password',
} as const;

export const CLIENT_AUTH_ROUTES = {
  dashboard: '/',
  settings: '/settings',
  /** @deprecated Use `settings`. Kept for redirects and OAuth return paths. */
  myAccount: '/settings',
} as const;

export const DEFAULT_AUTHENTICATED_REDIRECT = CLIENT_AUTH_ROUTES.dashboard;

export const PUBLIC_ENTRY_PATHS = [
  CLIENT_PUBLIC_ROUTES.login,
  CLIENT_PUBLIC_ROUTES.register,
  CLIENT_PUBLIC_ROUTES.verifyEmail,
  CLIENT_PUBLIC_ROUTES.forgotPassword,
] as const;

export const AUTHENTICATED_ENTRY_PATHS = [
  CLIENT_AUTH_ROUTES.dashboard,
  CLIENT_AUTH_ROUTES.settings,
] as const;

const publicEntrySet = new Set<string>(PUBLIC_ENTRY_PATHS);

export const isPublicEntryPath = (pathname: string): boolean => publicEntrySet.has(pathname);
export const isAuthenticatedEntryPath = (pathname: string): boolean =>
  AUTHENTICATED_ENTRY_PATHS.some(
    (entryPath) => pathname === entryPath || pathname.startsWith(`${entryPath}/`),
  );

export const clientAuthConfig: AuthAppConfig = {
  audience: 'client',
  routes: {
    login: CLIENT_PUBLIC_ROUTES.login,
    defaultAuthenticatedRedirect: DEFAULT_AUTHENTICATED_REDIRECT,
    loginNextQueryParam: LOGIN_NEXT_QUERY_PARAM,
    isPublicEntryPath,
    isAuthenticatedEntryPath,
  },
  cookies: {
    auth: WEB_AUTH_COOKIE,
    refresh: WEB_REFRESH_COOKIE,
    csrf: WEB_CSRF_COOKIE,
    loginRateLimit: CLIENT_LOGIN_RATE_LIMIT_COOKIE,
  },
  sessionEnded: {
    normalizeReason: () => ({ reason: 'session-revoked' }),
  },
};

export type ClientSessionUser = LoginResponse['user'];
