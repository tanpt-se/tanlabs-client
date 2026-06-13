import {
  ApiError,
  type ErrorResponseEnvelope,
  type RefreshResponse,
  parseJsonBody,
  toApiError,
} from '@tanlabs/contracts';

function getDefaultApiBaseUrl(): string {
  const viteEnv = import.meta.env?.VITE_API_BASE as string | undefined;
  if (viteEnv) {
    return viteEnv.replace(/\/$/, '');
  }

  return '/api';
}

export interface RetryConfig {
  retries: number;
  baseDelayMs: number;
  jitter?: boolean;
}

export function computeRetryDelay(attempt: number, config: RetryConfig): number {
  const base = config.baseDelayMs * Math.pow(2, attempt - 1);
  if (!config.jitter) {
    return base;
  }

  const jitterFactor = Math.random();
  return Math.round(base * (0.5 + jitterFactor / 2));
}

export async function withRetry<T>(fn: () => Promise<T>, config: RetryConfig): Promise<T> {
  let attempt = 0;
  let lastError: unknown;

  while (attempt <= config.retries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      attempt += 1;
      if (attempt > config.retries) {
        break;
      }

      const delayMs = computeRetryDelay(attempt, config);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}

const REFRESHABLE_UNAUTHORIZED_CODES = new Set([
  'AUTH_TOKEN_EXPIRED',
  'AUTH_SESSION_REVOKED',
  'AUTH_REFRESH_INVALID',
  'AUTH_REFRESH_REUSED',
]);

function shouldAttemptRefreshFromUnauthorized(
  response: Response,
  data: ErrorResponseEnvelope | unknown,
): boolean {
  if (response.status !== 401) {
    return false;
  }

  let errorCode: string | undefined;
  if (typeof data === 'object' && data !== null) {
    if ('error' in data) {
      errorCode = (data as ErrorResponseEnvelope).error?.code;
    } else if ('code' in data && typeof (data as { code?: unknown }).code === 'string') {
      errorCode = (data as { code: string }).code;
    }
  }

  if (!errorCode) {
    return true;
  }

  return REFRESHABLE_UNAUTHORIZED_CODES.has(errorCode);
}

interface BrowserApiClientOptions {
  apiBaseUrl?: string;
  buildDefaultHeaders?: () => HeadersInit | undefined;
  buildSensitiveActionHeaders?: (context: {
    method: string;
    path: string;
  }) => HeadersInit | undefined;
  buildRefreshHeaders?: () => HeadersInit | undefined;
  clearSession: () => void;
  getToken: () => string | null;
  redirectToLogin?: () => void;
  saveRefresh: (refreshResponse: RefreshResponse) => void;
  retryConfig?: RetryConfig;
}

const PUBLIC_AUTH_PATHS = new Set([
  '/auth/login',
  '/auth/refresh',
  '/auth/forgot-password',
  '/auth/register',
  '/auth/email-verification/verify',
  '/auth/email-verification/resend',
  '/auth/reset-password',
  '/auth/account-setup',
]);

export function createBrowserApiClient({
  apiBaseUrl = getDefaultApiBaseUrl(),
  buildDefaultHeaders,
  buildSensitiveActionHeaders,
  buildRefreshHeaders,
  clearSession,
  getToken,
  redirectToLogin = () => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  },
  saveRefresh,
  retryConfig,
}: BrowserApiClientOptions) {
  let refreshInFlight: Promise<RefreshResponse> | null = null;
  const refreshLockKey = `authlab:refresh-lock:${apiBaseUrl}`;
  const refreshLockTtlMs = 12_000;
  const refreshLockPollMs = 120;

  function isFormBody(body: unknown): body is FormData {
    return typeof FormData !== 'undefined' && body instanceof FormData;
  }

  function buildHeaders(token: string | null, headersInit?: HeadersInit, body?: unknown): Headers {
    const headers = new Headers(headersInit);
    if (!isFormBody(body)) {
      headers.set('Content-Type', 'application/json');
    }
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  function mergeHeaders(base?: HeadersInit, extra?: HeadersInit): HeadersInit | undefined {
    if (!base && !extra) {
      return undefined;
    }

    const headers = new Headers(base);
    if (extra) {
      new Headers(extra).forEach((value, key) => {
        headers.set(key, value);
      });
    }

    return headers;
  }

  async function performRefreshSession(): Promise<RefreshResponse> {
    const config: RetryConfig = retryConfig ?? { retries: 2, baseDelayMs: 100, jitter: true };
    const response = await withRetry(
      () =>
        fetch(`${apiBaseUrl}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: buildHeaders(
            null,
            mergeHeaders(buildDefaultHeaders?.(), buildRefreshHeaders?.()),
          ),
        }).then((res) => {
          if (res.status >= 500) {
            throw new Error(`refresh failed with status ${res.status}`);
          }
          return res;
        }),
      config,
    );

    if (response.status === 204) {
      clearSession();
      throw new ApiError(500, 'Refresh response is empty', 'AUTH_REFRESH_INVALID');
    }

    const data = (await parseJsonBody<RefreshResponse>(response)) as
      | RefreshResponse
      | ErrorResponseEnvelope;

    if (!response.ok) {
      clearSession();
      throw toApiError(response, data as ErrorResponseEnvelope);
    }

    saveRefresh(data as RefreshResponse);
    return data as RefreshResponse;
  }

  function canUseBrowserStorage(): boolean {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return false;
    }

    try {
      const probeKey = `${refreshLockKey}:probe`;
      window.localStorage.setItem(probeKey, '1');
      window.localStorage.removeItem(probeKey);
      return true;
    } catch {
      return false;
    }
  }

  function nowMs(): number {
    return Date.now();
  }

  function makeOwnerId(): string {
    return `${nowMs()}:${Math.random().toString(36).slice(2)}`;
  }

  function readLock(): {
    ownerId: string;
    expiresAt: number;
  } | null {
    try {
      const raw = window.localStorage.getItem(refreshLockKey);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as { ownerId?: unknown; expiresAt?: unknown };
      if (typeof parsed.ownerId !== 'string' || typeof parsed.expiresAt !== 'number') {
        window.localStorage.removeItem(refreshLockKey);
        return null;
      }

      return { ownerId: parsed.ownerId, expiresAt: parsed.expiresAt };
    } catch {
      return null;
    }
  }

  function writeLock(ownerId: string, expiresAt: number): void {
    window.localStorage.setItem(refreshLockKey, JSON.stringify({ ownerId, expiresAt }));
  }

  function clearLock(ownerId: string): void {
    const lock = readLock();
    if (!lock || lock.ownerId === ownerId) {
      window.localStorage.removeItem(refreshLockKey);
    }
  }

  async function sleep(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function withRefreshMutex(run: () => Promise<RefreshResponse>): Promise<RefreshResponse> {
    if (!canUseBrowserStorage()) {
      return run();
    }

    const ownerId = makeOwnerId();
    const deadline = nowMs() + refreshLockTtlMs;

    while (nowMs() <= deadline) {
      const lock = readLock();
      const currentTime = nowMs();
      const hasActiveOwner = Boolean(lock && lock.expiresAt > currentTime);

      if (!hasActiveOwner) {
        writeLock(ownerId, currentTime + refreshLockTtlMs);
        const confirmed = readLock();
        if (confirmed?.ownerId === ownerId) {
          try {
            return await run();
          } finally {
            clearLock(ownerId);
          }
        }
      }

      await sleep(refreshLockPollMs);
    }

    return run();
  }

  async function refreshSession(): Promise<RefreshResponse> {
    if (refreshInFlight) {
      return refreshInFlight;
    }

    refreshInFlight = withRefreshMutex(performRefreshSession).finally(() => {
      refreshInFlight = null;
    });

    return refreshInFlight;
  }

  async function logoutSession(): Promise<void> {
    try {
      const sensitiveHeaders = buildSensitiveActionHeaders?.({
        method: 'POST',
        path: '/auth/logout',
      });
      await fetch(`${apiBaseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: buildHeaders(getToken(), mergeHeaders(buildDefaultHeaders?.(), sensitiveHeaders)),
      });
    } finally {
      clearSession();
    }
  }

  async function request<T>(
    path: string,
    options: RequestInit = {},
    allowRetry = true,
  ): Promise<T> {
    const method = (options.method || 'GET').toUpperCase();
    const normalizedPath = path.split('?')[0];
    const isAuthBootstrapPath = Boolean(normalizedPath && PUBLIC_AUTH_PATHS.has(normalizedPath));
    let token = getToken();

    if (!token && !isAuthBootstrapPath) {
      try {
        await refreshSession();
        token = getToken();
      } catch (error) {
        redirectToLogin();
        throw error instanceof ApiError
          ? error
          : new ApiError(401, 'Authentication required', 'AUTH_REFRESH_INVALID');
      }
    }

    const sensitiveHeaders = buildSensitiveActionHeaders?.({ method, path });
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      credentials: 'include',
      headers: buildHeaders(
        token,
        mergeHeaders(buildDefaultHeaders?.(), mergeHeaders(options.headers, sensitiveHeaders)),
        options.body,
      ),
    });

    if (response.status === 204) {
      return { success: true } as T;
    }

    const data = (await parseJsonBody<T>(response)) as T | ErrorResponseEnvelope;

    if (!response.ok) {
      if (shouldAttemptRefreshFromUnauthorized(response, data) && !isAuthBootstrapPath) {
        if (allowRetry) {
          try {
            await refreshSession();
            return request<T>(path, options, false);
          } catch (refreshError) {
            clearSession();
            redirectToLogin();
            throw refreshError;
          }
        }

        clearSession();
        redirectToLogin();
      }

      throw toApiError(response, data as ErrorResponseEnvelope);
    }

    return data as T;
  }

  return {
    api: {
      get: <T>(path: string) => request<T>(path),
      post: <T>(path: string, body?: unknown, options?: RequestInit) =>
        request<T>(path, {
          ...options,
          method: 'POST',
          body: body ? (isFormBody(body) ? body : JSON.stringify(body)) : null,
        }),
      put: <T>(path: string, body?: unknown, options?: RequestInit) =>
        request<T>(path, { ...options, method: 'PUT', body: body ? JSON.stringify(body) : null }),
      patch: <T>(path: string, body?: unknown, options?: RequestInit) =>
        request<T>(path, {
          ...options,
          method: 'PATCH',
          body: body ? JSON.stringify(body) : null,
        }),
      delete: <T>(path: string, options?: RequestInit) =>
        request<T>(path, { ...options, method: 'DELETE' }),
    },
    logoutSession,
    refreshSession,
  };
}
