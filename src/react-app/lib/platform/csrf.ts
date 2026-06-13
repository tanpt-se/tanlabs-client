import { getClientCookie } from './client-cookie';

interface CsrfConfig {
  protectionEnabled: boolean;
  cookieName: string;
}

export function createCsrfHeadersBuilder(
  getConfig: () => { csrf: CsrfConfig },
  protectedPaths: Set<string>,
): (context: { method: string; path: string }) => HeadersInit | undefined {
  return function buildSensitiveActionHeaders(context) {
    const config = getConfig();
    if (!config.csrf.protectionEnabled || context.method !== 'POST') {
      return undefined;
    }

    const normalizedPath = context.path.split('?')[0];
    if (!normalizedPath || !protectedPaths.has(normalizedPath)) {
      return undefined;
    }

    const csrfToken = getClientCookie(config.csrf.cookieName);
    return csrfToken ? { 'x-csrf-token': csrfToken } : undefined;
  };
}
