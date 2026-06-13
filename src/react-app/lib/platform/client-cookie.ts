type SameSiteValue = 'Lax' | 'Strict';

export interface ClientCookieOptions {
  maxAge?: number;
  path?: string;
  sameSite?: SameSiteValue;
  secure?: boolean;
}

export function resolveClientCookiePolicy(protocol?: string): {
  secure: boolean;
  sameSite: SameSiteValue;
} {
  if (!protocol && typeof window === 'undefined') {
    return { secure: false, sameSite: 'Lax' };
  }

  const effectiveProtocol = protocol ?? window.location.protocol;
  const secure = effectiveProtocol === 'https:';
  return { secure, sameSite: secure ? 'Strict' : 'Lax' };
}

function buildCookieAttributes(options: ClientCookieOptions = {}): string {
  const defaults = resolveClientCookiePolicy();
  const secure = options.secure ?? defaults.secure;
  const sameSite = options.sameSite ?? defaults.sameSite;
  const path = options.path ?? '/';

  const parts = [`Path=${path}`, `SameSite=${sameSite}`];

  if (typeof options.maxAge === 'number') {
    parts.push(`Max-Age=${options.maxAge}`);
  }

  if (secure) {
    parts.push('Secure');
  }

  return parts.join('; ');
}

export function setClientCookie(
  name: string,
  value: string,
  options: ClientCookieOptions = {},
): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${name}=${value}; ${buildCookieAttributes(options)}`;
}

export function deleteClientCookie(name: string, options: ClientCookieOptions = {}): void {
  setClientCookie(name, '', { ...options, maxAge: 0 });
}

export function getClientCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const prefix = `${name}=`;
  const cookieEntry = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return cookieEntry ? cookieEntry.slice(prefix.length) : null;
}
