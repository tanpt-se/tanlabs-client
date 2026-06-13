import { ApiError } from '@tanlabs/contracts';
import { z } from 'zod';

import { type AuthErrorLang, getAuthErrorMessage } from './auth-error';
import type { PendingTwoFactorState } from './auth-error';

export interface LoginValidationLang {
  validation: {
    emailRequired: string;
    emailInvalid: string;
    passwordRequired: string;
    twoFactorCodeRequired: string;
    twoFactorCodeInvalid: string;
  };
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
