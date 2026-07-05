'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { VStack } from '@astryxdesign/core/Layout';
import { TextInput } from '@astryxdesign/core/TextInput';
import { AuthFormCard } from '@/ui/login-card';

import { useVerifyEmailForm } from '@/features/auth/hooks/use-verify-email-form';
import type { ClientLang } from '@/shared/i18n';

export function VerifyEmailForm({
  description,
  initialState,
  lang,
  title,
}: {
  description: string;
  lang: ClientLang['verifyEmail'];
  title: string;
  initialState: {
    challengeId?: string;
    verificationContextToken?: string;
    email?: string;
    resendAvailableIn?: number;
  };
}) {
  const {
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
  } = useVerifyEmailForm(lang, initialState);

  return (
    <AuthFormCard title={title} subtitle={description}>
      <form onSubmit={submit}>
        <VStack gap={4} hAlign="stretch">
          {error ? <Banner status="error" title={error} /> : null}
          {isSubmitted ? (
            <Banner status="success" title={lang.successTitle} description={lang.successDescription} />
          ) : null}

          <VStack gap={2}>
            <TextInput
              label={lang.emailLabel}
              isLabelHidden
              type="email"
              value={email}
              onChange={() => undefined}
              placeholder={lang.emailLabel}
              size="lg"
              isDisabled
            />
            <TextInput
              label={lang.codeLabel}
              isLabelHidden
              value={code}
              onChange={setCode}
              placeholder={lang.codePlaceholder}
              size="lg"
              isDisabled={loading || isSubmitted}
            />
          </VStack>

          <Button
            label={loading ? lang.submitting : lang.submit}
            type="submit"
            variant="primary"
            size="lg"
            isDisabled={loading || isSubmitted}
            isLoading={loading}
          />
          <Button
            label={
              resending
                ? lang.resending
                : resendAvailableIn > 0
                  ? lang.resendCountdown.replace('{seconds}', String(resendAvailableIn))
                  : lang.resend
            }
            type="button"
            variant="secondary"
            size="lg"
            isDisabled={resending || resendAvailableIn > 0}
            onClick={() => void resend()}
          />
        </VStack>
      </form>
    </AuthFormCard>
  );
}
