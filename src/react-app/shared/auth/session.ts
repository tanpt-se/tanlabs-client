import type { LoginResponse } from '@tanlabs/contracts';
import type { TokenPayload } from '@tanlabs/types';

import { clientAuthClient } from '@/auth-config.client';

import {
  WEB_AUTH_COOKIE,
  WEB_CSRF_COOKIE,
  WEB_REFRESH_COOKIE,
} from '@/shared/config/auth-cookies';

export const AUTH_COOKIE = WEB_AUTH_COOKIE;
export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REFRESH_COOKIE = WEB_REFRESH_COOKIE;
export const CSRF_COOKIE = WEB_CSRF_COOKIE;

export type { TokenPayload };
export type SessionUser = LoginResponse['user'];

const authSession = clientAuthClient.session;

export const { getToken, saveRefresh, hydrateSession, saveSession, clearSession } = authSession;
export const { parseAccessToken, getTokenPayload, getUser, getPermissions, hasPermission } =
  authSession;

export const hasAuthCookie = clientAuthClient.hasAuthCookie;
export const hasClientAudience = clientAuthClient.hasRequiredAudience;
