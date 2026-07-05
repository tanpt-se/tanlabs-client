'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { Link } from '@astryxdesign/core/Link';
import { VStack } from '@astryxdesign/core/Layout';
import { TextInput } from '@astryxdesign/core/TextInput';
import { AuthFormCard } from '@/ui/login-card';

import { useForgotPasswordForm } from '@/features/auth/lib/password-recovery';

export type ForgotPasswordLang = {
  title?: string;
  description?: string;
  emailLabel: string;
  emailPlaceholder?: string;
  submit: string;
  submitting: string;
  backToLogin: string;
  successTitle: string;
  successDescription: string;
  authErrors: {
    rateLimited: string;
    deliveryFailed: string;
    validationError: string;
    generic: string;
  };
  validation: {
    emailRequired: string;
    emailInvalid: string;
  };
};

export function ForgotPasswordForm({
  backToLoginHref,
  lang,
  title,
  description,
}: {
  backToLoginHref: string;
  lang: ForgotPasswordLang;
  title?: string;
  description?: string;
}) {
  const resolvedTitle = title ?? lang.title ?? 'Forgot password';
  const resolvedDescription = description ?? lang.description ?? '';
  const { email, error, isSubmitted, loading, setEmail, submit } = useForgotPasswordForm(lang);

  return (
    <AuthFormCard title={resolvedTitle} subtitle={resolvedDescription || undefined}>
      {isSubmitted ? (
        <VStack gap={4} hAlign="stretch">
          <Banner status="success" title={lang.successTitle} description={lang.successDescription} />
          <VStack hAlign="center">
            <Link href={backToLoginHref} type="supporting">
              {lang.backToLogin}
            </Link>
          </VStack>
        </VStack>
      ) : (
        <form onSubmit={submit}>
          <VStack gap={4} hAlign="stretch">
            {error ? <Banner status="error" title={error} /> : null}
            <TextInput
              label={lang.emailLabel}
              isLabelHidden
              type="email"
              placeholder={lang.emailPlaceholder ?? lang.emailLabel}
              value={email}
              onChange={setEmail}
              size="lg"
              isDisabled={loading}
            />
            <Button
              label={loading ? lang.submitting : lang.submit}
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
            />
            <VStack hAlign="center">
              <Link href={backToLoginHref} type="supporting">
                {lang.backToLogin}
              </Link>
            </VStack>
          </VStack>
        </form>
      )}
    </AuthFormCard>
  );
}
