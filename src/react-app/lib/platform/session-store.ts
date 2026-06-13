import type { RefreshResponse } from '@tanlabs/contracts';

import { deleteClientCookie, setClientCookie } from './client-cookie';

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
    },
  };
}
