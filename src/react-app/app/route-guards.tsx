import { useCallback, useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { clientAuthConfig } from '@/auth-config';
import { AuthBootstrapFallback } from '@/ui/loading';
import {
  canAttemptSilentAuthRefresh,
  clearSession,
  getToken,
  hasRefreshCookie,
  resolveGuestProtectedRedirect,
  SESSION_CLEARED_EVENT,
} from '@/shared/auth';
import { isAccessTokenValid } from '@/shared/auth/access-token';
import { refreshSession } from '@/shared/http/client';
import {
  DEFAULT_AUTHENTICATED_REDIRECT,
  LOGIN_NEXT_QUERY_PARAM,
  resolveAuthenticatedRedirect,
} from '@/shared/routing';

type AuthGateStatus = 'checking' | 'allowed' | 'denied';

function hasValidAccessToken(): boolean {
  const token = getToken();
  return Boolean(token && isAccessTokenValid(token));
}

export function ProtectedRoute() {
  const location = useLocation();
  const [status, setStatus] = useState<AuthGateStatus>(() => {
    if (hasValidAccessToken()) {
      return 'allowed';
    }

    if (!canAttemptSilentAuthRefresh() || !hasRefreshCookie(clientAuthConfig.cookies.refresh)) {
      return 'denied';
    }

    return 'checking';
  });

  const verifyAuth = useCallback(async () => {
    if (hasValidAccessToken()) {
      setStatus('allowed');
      return;
    }

    if (!canAttemptSilentAuthRefresh() || !hasRefreshCookie(clientAuthConfig.cookies.refresh)) {
      setStatus('denied');
      return;
    }

    setStatus('checking');

    try {
      await refreshSession();
      setStatus(hasValidAccessToken() ? 'allowed' : 'denied');
    } catch {
      clearSession();
      setStatus('denied');
    }
  }, []);

  useEffect(() => {
    if (hasValidAccessToken()) {
      setStatus('allowed');
      return;
    }

    if (!canAttemptSilentAuthRefresh() || !hasRefreshCookie(clientAuthConfig.cookies.refresh)) {
      setStatus('denied');
      return;
    }

    void verifyAuth();
  }, [verifyAuth, location.pathname, location.search]);

  useEffect(() => {
    const handleSessionCleared = () => {
      if (!hasValidAccessToken() && !hasRefreshCookie(clientAuthConfig.cookies.refresh)) {
        setStatus('denied');
      }
    };

    window.addEventListener(SESSION_CLEARED_EVENT, handleSessionCleared);
    return () => window.removeEventListener(SESSION_CLEARED_EVENT, handleSessionCleared);
  }, []);

  if (status === 'checking') {
    return <AuthBootstrapFallback />;
  }

  if (status === 'denied') {
    return (
      <Navigate
        to={resolveGuestProtectedRedirect(location.pathname, location.search)}
        replace
      />
    );
  }

  return <Outlet />;
}

export function PublicRoute() {
  const location = useLocation();
  const [ready, setReady] = useState(() => hasValidAccessToken() || !canAttemptSilentAuthRefresh());
  const [redirectTo, setRedirectTo] = useState<string | null>(() => {
    if (!hasValidAccessToken()) {
      return null;
    }

    const nextParam = new URLSearchParams(location.search).get(LOGIN_NEXT_QUERY_PARAM);
    return resolveAuthenticatedRedirect(nextParam ?? undefined);
  });

  useEffect(() => {
    let active = true;

    const check = async () => {
      const nextParam = new URLSearchParams(location.search).get(LOGIN_NEXT_QUERY_PARAM);
      const destination = resolveAuthenticatedRedirect(nextParam ?? undefined);

      if (hasValidAccessToken()) {
        if (active) {
          setRedirectTo(destination);
          setReady(true);
        }
        return;
      }

      if (!canAttemptSilentAuthRefresh()) {
        if (active) {
          setRedirectTo(null);
          setReady(true);
        }
        return;
      }

      if (!hasRefreshCookie(clientAuthConfig.cookies.refresh)) {
        if (active) {
          setRedirectTo(null);
          setReady(true);
        }
        return;
      }

      try {
        await refreshSession();
        if (active) {
          setRedirectTo(hasValidAccessToken() ? destination : null);
          setReady(true);
        }
      } catch {
        clearSession();
        if (active) {
          setRedirectTo(null);
          setReady(true);
        }
      }
    };

    void check();

    return () => {
      active = false;
    };
  }, [location.search]);

  useEffect(() => {
    const handleSessionCleared = () => {
      setRedirectTo(null);
      setReady(true);
    };

    window.addEventListener(SESSION_CLEARED_EVENT, handleSessionCleared);
    return () => window.removeEventListener(SESSION_CLEARED_EVENT, handleSessionCleared);
  }, []);

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
