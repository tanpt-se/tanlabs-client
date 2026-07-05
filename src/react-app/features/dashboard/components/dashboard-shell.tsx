'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { BrandIconSvg } from '@tanlabs/assets';
import { BRAND } from '@tanlabs/config';
import { ShellSideNavLayout } from '@/ui/shell-side-nav';
import { SessionWatchdog } from '@/features/auth';
import { AuthBootstrapFallback } from '@/ui/loading';

import { getClientConfig } from '@/shared/config/env';
import { CLIENT_API_ROUTES } from '@/shared/http';
import { type SessionUser, clearSession, getToken, getUser, hydrateSession } from '@/shared/auth';
import { isAccessTokenValid } from '@/shared/auth/access-token';
import { api, refreshSession } from '@/shared/http/client';
import { type ClientLang, resolveDashboardPageChrome } from '@/shared/i18n';
import { CLIENT_AUTH_ROUTES, CLIENT_PUBLIC_ROUTES, LOGIN_NEXT_QUERY_PARAM } from '@/shared/routing';

import { buildDashboardShellNavigation } from './dashboard-shell-navigation';

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
  const [hydrated, setHydrated] = useState(false);

  const probeSession = useCallback(() => api.get(CLIENT_API_ROUTES.account.me), []);

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

    const bootstrap = async () => {
      if (initialAccessToken) {
        hydrateSession({ accessToken: initialAccessToken });
        syncAuthSnapshot();
        setHydrated(true);
        return;
      }

      const token = getToken();
      if (token && isAccessTokenValid(token)) {
        syncAuthSnapshot();
        setHydrated(true);
        return;
      }

      try {
        await refreshSession();
      } catch {
        clearSession();
        if (active) {
          const next = `${pathname}${search}`;
          navigate(
            `${CLIENT_PUBLIC_ROUTES.login}?${LOGIN_NEXT_QUERY_PARAM}=${encodeURIComponent(next)}`,
            { replace: true },
          );
        }
        return;
      }
      syncAuthSnapshot();
      setHydrated(true);
    };

    void bootstrap();

    return () => {
      active = false;
    };
  }, [initialAccessToken, navigate, pathname, search]);

  const pageChrome = resolveDashboardPageChrome(pathname, lang);
  const userRole = sessionUser?.role
    ? sessionUser.role.charAt(0).toUpperCase() + sessionUser.role.slice(1)
    : 'User';
  const navGroups = buildDashboardShellNavigation({ pathname, shell });

  return (
    <>
      {hydrated && (
        <SessionWatchdog
          intervalMs={getClientConfig().sessionWatchdog.intervalMs}
          probe={probeSession}
        />
      )}
      <ShellSideNavLayout
        breadcrumbs={pageChrome.breadcrumbs}
        onNavigate={(href) => {
          if (href === pathname) {
            return;
          }
          navigate(href);
        }}
        brand={{
          title: BRAND.webTitle,
          subtitle: userRole,
          icon: <BrandIconSvg size={20} />,
          href: CLIENT_AUTH_ROUTES.dashboard,
        }}
        navGroups={navGroups}
      >
        {hydrated ? children : <AuthBootstrapFallback />}
      </ShellSideNavLayout>
    </>
  );
}
