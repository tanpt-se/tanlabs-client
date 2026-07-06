import { clientAuthConfig } from '@/auth-config';

export function hasRefreshCookie(cookieName = clientAuthConfig.cookies.refresh): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .some((part) => part.startsWith(`${cookieName}=`));
}
