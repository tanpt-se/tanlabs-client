import { clientRouteGuards } from '@/auth-config.client';

export {
  CLIENT_AUTH_ROUTES,
  CLIENT_LOGIN_RATE_LIMIT_COOKIE as LOGIN_RATE_LIMIT_COOKIE,
  CLIENT_PUBLIC_ROUTES,
  AUTHENTICATED_ENTRY_PATHS,
  DEFAULT_AUTHENTICATED_REDIRECT,
  LOGIN_NEXT_QUERY_PARAM,
  PUBLIC_ENTRY_PATHS,
} from '@/auth-config';

export const SESSION_TERMINATED_ROUTE = '/auth/session-ended';

export { isClientProtectedPath } from './protected-paths';
export {
  appendNextQueryParam,
  buildLoginUrl,
  buildLoginUrlFromLocation,
  consumeAuthReturnPath,
  PENDING_AUTH_RETURN_KEY,
  stashAuthReturnPath,
} from './login-url';
export {
  LOGIN_REASON_QUERY_PARAM,
  buildOpenShopLoginUrl,
  buildOpenShopLoginUrlFromLocation,
} from './shop-login';

export const {
  isPublicEntryPath,
  isAuthenticatedEntryPath,
  sanitizeNextPath,
  resolveAuthenticatedRedirect,
} = clientRouteGuards;
