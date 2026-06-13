'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { BrandIconSvg } from '@tanlabs/assets';
import { TopRouteProgress } from '@tanlabs/components';
import { BRAND } from '@tanlabs/config';
import { MainLayout } from '@tanlabs/providers';
import { SessionWatchdog } from '@tanlabs/web-common/auth/components/session-watchdog';

import { getClientConfig } from '@/config/env';
import { CLIENT_API_ROUTES } from '@/shared/api';
import { type SessionUser, clearSession, getToken, getUser, hydrateSession } from '@/shared/auth';
import { api, logoutSession, refreshSession } from '@/shared/http/client';
import { type ClientLang, resolveDashboardHeaderText } from '@/shared/i18n';
import { CLIENT_PUBLIC_ROUTES } from '@/shared/routing';

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
  const [adminUser, setAdminUser] = useState<SessionUser | null>(() => getUser());
  const [isRouteChanging, setIsRouteChanging] = useState(false);
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
      setAdminUser((current) => {
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

  useEffect(() => {
    setIsRouteChanging(false);
  }, [pathname]);

  const headerText = resolveDashboardHeaderText(pathname, lang);
  const userEmail = adminUser?.email ?? '';
  const userName = userEmail ? userEmail.split('@')[0] : headerText.fallbackUser;
  const userRole = adminUser?.role
    ? adminUser.role.charAt(0).toUpperCase() + adminUser.role.slice(1)
    : 'Admin';
  const sidebarGroups = buildDashboardShellNavigation({ pathname, shell });
  const activeGroupLabel = sidebarGroups.find((group) =>
    group.items.some((item) => item.active),
  )?.label;
  const breadcrumbs = [];
  if (activeGroupLabel) {
    breadcrumbs.push({ label: activeGroupLabel });
  }
  breadcrumbs.push({ label: headerText.title, description: headerText.description });

  return (
    <>
      {isRouteChanging ? <TopRouteProgress /> : null}
      {hydrated && (
        <SessionWatchdog
          intervalMs={getClientConfig().sessionWatchdog.intervalMs}
          probe={probeSession}
        />
      )}
      <MainLayout
        breadcrumbs={breadcrumbs}
        onNavigate={(href) => {
          if (href === pathname) {
            return;
          }
          setIsRouteChanging(true);
          navigate(href);
        }}
        brand={{
          title: BRAND.adminTitle,
          subtitle: userRole,
          icon: <BrandIconSvg app="web" size={20} />,
        }}
        sidebarGroups={sidebarGroups}
        userMenu={{
          userName,
          email: userEmail,
          avatar: userName.slice(0, 1).toUpperCase(),
          logoutLabel: headerText.logout,
          onLogout: async () => {
            await logoutSession();
            navigate(CLIENT_PUBLIC_ROUTES.login, { replace: true });
          },
        }}
        content={<div className="flex h-full flex-col overflow-y-auto p-4">{children}</div>}
      />
    </>
  );
}
