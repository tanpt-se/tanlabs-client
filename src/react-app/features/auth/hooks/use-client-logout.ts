import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  beginClientLogoutIntent,
  endClientLogoutIntent,
  markClientLoggedOut,
} from '@/shared/auth';
import { logoutSession } from '@/shared/http/client';
import { CLIENT_AUTH_ROUTES } from '@/shared/routing';

export function useClientLogout() {
  const navigate = useNavigate();

  return useCallback(async () => {
    beginClientLogoutIntent();
    markClientLoggedOut();

    try {
      await logoutSession();
      navigate(CLIENT_AUTH_ROUTES.dashboard, { replace: true });
    } finally {
      endClientLogoutIntent();
    }
  }, [navigate]);
}
