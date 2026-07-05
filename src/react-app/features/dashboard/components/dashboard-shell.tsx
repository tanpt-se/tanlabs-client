'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { BrandIconSvg } from '@tanlabs/assets';
import { BRAND } from '@tanlabs/config';
import { ShellSideNavLayout } from '@/ui/shell-side-nav';
import { SessionWatchdog } from '@/features/auth';

import { getClientConfig } from '@/shared/config/env';
import { CLIENT_API_ROUTES } from '@/shared/http';
import { type SessionUser, clearSession, getToken, getUser, hydrateSession } from '@/shared/auth';
import { api, logoutSession, refreshSession } from '@/shared/http/client';
import { type ClientLang, resolveDashboardHeaderText } from '@/shared/i18n';
import { CLIENT_AUTH_ROUTES, CLIENT_PUBLIC_ROUTES } from '@/shared/routing';

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

  const { pathname } = useLocation();
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

      try {
        await refreshSession();
      } catch {
        clearSession();
        if (active) {
          navigate(CLIENT_PUBLIC_ROUTES.login, { replace: true });
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
  }, [initialAccessToken, navigate]);

  const headerText = resolveDashboardHeaderText(pathname, lang);
  const userEmail = sessionUser?.email ?? '';
  const userName = userEmail ? userEmail.split('@')[0] : headerText.fallbackUser;
  const userRole = sessionUser?.role
    ? sessionUser.role.charAt(0).toUpperCase() + sessionUser.role.slice(1)
    : 'User';
  const navGroups = buildDashboardShellNavigation({ pathname, shell });
  const breadcrumbs =
    pathname === CLIENT_AUTH_ROUTES.settings
      ? [
          { label: shell.nav.dashboard, href: CLIENT_AUTH_ROUTES.dashboard },
          { label: headerText.title, description: headerText.description },
        ]
      : [{ label: headerText.breadcrumb, description: headerText.description }];

  return (
    <>
      {hydrated && (
        <SessionWatchdog
          intervalMs={getClientConfig().sessionWatchdog.intervalMs}
          probe={probeSession}
        />
      )}
      <ShellSideNavLayout
        breadcrumbs={breadcrumbs}
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
        userMenu={{
          userName,
          email: userEmail,
          logoutLabel: headerText.logout,
          onLogout: async () => {
            await logoutSession();
            navigate(CLIENT_PUBLIC_ROUTES.login, { replace: true });
          },
        }}
      >
        {children}
      </ShellSideNavLayout>
    </>
  );
}
