'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';

import { useNavigate } from 'react-router-dom';

import { ApiError } from '@tanlabs/contracts';

import { createVerifyEmailSchema } from '@/features/auth/lib/public-auth-signup.schema';
import { getPublicAuthRuntime } from '@/shared/auth/public-auth-runtime';

function getVerifyEmailErrorMessage(
  error: ApiError,
  lang: { invalidCode: string; expiredCode: string; validationError: string; generic: string },
) {
  switch (error.code) {
    case 'AUTH_2FA_INVALID':
      return lang.invalidCode;
    case 'AUTH_2FA_CHALLENGE_INVALID':
    case 'AUTH_TOKEN_EXPIRED':
      return lang.expiredCode;
    case 'VALIDATION_ERROR':
      return lang.validationError;
    default:
      return lang.generic;
  }
}

export function useVerifyEmailForm(
  lang: {
    validation: { codeRequired: string; codeInvalid: string };
    authErrors: {
      invalidCode: string;
      expiredCode: string;
      validationError: string;
      generic: string;
    };
  },
  initialState: {
    challengeId?: string;
    verificationContextToken?: string;
    email?: string;
    resendAvailableIn?: number;
  },
) {
  const navigate = useNavigate();
  const { routes, requests } = getPublicAuthRuntime();
  const schema = useMemo(() => createVerifyEmailSchema(lang), [lang]);
  const [code, setCode] = useState('');
  const [challengeId, setChallengeId] = useState(initialState.challengeId ?? '');
  const [verificationContextToken, setVerificationContextToken] = useState(
    initialState.verificationContextToken ?? '',
  );
  const [email] = useState(initialState.email ?? '');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendAvailableIn, setResendAvailableIn] = useState(initialState.resendAvailableIn ?? 0);

  useEffect(() => {
    if (resendAvailableIn <= 0) return;
    const timeout = window.setTimeout(
      () => setResendAvailableIn((current) => Math.max(0, current - 1)),
      1000,
    );
    return () => window.clearTimeout(timeout);
  }, [resendAvailableIn]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const result = schema.safeParse({ code });
    if (!result.success) {
      setError(result.error.issues[0]?.message || lang.authErrors.generic);
      return;
    }
    setLoading(true);
    try {
      await requests.verifyEmailRequest({
        challengeId,
        verificationContextToken,
        code: result.data.code,
      });
      setIsSubmitted(true);
      setTimeout(() => navigate(routes.login, { replace: true }), 800);
    } catch (err) {
      setIsSubmitted(false);
      if (err instanceof ApiError) setError(getVerifyEmailErrorMessage(err, lang.authErrors));
      else setError(lang.authErrors.generic);
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError('');
    setResending(true);
    try {
      const response = await requests.resendEmailVerificationRequest({ verificationContextToken });
      setChallengeId(response.challengeId);
      setVerificationContextToken(response.verificationContextToken);
      setResendAvailableIn(response.resendAvailableIn);
    } catch (err) {
      if (err instanceof ApiError) setError(getVerifyEmailErrorMessage(err, lang.authErrors));
      else setError(lang.authErrors.generic);
    } finally {
      setResending(false);
    }
  };

  return {
    code,
    email,
    error,
    isSubmitted,
    loading,
    resend,
    resendAvailableIn,
    resending,
    setCode,
    submit,
  };
}
