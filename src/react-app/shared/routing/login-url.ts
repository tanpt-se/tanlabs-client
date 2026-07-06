import { LOGIN_NEXT_QUERY_PARAM } from '@/auth-config';
import { clientRouteGuards } from '@/auth-config.client';
import { buildOpenShopLoginUrl } from './shop-login';

const { isPublicEntryPath, resolveAuthenticatedRedirect } = clientRouteGuards;

export const PENDING_AUTH_RETURN_KEY = 'tanlabs:pending-auth-return';

export function buildLoginUrl(nextPath: string, reason?: string): string {
  return buildOpenShopLoginUrl(nextPath, reason);
}

export function buildLoginUrlFromLocation(pathname: string, search = '', reason?: string): string {
  return buildOpenShopLoginUrl(`${pathname}${search}`, reason);
}

export function stashAuthReturnPath(path?: string | null): void {
  if (typeof window === 'undefined' || !path) {
    return;
  }

  const pathname = path.split('?')[0];
  if (!pathname || isPublicEntryPath(pathname)) {
    return;
  }

  const safeNext = resolveAuthenticatedRedirect(path);
  sessionStorage.setItem(PENDING_AUTH_RETURN_KEY, safeNext);
}

export function consumeAuthReturnPath(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const value = sessionStorage.getItem(PENDING_AUTH_RETURN_KEY);
  sessionStorage.removeItem(PENDING_AUTH_RETURN_KEY);
  return value;
}

export function appendNextQueryParam(path: string, nextPath?: string): string {
  if (!nextPath) {
    return path;
  }

  const safeNext = resolveAuthenticatedRedirect(nextPath);
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}${LOGIN_NEXT_QUERY_PARAM}=${encodeURIComponent(safeNext)}`;
}
