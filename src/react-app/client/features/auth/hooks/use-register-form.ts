'use client';

import { useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { ApiError } from '@tanlabs/contracts';

import { createRegisterSchema } from '@/features/auth/lib/public-auth-signup.schema';
import { getPublicAuthRuntime } from '@/shared/auth/public-auth-runtime';

function getRegisterErrorMessage(
  error: ApiError,
  lang: {
    captchaInvalid: string;
    duplicateEmail: string;
    validationError: string;
    generic: string;
  },
) {
  switch (error.code) {
    case 'AUTH_CAPTCHA_INVALID':
      return lang.captchaInvalid;
    case 'CONFLICT':
      return lang.duplicateEmail;
    case 'VALIDATION_ERROR':
      return lang.validationError;
    default:
      return lang.generic;
  }
}

export function useRegisterForm(lang: {
  validation: {
    emailRequired: string;
    emailInvalid: string;
    displayNameRequired: string;
    passwordLength: string;
    confirmPasswordRequired: string;
    captchaRequired: string;
    passwordLetterNumber: string;
    passwordBlocked: string;
    passwordContainsEmail: string;
    passwordContainsEmailLocalPart: string;
    passwordTooWeak: string;
    confirmPasswordMismatch: string;
  };
  authErrors: {
    captchaInvalid: string;
    duplicateEmail: string;
    validationError: string;
    generic: string;
  };
}) {
  const navigate = useNavigate();
  const { routes, requests } = getPublicAuthRuntime();
  const requiresCaptcha = Boolean(getPublicAuthRuntime().getTurnstileSiteKey());
  const schema = useMemo(
    () => createRegisterSchema(lang, { requiresCaptcha }),
    [lang, requiresCaptcha],
  );
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const result = schema.safeParse({
      email,
      displayName,
      password,
      confirmPassword,
      captchaToken: requiresCaptcha ? captchaToken : 'dev-bypass',
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message || lang.authErrors.generic);
      return;
    }
    setLoading(true);
    try {
      const response = await requests.registerRequest(result.data);
      const params = new URLSearchParams({
        email: response.email,
        challengeId: response.challengeId,
        verificationContextToken: response.verificationContextToken,
      });
      navigate(`${routes.verifyEmail}?${params.toString()}`, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) setError(getRegisterErrorMessage(err, lang.authErrors));
      else setError(lang.authErrors.generic);
    } finally {
      setLoading(false);
    }
  };

  return {
    captchaToken,
    confirmPassword,
    displayName,
    email,
    error,
    loading,
    password,
    setCaptchaToken,
    setConfirmPassword,
    setDisplayName,
    setEmail,
    setPassword,
    submit,
  };
}
