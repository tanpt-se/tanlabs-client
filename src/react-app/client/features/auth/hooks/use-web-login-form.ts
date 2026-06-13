'use client';

import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { isClientAudience } from '@tanlabs/contracts';
import type { LoginResponse } from '@tanlabs/contracts';
import {
  type AuthErrorLang,
  type PendingTwoFactorState,
  createPrimaryLoginSchema,
  createTwoFactorLoginSchema,
  resolveLoginRequestError,
  validateLoginSubmission,
} from '@tanlabs/platform';

import {
  clearStoredLoginRateLimit,
  persistLoginRateLimit,
  restoreLoginRateLimit,
} from '@/features/auth/services/login-rate-limit';
import { getPublicAuthRuntime } from '@/shared/auth/public-auth-runtime';

export function useWebLoginForm<
  TLang extends {
    loginFailed: string;
    validation: {
      emailRequired: string;
      emailInvalid: string;
      passwordRequired: string;
      twoFactorCodeRequired: string;
      twoFactorCodeInvalid: string;
    };
    authErrors: AuthErrorLang;
  },
>(
  lang: TLang,
  nextPath: string | undefined,
  resolveAuthenticatedRedirect: (path?: string) => string,
) {
  const navigate = useNavigate();
  const runtime = getPublicAuthRuntime();
  const resolvedNextPath = resolveAuthenticatedRedirect(nextPath);
  const primarySchema = useMemo(() => createPrimaryLoginSchema(lang), [lang]);
  const twoFactorSchema = useMemo(() => createTwoFactorLoginSchema(lang), [lang]);
  const [email, setEmailState] = useState('');
  const [password, setPasswordState] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [pendingTwoFactor, setPendingTwoFactor] = useState<PendingTwoFactorState | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rateLimitedUntil, setRateLimitedUntil] = useState<number | null>(() =>
    restoreLoginRateLimit(),
  );
  const isRateLimited = Boolean(rateLimitedUntil && rateLimitedUntil > Date.now());

  const clearRateLimit = () => {
    clearStoredLoginRateLimit();
    setRateLimitedUntil(null);
  };

  const clearTwoFactorState = () => {
    setPendingTwoFactor(null);
    setTwoFactorCode('');
  };

  const setEmail = (value: string) => {
    if (pendingTwoFactor && value !== email) clearTwoFactorState();
    setEmailState(value);
  };

  const setPassword = (value: string) => {
    if (pendingTwoFactor && value !== password) clearTwoFactorState();
    setPasswordState(value);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (isRateLimited) return;
    setError('');
    const validatedSubmission = validateLoginSubmission({
      primarySchema,
      twoFactorSchema,
      values: { email, password, twoFactorCode },
      pendingTwoFactor,
      fallbackMessage: lang.loginFailed,
    });
    if (!validatedSubmission.success) {
      setError(validatedSubmission.error);
      return;
    }

    setLoading(true);
    try {
      const response = await runtime.requests.loginRequest({
        email: validatedSubmission.email,
        password: validatedSubmission.password,
        twoFactorCode: validatedSubmission.twoFactorCode,
        twoFactorMethod: pendingTwoFactor?.method,
        twoFactorChallengeId: pendingTwoFactor?.challengeId,
      });
      const isExpectedAudience = isClientAudience({
        role: response.user.role,
        permissions: response.user.permissions,
      });
      if (!isExpectedAudience) {
        runtime.clearClientSession?.();
        setError(lang.authErrors.clientPortalOnly ?? lang.authErrors.generic);
        return;
      }

      clearTwoFactorState();
      clearRateLimit();
      runtime.saveClientSession?.(response as LoginResponse);
      navigate(resolvedNextPath, { replace: true });
    } catch (requestError) {
      const resolvedError = resolveLoginRequestError({
        error: requestError,
        authErrors: lang.authErrors,
        fallbackMessage: lang.loginFailed,
        includeRateLimit: true,
      });
      if (resolvedError.pendingTwoFactor) {
        setPendingTwoFactor(resolvedError.pendingTwoFactor);
        setError('');
      } else {
        if (resolvedError.blockedUntil) {
          persistLoginRateLimit(resolvedError.blockedUntil);
          setRateLimitedUntil(resolvedError.blockedUntil);
        }
        setError(resolvedError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    clearRateLimit,
    email,
    error,
    isRateLimited,
    loading,
    password,
    pendingTwoFactor,
    rateLimitedUntil,
    setEmail,
    setPassword,
    setTwoFactorCode,
    submit,
    twoFactorCode,
  };
}
