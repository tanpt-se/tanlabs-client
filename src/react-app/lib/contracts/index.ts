export {
  ADMIN_ROLE,
  DEFAULT_CLIENT_ROLE,
  SUPER_ADMIN_ROLE,
  adminPermissionCatalog,
  adminPermissionKeys,
  clientPermissionCatalog,
  clientPermissionKeys,
  hasAnyPermission,
  hasPermission,
  isAdminAudience,
  isClientAudience,
  isSuperAdmin,
  sharedPermissionCatalog,
  type SharedPermissionKey,
} from './access';
export interface ErrorEnvelope {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  requestId?: string;
}

export interface SessionSummary {
  id: string;
  status: 'active' | 'revoked' | 'expired' | 'compromised';
}

export interface AuthUserSummary {
  id: string;
  email: string;
  permissions?: string[];
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string;
  twoFactorMethod?: 'totp' | 'email_otp';
  twoFactorChallengeId?: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  session: SessionSummary;
  user: AuthUserSummary;
}

export interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
  session: SessionSummary;
}

export interface ErrorResponseEnvelope {
  error?: {
    code?: string;
    message?: string;
    details?: Record<string, unknown>;
  };
  requestId?: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
  }
}

export async function parseJsonBody<T>(response: Response): Promise<T | ErrorResponseEnvelope> {
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text) as T | ErrorResponseEnvelope;
}

interface FlatApiErrorBody {
  code?: string;
  message?: string;
  status?: number;
  details?: Record<string, unknown>;
}

function extractApiErrorFields(data: unknown): {
  code?: string;
  message?: string;
  details?: Record<string, unknown>;
} {
  if (typeof data !== 'object' || data === null) {
    return {};
  }

  const nested = data as ErrorResponseEnvelope;
  if (nested.error && typeof nested.error === 'object') {
    return {
      code: nested.error.code,
      message: nested.error.message,
      details: nested.error.details,
    };
  }

  const flat = data as FlatApiErrorBody;
  if (typeof flat.code === 'string' || typeof flat.message === 'string') {
    return {
      code: flat.code,
      message: flat.message,
      details: flat.details,
    };
  }

  return {};
}

export function toApiError(response: Response, data: ErrorResponseEnvelope | unknown): ApiError {
  const { code, message, details } = extractApiErrorFields(data);

  return new ApiError(
    response.status,
    message || 'An error occurred',
    code,
    details,
  );
}

export function withQuery(
  path: string,
  query: Record<string, string | number | undefined>,
): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    params.set(key, String(value));
  });
  const search = params.toString();
  return search ? `${path}?${search}` : path;
}

export function buildPathWithSearch(pathname: string, search: string): string {
  return search ? `${pathname}?${search}` : pathname;
}
