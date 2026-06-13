'use client';

import { useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

function hasCookieByName(cookieName: string): boolean {
  return document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .some((cookie) => cookie.startsWith(`${cookieName}=`));
}

export function MiddlewareFallback({
  authenticatedRedirectPath,
  authCookieName,
  publicLoginPath,
}: {
  authenticatedRedirectPath: string;
  authCookieName: string;
  publicLoginPath: string;
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const cookiePresent = hasCookieByName(authCookieName);
    if (cookiePresent && pathname === publicLoginPath) {
      navigate(authenticatedRedirectPath, { replace: true });
    }
  }, [authenticatedRedirectPath, authCookieName, navigate, pathname, publicLoginPath]);

  return null;
}
