'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { BrandIconSvg } from '@tanlabs/assets';
import { BRAND } from '@tanlabs/config';
import { ShellTopNavLayout } from '@/ui/shell-top-nav';
import { SessionWatchdog } from '@/features/auth';
import { AuthBootstrapFallback } from '@/ui/loading';

import { getClientConfig } from '@/shared/config/env';
import { CLIENT_API_ROUTES } from '@/shared/http';
import { type SessionUser, canAttemptSilentAuthRefresh, clearSession, getToken, getUser, hydrateSession, hasRefreshCookie, resolveGuestProtectedRedirect, SESSION_CLEARED_EVENT, SESSION_SAVED_EVENT } from '@/shared/auth';
import { isAccessTokenValid } from '@/shared/auth/access-token';
import { api, refreshSession } from '@/shared/http/client';
import { type ClientLang, resolveDashboardPageChrome } from '@/shared/i18n';
import {
  CLIENT_AUTH_ROUTES,
  isClientProtectedPath,
} from '@/shared/routing';

import { buildDashboardShellNavigation } from './dashboard-shell-navigation';
import { ShopHeaderActions } from './shop-header-actions';
import { CartProvider } from '@/features/cart';
import { CartDrawer } from '@/ui/cart-drawer';

export function DashboardShell({
  children,
  shell,
  lang,
  initialAccessToken,
}: {
  children: ReactNode;
  shell: ClientLang['shell'];
  lang: ClientLang;
  initialAccessToken: string | null;
}) {
  if (initialAccessToken && !getToken()) {
    hydrateSession({ accessToken: initialAccessToken });
  }

  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const bootstrapRef = useRef(false);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(() => getUser());
  const [authRevision, setAuthRevision] = useState(0);
  const [hydrated, setHydrated] = useState(() => {
    if (initialAccessToken) {
      return false;
    }

    const token = getToken();
    if (token && isAccessTokenValid(token)) {
      return true;
    }

    return !hasRefreshCookie();
  });

  const probeSession = useCallback(() => api.get(CLIENT_API_ROUTES.account.me), []);

  const finishBootstrap = useCallback(
    (active: boolean) => {
      if (active) {
        setHydrated(true);
      }
    },
    [],
  );

  useEffect(() => {
    if (bootstrapRef.current) {
      return;
    }
    bootstrapRef.current = true;

    let active = true;

    const syncAuthSnapshot = () => {
      if (!active) {
        return;
      }
      setSessionUser((current) => {
        const nextUser = getUser();
        return current === nextUser ? current : nextUser;
      });
    };

    const redirectGuestFromProtected = () => {
      if (!isClientProtectedPath(pathname)) {
        return;
      }

      navigate(resolveGuestProtectedRedirect(pathname, search), { replace: true });
    };

    const bootstrap = async () => {
      if (initialAccessToken) {
        hydrateSession({ accessToken: initialAccessToken });
        syncAuthSnapshot();
        finishBootstrap(active);
        return;
      }

      const token = getToken();
      if (token && isAccessTokenValid(token)) {
        syncAuthSnapshot();
        finishBootstrap(active);
        return;
      }

      if (!hasRefreshCookie()) {
        clearSession();
        redirectGuestFromProtected();
        finishBootstrap(active);
        return;
      }

      if (!canAttemptSilentAuthRefresh()) {
        clearSession();
        finishBootstrap(active);
        return;
      }

      try {
        await refreshSession();
        syncAuthSnapshot();
      } catch {
        clearSession();
        redirectGuestFromProtected();
      }

      finishBootstrap(active);
    };

    void bootstrap();

    return () => {
      active = false;
    };
  }, [finishBootstrap, initialAccessToken, navigate, pathname, search]);

  useEffect(() => {
    if (!hydrated) {
      return undefined;
    }

    const syncAuthSnapshot = () => {
      setSessionUser(getUser());
      setAuthRevision((current) => current + 1);
    };

    const redirectGuestFromProtected = () => {
      if (!isClientProtectedPath(pathname)) {
        return;
      }

      navigate(resolveGuestProtectedRedirect(pathname, search), { replace: true });
    };

    const handleGuestSession = () => {
      if (getToken() && isAccessTokenValid(getToken()!)) {
        syncAuthSnapshot();
        return;
      }

      if (hasRefreshCookie() && canAttemptSilentAuthRefresh()) {
        syncAuthSnapshot();
        return;
      }

      setSessionUser(null);
      setAuthRevision((current) => current + 1);

      if (!canAttemptSilentAuthRefresh()) {
        return;
      }

      redirectGuestFromProtected();
    };

    handleGuestSession();
    window.addEventListener(SESSION_CLEARED_EVENT, handleGuestSession);
    window.addEventListener(SESSION_SAVED_EVENT, syncAuthSnapshot);

    return () => {
      window.removeEventListener(SESSION_CLEARED_EVENT, handleGuestSession);
      window.removeEventListener(SESSION_SAVED_EVENT, syncAuthSnapshot);
    };
  }, [hydrated, navigate, pathname, search]);

  const pageChrome = resolveDashboardPageChrome(pathname, lang);
  const navEntries = buildDashboardShellNavigation({ pathname, shell });
  const isAuthenticated = useMemo(() => {
    if (!hydrated) {
      return false;
    }

    const activeToken = getToken();
    return Boolean(activeToken && isAccessTokenValid(activeToken));
  }, [hydrated, authRevision, sessionUser]);

  return (
    <CartProvider>
      {hydrated && isAuthenticated ? (
        <SessionWatchdog
          intervalMs={getClientConfig().sessionWatchdog.intervalMs}
          probe={probeSession}
        />
      ) : null}
      <ShellTopNavLayout
        breadcrumbs={pageChrome.breadcrumbs}
        backHref={pageChrome.back?.href}
        backLabel={pageChrome.back?.label}
        onNavigate={(href) => {
          if (href === pathname) {
            return;
          }
          navigate(href);
        }}
        brand={{
          title: BRAND.webTitle,
          icon: <BrandIconSvg size={20} />,
          href: CLIENT_AUTH_ROUTES.dashboard,
        }}
        navEntries={navEntries}
        endContent={<ShopHeaderActions lang={shell} isAuthenticated={isAuthenticated} />}
      >
        {hydrated ? children : <AuthBootstrapFallback />}
      </ShellTopNavLayout>
      <CartDrawer />
    </CartProvider>
  );
}
