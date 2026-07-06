import { hasPermission as hasSharedPermission } from '@tanlabs/contracts';
import type { RefreshResponse } from '@tanlabs/contracts';
import type { TokenPayload } from '@tanlabs/types';

import { deleteClientCookie, setClientCookie } from '@/lib/platform/cookies';

import { dispatchSessionCleared } from './session-events';

function decodeBase64Url(input: string): string | null {
  try {
    const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return atob(padded);
  } catch {
    return null;
  }
}

export function parseAccessToken<T = unknown>(token: string | null): T | null {
  if (!token) {
    return null;
  }

  const [, payload] = token.split('.');
  if (!payload) {
    return null;
  }

  const decoded = decodeBase64Url(payload);
  if (!decoded) {
    return null;
  }

  try {
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
}

interface SessionStoreOptions {
  authCookie: string;
}

export function createSessionStore<TUser>(options: SessionStoreOptions) {
  let accessToken: string | null = null;
  let user: TUser | null = null;

  function setAuthCookie(): void {
    setClientCookie(options.authCookie, '1');
  }

  function clearAuthCookie(): void {
    deleteClientCookie(options.authCookie);
  }

  return {
    getToken(): string | null {
      return accessToken;
    },

    getUser(): TUser | null {
      return user;
    },

    saveRefresh(refreshResponse: RefreshResponse): void {
      accessToken = refreshResponse.accessToken;
      setAuthCookie();
    },

    hydrateSession(session: { accessToken: string; user?: TUser | null }): void {
      accessToken = session.accessToken;
      user = session.user ?? null;
      setAuthCookie();
    },

    saveSession(loginResponse: { accessToken: string; user: TUser }): void {
      accessToken = loginResponse.accessToken;
      user = loginResponse.user;
      setAuthCookie();
    },

    clearSession(): void {
      accessToken = null;
      user = null;
      clearAuthCookie();
      dispatchSessionCleared();
    },
  };
}

export function createAccessSessionHelpers<
  TUser extends { id: string; email: string; role: string; permissions?: string[] },
>(getToken: () => string | null, defaultRole: string) {
  function parseToken(token: string | null): TokenPayload | null {
    return parseAccessToken<TokenPayload>(token);
  }

  function getTokenPayload(): TokenPayload | null {
    return parseToken(getToken());
  }

  function getUser(): TUser | null {
    const payload = getTokenPayload();
    if (!payload || !payload.user_id || !payload.email) return null;
    return {
      id: payload.user_id,
      email: payload.email,
      role: payload.role ?? defaultRole,
      permissions: payload.permissions ?? [],
    } as unknown as TUser;
  }

  function getPermissions(): string[] {
    return getTokenPayload()?.permissions ?? [];
  }

  function hasPermission(permission: string): boolean {
    const payload = getTokenPayload();
    return hasSharedPermission({
      role: payload?.role,
      permissions: payload?.permissions,
      permission,
    });
  }

  function hasAuthCookie(cookieName: string): boolean {
    if (typeof document === 'undefined') {
      return false;
    }

    return document.cookie
      .split(';')
      .map((chunk) => chunk.trim())
      .some((chunk) => chunk.startsWith(`${cookieName}=`));
  }

  return {
    parseAccessToken: parseToken,
    getTokenPayload,
    getUser,
    getPermissions,
    hasPermission,
    hasAuthCookie,
  };
}
