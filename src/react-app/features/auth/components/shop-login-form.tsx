'use client';

import type { FormEvent } from 'react';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { VStack } from '@astryxdesign/core/Layout';
import { Link } from '@astryxdesign/core/Link';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { AuthFormTwoColumn } from '@/ui/auth-form-two-column';
import { SocialSignInButtons } from '@/features/auth/components/social-sign-in-buttons';

import { RateLimitModal } from '@/features/auth/components/rate-limit-modal';
import { usePublicOAuthConfig } from '@/features/auth/lib/public-oauth-config';
import { useWebLoginForm } from '@/features/auth/hooks/use-web-login-form';
import type { ClientLang } from '@/shared/i18n';
import { CLIENT_PUBLIC_ROUTES, resolveAuthenticatedRedirect } from '@/shared/routing';
import { appendNextQueryParam } from '@/shared/routing/login-url';

export function ShopLoginForm({
  lang,
  nextPath,
  notice,
}: {
  lang: ClientLang['login'];
  nextPath?: string;
  notice?: { title: string; description: string };
}) {
  const {
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
  } = useWebLoginForm(lang, nextPath, resolveAuthenticatedRedirect);

  const { facebookEnabled: facebookAuthEnabled, googleEnabled: googleAuthEnabled } =
    usePublicOAuthConfig();
  const createAccountHref = appendNextQueryParam(
    CLIENT_PUBLIC_ROUTES.register,
    nextPath ? resolveAuthenticatedRedirect(nextPath) : undefined,
  );
  const pendingTwoFactorMethod = pendingTwoFactor?.method;
  const showForgotLink = Boolean(error);
  const submitLabel = loading
    ? lang.authenticating
    : isRateLimited
      ? lang.rateLimited
      : pendingTwoFactorMethod
        ? lang.verifyAndSignIn
        : lang.submit;
  const cardSectionLabel = pendingTwoFactorMethod
    ? lang.twoFactorStepTitle
    : lang.formSectionLabel;
  const cardSectionHint = pendingTwoFactorMethod ? lang.twoFactorStepDescription : undefined;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    void submit(event);
  };

  return (
    <>
      <AuthFormTwoColumn heroDescription={lang.heroDescription} imageAlt={lang.imageAlt}>
        <Card padding={8} width="100%">
          <form onSubmit={handleSubmit}>
            <VStack gap={4} hAlign="stretch">
              <VStack gap={1} hAlign="stretch">
                <Text type="label">{cardSectionLabel}</Text>
                {cardSectionHint ? (
                  <Text type="supporting" color="secondary">
                    {cardSectionHint}
                  </Text>
                ) : null}
              </VStack>

              {notice ? (
                <Banner status="info" title={notice.title} description={notice.description} />
              ) : null}

              {!pendingTwoFactorMethod ? (
                <VStack gap={2}>
                  <TextInput
                    label={lang.fields.email}
                    isLabelHidden
                    type="email"
                    placeholder={lang.placeholders.email}
                    value={email}
                    onChange={setEmail}
                    size="lg"
                    isDisabled={loading || isRateLimited}
                  />
                  <VStack gap={1}>
                    <TextInput
                      label={lang.fields.password}
                      isLabelHidden
                      type="password"
                      placeholder={lang.placeholders.password}
                      value={password}
                      onChange={setPassword}
                      size="lg"
                      isDisabled={loading || isRateLimited}
                      status={
                        error
                          ? {
                              type: 'error',
                              message: error,
                            }
                          : undefined
                      }
                    />
                    {showForgotLink ? (
                      <VStack hAlign="end">
                        <Link
                          href={CLIENT_PUBLIC_ROUTES.forgotPassword}
                          size="sm"
                          color="secondary"
                          type="supporting"
                        >
                          {lang.forgotPassword}
                        </Link>
                      </VStack>
                    ) : null}
                  </VStack>
                </VStack>
              ) : (
                <TextInput
                  label={
                    pendingTwoFactorMethod === 'email_otp'
                      ? lang.fields.emailOtpCode
                      : lang.fields.authenticatorCode
                  }
                  isLabelHidden
                  type="text"
                  placeholder={lang.placeholders.code}
                  value={twoFactorCode}
                  onChange={setTwoFactorCode}
                  size="lg"
                  isDisabled={loading || isRateLimited}
                  status={
                    error
                      ? {
                          type: 'error',
                          message: error,
                        }
                      : undefined
                  }
                />
              )}

              <VStack hAlign="stretch">
                <Button
                  label={submitLabel}
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={loading}
                  isDisabled={isRateLimited}
                />
              </VStack>

              {!pendingTwoFactorMethod ? (
                <SocialSignInButtons
                  disabled={loading || isRateLimited}
                  facebookEnabled={facebookAuthEnabled}
                  facebookLabel={lang.facebookSignIn}
                  googleEnabled={googleAuthEnabled}
                  googleLabel={lang.googleSignIn}
                  intent="login"
                  nextPath={nextPath}
                  orText={lang.orText}
                />
              ) : null}

              {!pendingTwoFactorMethod ? (
                <VStack hAlign="center">
                  <Text type="supporting" color="secondary">
                    Don&apos;t have an account?{' '}
                    <Link href={createAccountHref} type="supporting">
                      {lang.createAccount}
                    </Link>
                  </Text>
                </VStack>
              ) : null}
            </VStack>
          </form>
        </Card>
      </AuthFormTwoColumn>

      {isRateLimited && rateLimitedUntil !== null ? (
        <RateLimitModal
          blockedUntil={rateLimitedUntil}
          lang={lang.rateLimitModal}
          onExpired={clearRateLimit}
        />
      ) : null}
    </>
  );
}
