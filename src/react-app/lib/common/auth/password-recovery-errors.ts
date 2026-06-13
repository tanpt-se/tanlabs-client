import type { ApiError } from '@tanlabs/contracts';

export function getForgotPasswordErrorMessage(
  error: ApiError,
  lang: { rateLimited: string; deliveryFailed: string; validationError: string; generic: string },
): string {
  switch (error.code) {
    case 'AUTH_RATE_LIMITED':
      return lang.rateLimited;
    case 'AUTH_PASSWORD_RESET_DELIVERY_FAILED':
      return lang.deliveryFailed;
    case 'VALIDATION_ERROR':
      return lang.validationError;
    default:
      return lang.generic;
  }
}

export function getResetPasswordErrorMessage(
  error: ApiError,
  lang: {
    tokenExpired: string;
    invalidResetToken: string;
    validationError: string;
    generic: string;
  },
): string {
  switch (error.code) {
    case 'AUTH_TOKEN_EXPIRED':
      return lang.tokenExpired;
    case 'AUTH_PASSWORD_RESET_INVALID':
      return lang.invalidResetToken;
    case 'VALIDATION_ERROR':
      return lang.validationError;
    default:
      return lang.generic;
  }
}
