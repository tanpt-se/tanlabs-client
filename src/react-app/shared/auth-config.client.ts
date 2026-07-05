import { isClientAudience } from '@tanlabs/contracts';

import {
  createAccessSessionHelpers,
  createSessionStore,
} from '@/shared/auth/session-factory';
import { createRouteGuards } from '@/shared/routing/guards';

import {
  AUTHENTICATED_ENTRY_PATHS,
  type ClientSessionUser,
  DEFAULT_AUTHENTICATED_REDIRECT,
  PUBLIC_ENTRY_PATHS,
  clientAuthConfig,
} from './auth-config';

const clientSessionStore = createSessionStore<ClientSessionUser>({
  authCookie: clientAuthConfig.cookies.auth,
});

const clientSessionHelpers = createAccessSessionHelpers<ClientSessionUser>(
  clientSessionStore.getToken,
  'web',
);

const clientSession = {
  ...clientSessionStore,
  ...clientSessionHelpers,
  hasAuthCookie: (cookieName = clientAuthConfig.cookies.auth) =>
    clientSessionHelpers.hasAuthCookie(cookieName),
};

export const clientRouteGuards = createRouteGuards({
  publicEntryPaths: PUBLIC_ENTRY_PATHS,
  authenticatedEntryPaths: AUTHENTICATED_ENTRY_PATHS,
  defaultRedirect: DEFAULT_AUTHENTICATED_REDIRECT,
});

export const clientAuthClient = {
  config: clientAuthConfig,
  session: clientSession,
  hasRequiredAudience: () => {
    const payload = clientSession.getTokenPayload();
    return isClientAudience({ role: payload?.role, permissions: payload?.permissions });
  },
  hasAuthCookie: () => clientSession.hasAuthCookie(clientAuthConfig.cookies.auth),
};
