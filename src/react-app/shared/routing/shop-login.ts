import { CLIENT_PUBLIC_ROUTES, LOGIN_NEXT_QUERY_PARAM, resolveAuthenticatedRedirect } from '@/shared/routing/client-routes';

export const LOGIN_REASON_QUERY_PARAM = 'reason';

export function buildOpenShopLoginUrl(nextPath?: string, reason?: string): string {
  const params = new URLSearchParams();

  if (nextPath) {
    params.set(LOGIN_NEXT_QUERY_PARAM, resolveAuthenticatedRedirect(nextPath));
  }

  if (reason) {
    params.set(LOGIN_REASON_QUERY_PARAM, reason);
  }

  const query = params.toString();
  return `${CLIENT_PUBLIC_ROUTES.login}${query ? `?${query}` : ''}`;
}

export function buildOpenShopLoginUrlFromLocation(pathname: string, search = '', reason?: string): string {
  return buildOpenShopLoginUrl(`${pathname}${search}`, reason);
}
