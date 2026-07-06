'use client';

import { useEffect } from 'react';

import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { getToken } from '@/shared/auth';
import { isAccessTokenValid } from '@/shared/auth/access-token';
import { resolveAuthenticatedRedirect } from '@/shared/routing';
import { LOGIN_NEXT_QUERY_PARAM } from '@/shared/routing/client-routes';

export function MiddlewareFallback({
  authenticatedRedirectPath,
  publicLoginPath,
}: {
  authenticatedRedirectPath: string;
  publicLoginPath: string;
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = getToken();
    if (!token || !isAccessTokenValid(token) || pathname !== publicLoginPath) {
      return;
    }

    const nextParam = searchParams.get(LOGIN_NEXT_QUERY_PARAM);
    navigate(resolveAuthenticatedRedirect(nextParam ?? authenticatedRedirectPath), {
      replace: true,
    });
  }, [authenticatedRedirectPath, navigate, pathname, publicLoginPath, searchParams]);

  return null;
}
