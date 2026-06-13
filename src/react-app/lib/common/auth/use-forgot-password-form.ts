'use client';

import { useMemo, useState } from 'react';

import { ApiError } from '@tanlabs/contracts';

import { getForgotPasswordErrorMessage } from './password-recovery-errors';
import { createForgotPasswordSchema } from './password-recovery.schema';
import { type PublicAuthApp, bindPublicAuthRuntime } from './runtime-access';

export function useForgotPasswordForm(
  app: PublicAuthApp,
  lang: {
    validation: { emailRequired: string; emailInvalid: string };
    authErrors: {
      rateLimited: string;
      deliveryFailed: string;
      validationError: string;
      generic: string;
    };
  },
) {
  const getPublicAuthRuntime = bindPublicAuthRuntime(app);
  const { requests } = getPublicAuthRuntime();
  const schema = useMemo(() => createForgotPasswordSchema(lang), [lang]);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
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
