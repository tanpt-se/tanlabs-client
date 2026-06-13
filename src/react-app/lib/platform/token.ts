import { decodeBase64Url } from './client-encoding';

export function parseAccessToken<T = unknown>(token: string | null): T | null {
  if (!token) {
    return null;
  }

  const [, payload] = token.split('.');
  if (!payload) {
    return null;
  }

  const decoded = decodeBase64Url(payload);
  if (!decoded) {
    return null;
  }

  try {
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
}
