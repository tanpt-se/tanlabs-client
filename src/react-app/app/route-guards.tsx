import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { clientAuthConfig } from '@/auth-config';
import { AuthBootstrapFallback } from '@/ui/loading';
import { hasAuthCookie, getToken } from '@/shared/auth';
import { isAccessTokenValid } from '@/shared/auth/access-token';
import { refreshSession } from '@/shared/http/client';
import {
  CLIENT_PUBLIC_ROUTES,
  DEFAULT_AUTHENTICATED_REDIRECT,
  LOGIN_NEXT_QUERY_PARAM,
  resolveAuthenticatedRedirect,
} from '@/shared/routing';
import { useEffect, useState } from 'react';
import { clearSession } from '@/shared/auth';

function hasRefreshCookie(): boolean {
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .some((part) => part.startsWith(`${clientAuthConfig.cookies.refresh}=`));
}

export function ProtectedRoute() {
  const location = useLocation();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      const token = getToken();
      if (token && isAccessTokenValid(token)) {
        if (active) {
          setAllowed(true);
          setReady(true);
        }
        return;
      }

      if (!hasRefreshCookie()) {
        if (active) {
          setAllowed(false);
          setReady(true);
        }
        return;
      }

      try {
        await refreshSession();
        if (active) {
          setAllowed(true);
          setReady(true);
        }
      } catch {
        clearSession();
        if (active) {
          setAllowed(false);
          setReady(true);
        }
      }
    };

    void bootstrap();

    return () => {
      active = false;
    };
  }, []);

  if (!ready) {
    return <AuthBootstrapFallback />;
  }

  if (!allowed) {
    const next = `${location.pathname}${location.search}`;
    const loginUrl = `${CLIENT_PUBLIC_ROUTES.login}?${LOGIN_NEXT_QUERY_PARAM}=${encodeURIComponent(next)}`;
    return <Navigate to={loginUrl} replace />;
  }

  return <Outlet />;
}

export function PublicRoute() {
  const location = useLocation();
  const [ready, setReady] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const check = async () => {
      const nextParam = new URLSearchParams(location.search).get(LOGIN_NEXT_QUERY_PARAM);
      const destination = resolveAuthenticatedRedirect(nextParam ?? undefined);

      const token = getToken();
      if (token && isAccessTokenValid(token)) {
        if (active) {
          setRedirectTo(destination);
          setReady(true);
        }
        return;
      }

      if (hasAuthCookie() || hasRefreshCookie()) {
        try {
          await refreshSession();
          if (active) {
            setRedirectTo(destination);
            setReady(true);
          }
          return;
        } catch {
          clearSession();
        }
      }

      if (active) {
        setRedirectTo(null);
        setReady(true);
      }
    };

    void check();

    return () => {
      active = false;
    };
  }, [location.search]);

  if (!ready) {
    return <AuthBootstrapFallback />;
  }

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

export function RootRedirect() {
  return <Navigate to={DEFAULT_AUTHENTICATED_REDIRECT} replace />;
}
