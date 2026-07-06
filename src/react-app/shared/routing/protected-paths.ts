import { CLIENT_AUTH_ROUTES } from '@/shared/routing';

export function isClientProtectedPath(pathname: string): boolean {
  return (
    pathname === CLIENT_AUTH_ROUTES.settings ||
    pathname.startsWith(`${CLIENT_AUTH_ROUTES.settings}/`)
  );
}
