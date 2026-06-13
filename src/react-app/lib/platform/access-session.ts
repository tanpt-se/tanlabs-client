import { hasPermission as hasSharedPermission } from '@tanlabs/contracts';
import type { TokenPayload } from '@tanlabs/types';

import { parseAccessToken as parsePlatformToken } from './token';

export function createAccessSessionHelpers<
  TUser extends { id: string; email: string; role: string; permissions?: string[] },
>(getToken: () => string | null, defaultRole: string) {
  function parseAccessToken(token: string | null): TokenPayload | null {
    return parsePlatformToken<TokenPayload>(token);
  }

  function getTokenPayload(): TokenPayload | null {
    return parseAccessToken(getToken());
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
    parseAccessToken,
    getTokenPayload,
    getUser,
    getPermissions,
    hasPermission,
    hasAuthCookie,
  };
}
