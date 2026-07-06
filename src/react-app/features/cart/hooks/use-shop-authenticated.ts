'use client';

import { useEffect, useState } from 'react';

import { getToken, SESSION_CLEARED_EVENT, SESSION_SAVED_EVENT } from '@/shared/auth';
import { isAccessTokenValid } from '@/shared/auth/access-token';

export function useShopAuthenticated(): boolean {
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const bumpRevision = () => setRevision((current) => current + 1);
    window.addEventListener(SESSION_CLEARED_EVENT, bumpRevision);
    window.addEventListener(SESSION_SAVED_EVENT, bumpRevision);
    return () => {
      window.removeEventListener(SESSION_CLEARED_EVENT, bumpRevision);
      window.removeEventListener(SESSION_SAVED_EVENT, bumpRevision);
    };
  }, []);

  const token = getToken();
  void revision;
  return Boolean(token && isAccessTokenValid(token));
}
