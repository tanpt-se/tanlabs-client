import { parseAccessToken } from '@/shared/auth';

type AccessTokenClaims = {
  exp?: number;
};

export function isAccessTokenValid(token: string | null): boolean {
  if (!token) {
    return false;
  }

  const payload = parseAccessToken(token) as AccessTokenClaims | null;
  if (!payload?.exp) {
    return false;
  }

  return payload.exp * 1000 > Date.now() + 5_000;
}
