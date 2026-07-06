import { CLIENT_AUTH_ROUTES } from '@/shared/routing';
import { buildOpenShopLoginUrl } from '@/shared/routing/shop-login';

const SUPPRESS_SILENT_AUTH_KEY = 'tanlabs:suppress-silent-auth';

let logoutIntentActive = false;

export function beginClientLogoutIntent(): void {
  logoutIntentActive = true;
}

export function endClientLogoutIntent(): void {
  logoutIntentActive = false;
}

export function isClientLogoutIntentActive(): boolean {
  return logoutIntentActive;
}

/** After explicit logout, block silent refresh until the user signs in again. */
export function markClientLoggedOut(): void {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.setItem(SUPPRESS_SILENT_AUTH_KEY, '1');
}

export function clearClientLoggedOutMark(): void {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.removeItem(SUPPRESS_SILENT_AUTH_KEY);
}

export function shouldSuppressSilentAuth(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return sessionStorage.getItem(SUPPRESS_SILENT_AUTH_KEY) === '1';
}

export function canAttemptSilentAuthRefresh(): boolean {
  return !shouldSuppressSilentAuth();
}

export function resolveGuestProtectedRedirect(pathname: string, search: string): string {
  if (logoutIntentActive) {
    return CLIENT_AUTH_ROUTES.dashboard;
  }

  const next = `${pathname}${search}`;
  return buildOpenShopLoginUrl(next);
}
