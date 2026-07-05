import { ApiError } from '@tanlabs/contracts';
import { z } from 'zod';

export interface PendingTwoFactorState {
  method: 'totp' | 'email_otp';
  challengeId?: string;
}

export interface AuthErrorLang {
  invalidCredentials: string;
  twoFactorRequired: string;
  twoFactorInvalid: string;
  twoFactorChallengeInvalid: string;
  accountLocked: string;
  rateLimited: string;
  validationError: string;
  generic: string;
  accountSetupRequired?: string;
  emailNotVerified?: string;
  captchaInvalid?: string;
  reauthRequired?: string;
  tokenExpired?: string;
  sessionRevoked?: string;
  clientPortalOnly?: string;
}

export interface LoginValidationLang {
  validation: {
    emailRequired: string;
    emailInvalid: string;
    passwordRequired: string;
    twoFactorCodeRequired: string;
    twoFactorCodeInvalid: string;
  };
}

export function getAuthErrorMessage(error: ApiError, lang: AuthErrorLang): string {
  switch (error.code) {
    case 'AUTH_INVALID_CREDENTIALS':
      return lang.invalidCredentials;
    case 'AUTH_2FA_REQUIRED':
      return lang.twoFactorRequired;
    case 'AUTH_2FA_INVALID':
      return lang.twoFactorInvalid;
    case 'AUTH_2FA_CHALLENGE_INVALID':
      return lang.twoFactorChallengeInvalid;
    case 'AUTH_ACCOUNT_LOCKED':
      return lang.accountLocked;
    case 'AUTH_ACCOUNT_SETUP_REQUIRED':
      return lang.accountSetupRequired ?? lang.generic;
    case 'AUTH_EMAIL_NOT_VERIFIED':
      return lang.emailNotVerified ?? lang.generic;
    case 'AUTH_CAPTCHA_INVALID':
      return lang.captchaInvalid ?? lang.generic;
    case 'AUTH_RATE_LIMITED':
      return lang.rateLimited;
    case 'AUTH_REAUTH_REQUIRED':
      return lang.reauthRequired ?? lang.generic;
    case 'AUTH_TOKEN_EXPIRED':
      return lang.tokenExpired ?? lang.generic;
    case 'AUTH_SESSION_REVOKED':
      return lang.sessionRevoked ?? lang.generic;
    case 'VALIDATION_ERROR':
      return lang.validationError;
    default:
      return lang.generic;
  }
}

export function resolveLocalizedApiError(params: {
  error: unknown;
  fallback: string;
  codeMessages?: Partial<Record<string, string>>;
}): string {
  const { codeMessages, error, fallback } = params;

  if (error instanceof ApiError) {
    const code = typeof error.code === 'string' ? error.code : '';
    return (code ? codeMessages?.[code] : undefined) ?? fallback;
  }

  return fallback;
}

export function createPrimaryLoginSchema(lang: LoginValidationLang) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, lang.validation.emailRequired)
      .email(lang.validation.emailInvalid),
    password: z.string().min(1, lang.validation.passwordRequired),
  });
}

export function createTwoFactorLoginSchema(lang: LoginValidationLang) {
  return z.object({
    twoFactorCode: z
      .string()
      .trim()
      .min(1, lang.validation.twoFactorCodeRequired)
      .regex(/^\d{6}$/, lang.validation.twoFactorCodeInvalid),
  });
}

export function resolvePendingTwoFactor(error: ApiError): PendingTwoFactorState | null {
  if (error.code !== 'AUTH_2FA_REQUIRED') {
    return null;
  }

  return {
    method: (error.details?.twoFactorMethod as 'totp' | 'email_otp') ?? 'totp',
    challengeId: error.details?.twoFactorChallengeId as string | undefined,
  };
}

export function resolveRateLimitBlockedUntil(error: ApiError, now = Date.now()): number | null {
  if (error.code !== 'AUTH_RATE_LIMITED') {
    return null;
  }

  const blockedUntilValue =
    typeof error.details?.blockedUntil === 'string' ? Date.parse(error.details.blockedUntil) : NaN;
  const retryAfterSeconds =
    typeof error.details?.retryAfterSeconds === 'number' ? error.details.retryAfterSeconds : 0;
  const nextBlockedUntil =
    Number.isFinite(blockedUntilValue) && blockedUntilValue > now
      ? blockedUntilValue
      : now + retryAfterSeconds * 1000;

  return nextBlockedUntil > now ? nextBlockedUntil : null;
}

export function validateLoginSubmission(params: {
  primarySchema: ReturnType<typeof createPrimaryLoginSchema>;
  twoFactorSchema: ReturnType<typeof createTwoFactorLoginSchema>;
  values: {
    email: string;
    password: string;
    twoFactorCode: string;
  };
  pendingTwoFactor: PendingTwoFactorState | null;
  fallbackMessage: string;
}):
  | {
      success: true;
      email: string;
      password: string;
      twoFactorCode?: string;
    }
  | {
      success: false;
      error: string;
    } {
  const { fallbackMessage, pendingTwoFactor, primarySchema, twoFactorSchema, values } = params;
  const primaryResult = primarySchema.safeParse({
    email: values.email,
    password: values.password,
  });
  if (!primaryResult.success) {
    return {
      success: false,
      error: primaryResult.error.issues[0]?.message ?? fallbackMessage,
    };
  }

  if (!pendingTwoFactor) {
    return {
      success: true,
      email: primaryResult.data.email,
      password: primaryResult.data.password,
    };
  }

  const twoFactorResult = twoFactorSchema.safeParse({ twoFactorCode: values.twoFactorCode });
  if (!twoFactorResult.success) {
    return {
      success: false,
      error: twoFactorResult.error.issues[0]?.message ?? fallbackMessage,
    };
  }

  return {
    success: true,
    email: primaryResult.data.email,
    password: primaryResult.data.password,
    twoFactorCode: twoFactorResult.data.twoFactorCode,
  };
}

export function resolveLoginRequestError(params: {
  error: unknown;
  authErrors: AuthErrorLang;
  fallbackMessage: string;
  includeRateLimit?: boolean;
  now?: number;
}): {
  pendingTwoFactor: PendingTwoFactorState | null;
  message: string;
  blockedUntil: number | null;
} {
  const { authErrors, error, fallbackMessage, includeRateLimit = false, now } = params;
  if (!(error instanceof ApiError)) {
    return {
      pendingTwoFactor: null,
      message: fallbackMessage,
      blockedUntil: null,
    };
  }

  return {
    pendingTwoFactor: resolvePendingTwoFactor(error),
    message: getAuthErrorMessage(error, authErrors),
    blockedUntil: includeRateLimit ? resolveRateLimitBlockedUntil(error, now) : null,
  };
}

export function resolveAuthNoticeByReason<TNotice>(
  reason: string | undefined,
  notices: Record<string, TNotice>,
) {
  if (!reason) {
    return undefined;
  }

  return notices[reason];
}
