export interface PublicAuthClientConfig {
  apiBaseUrl: string;
  oauth: {
    googleEnabled: boolean;
  };
  turnstile: {
    siteKey: string;
  };
  csrf: {
    protectionEnabled: boolean;
    cookieName: string;
  };
  sessionWatchdog: {
    intervalMs: number;
  };
}

function resolveSessionWatchdogInterval(value: string | undefined): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 10_000;
  }

  return Math.max(2_000, Math.floor(parsed));
}

function readEnv(key: string): string | undefined {
  const viteValue = import.meta.env[key as keyof ImportMetaEnv];
  if (typeof viteValue === 'string' && viteValue.length > 0) {
    return viteValue;
  }

  return undefined;
}

export function readPublicAuthClientConfig(csrfCookieFallback: string): PublicAuthClientConfig {
  const apiUrl = readEnv('VITE_API_BASE');

  return {
    apiBaseUrl: apiUrl?.replace(/\/$/, '') || '/api',
    oauth: {
      googleEnabled: readEnv('VITE_AUTH_GOOGLE_ENABLED') === 'true',
    },
    turnstile: {
      siteKey: readEnv('VITE_TURNSTILE_SITE_KEY') || '',
    },
    csrf: {
      protectionEnabled: readEnv('VITE_AUTH_CSRF_PROTECTION_ENABLED') === 'true',
      cookieName: readEnv('VITE_AUTH_CSRF_COOKIE_NAME') || csrfCookieFallback,
    },
    sessionWatchdog: {
      intervalMs: resolveSessionWatchdogInterval(readEnv('VITE_SESSION_WATCHDOG_INTERVAL_MS')),
    },
  };
}

const DEFAULT_MAX_ACTIVE_SESSIONS = 2;

export function readMaxActiveSessions(): number {
  const parsed = Number(readEnv('VITE_MAX_ACTIVE_SESSIONS'));
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_MAX_ACTIVE_SESSIONS;
  }

  return Math.max(1, Math.floor(parsed));
}
