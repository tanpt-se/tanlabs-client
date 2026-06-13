import { ApiError } from '@tanlabs/contracts';

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
  adminPortalOnly?: string;
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
