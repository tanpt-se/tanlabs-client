'use client';

import { useMemo, useState, type FormEvent } from 'react';

import { ApiError } from '@tanlabs/contracts';
import { z } from 'zod';

import { getPublicAuthRuntime } from './public-auth-runtime';

export function createForgotPasswordSchema(lang: {
  validation: { emailRequired: string; emailInvalid: string };
}) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, lang.validation.emailRequired)
      .email(lang.validation.emailInvalid),
  });
}

export function createResetPasswordSchema(lang: {
  validation: {
    tokenRequired: string;
    newPasswordRequired: string;
    newPasswordLength: string;
    confirmPasswordRequired: string;
    confirmPasswordMismatch: string;
  };
}) {
  return z
    .object({
      token: z.string().trim().min(1, lang.validation.tokenRequired),
      newPassword: z
        .string()
        .min(1, lang.validation.newPasswordRequired)
        .min(10, lang.validation.newPasswordLength)
        .max(128, lang.validation.newPasswordLength),
      confirmPassword: z.string().min(1, lang.validation.confirmPasswordRequired),
    })
    .refine((value) => value.newPassword === value.confirmPassword, {
      path: ['confirmPassword'],
      message: lang.validation.confirmPasswordMismatch,
    });
}


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

export function useForgotPasswordForm(lang: {
  validation: { emailRequired: string; emailInvalid: string };
  authErrors: {
    rateLimited: string;
    deliveryFailed: string;
    validationError: string;
    generic: string;
  };
}) {
  const { requests } = getPublicAuthRuntime();
  const schema = useMemo(() => createForgotPasswordSchema(lang), [lang]);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const result = schema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0]?.message || lang.authErrors.generic);
      return;
    }
    setLoading(true);
    try {
      await requests.forgotPasswordRequest({ email: result.data.email });
      setIsSubmitted(true);
    } catch (err) {
      setIsSubmitted(false);
      if (err instanceof ApiError) {
        setError(getForgotPasswordErrorMessage(err, lang.authErrors));
      } else {
        setError(lang.authErrors.generic);
      }
    } finally {
      setLoading(false);
    }
  };

  return { email, error, isSubmitted, loading, setEmail, submit };
}
