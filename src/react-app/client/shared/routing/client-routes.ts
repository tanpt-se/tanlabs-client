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

export const {
  isPublicEntryPath,
  isAuthenticatedEntryPath,
  sanitizeNextPath,
  resolveAuthenticatedRedirect,
} = clientRouteGuards;
