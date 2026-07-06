'use client';

import { useEffect } from 'react';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { VStack } from '@astryxdesign/core/Layout';
import { Link } from '@astryxdesign/core/Link';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { AuthFormTwoColumn } from '@/ui/auth-form-two-column';
import { SocialSignInButtons } from '@/features/auth/components/social-sign-in-buttons';

import { TurnstileWidget } from '@/features/auth/components/turnstile-widget';
import { usePublicOAuthConfig } from '@/features/auth/lib/public-oauth-config';
import { useRegisterForm } from '@/features/auth/hooks/use-register-form';
import { getPublicAuthRuntime } from '@/shared/auth/public-auth-runtime';
import type { ClientLang } from '@/shared/i18n';
import { CLIENT_PUBLIC_ROUTES } from '@/shared/routing';

declare global {
  interface Window {
    __TANLABS_SET_CAPTCHA_TOKEN__?: (token: string) => void;
  }
}

export function RegisterForm({
  lang,
  notice,
}: {
  lang: ClientLang['register'];
  notice?: { title: string; description: string };
}) {
  const {
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
  } = useRegisterForm(lang);

  useEffect(() => {
    if (import.meta.env.PROD) {
      return undefined;
    }

    window.__TANLABS_SET_CAPTCHA_TOKEN__ = setCaptchaToken;
    return () => {
      delete window.__TANLABS_SET_CAPTCHA_TOKEN__;
    };
  }, [setCaptchaToken]);

  const { facebookEnabled: facebookAuthEnabled, googleEnabled: googleAuthEnabled } =
    usePublicOAuthConfig();
  const turnstileSiteKey = getPublicAuthRuntime().getTurnstileSiteKey();

  return (
    <AuthFormTwoColumn heroDescription={lang.heroDescription} imageAlt={lang.imageAlt}>
      <Card padding={8} width="100%">
          <form onSubmit={submit}>
            <VStack gap={4} hAlign="stretch">
              <Text type="label">{lang.formSectionLabel}</Text>

              {notice ? (
                <Banner status="info" title={notice.title} description={notice.description} />
              ) : null}
              {error ? <Banner status="error" title={error} /> : null}

              <VStack gap={2}>
                <TextInput
                  label={lang.fields.email}
                  isLabelHidden
                  type="email"
                  placeholder={lang.placeholders.email}
                  value={email}
                  onChange={setEmail}
                  size="lg"
                  isDisabled={loading}
                />
                <TextInput
                  label={lang.fields.displayName}
                  isLabelHidden
                  placeholder={lang.placeholders.displayName}
                  value={displayName}
                  onChange={setDisplayName}
                  size="lg"
                  isDisabled={loading}
                />
                <TextInput
                  label={lang.fields.password}
                  isLabelHidden
                  type="password"
                  placeholder={lang.placeholders.password}
                  value={password}
                  onChange={setPassword}
                  size="lg"
                  isDisabled={loading}
                />
                <TextInput
                  label={lang.fields.confirmPassword}
                  isLabelHidden
                  type="password"
                  placeholder={lang.placeholders.confirmPassword}
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  size="lg"
                  isDisabled={loading}
                />
              </VStack>

              {turnstileSiteKey ? (
                <Card padding={3} width="100%">
                  <TurnstileWidget siteKey={turnstileSiteKey} onTokenChange={setCaptchaToken} />
                </Card>
              ) : null}

              <VStack hAlign="stretch">
                <Button
                  label={loading ? lang.submitting : lang.submit}
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={loading}
                  isDisabled={Boolean(turnstileSiteKey && !captchaToken)}
                />
              </VStack>

              <SocialSignInButtons
                disabled={loading}
                facebookEnabled={facebookAuthEnabled}
                facebookLabel={lang.facebookSignUp}
                googleEnabled={googleAuthEnabled}
                googleLabel={lang.googleSignUp}
                intent="register"
                orText={lang.orText}
              />

              <VStack hAlign="center">
                <Link href={CLIENT_PUBLIC_ROUTES.login} type="supporting">
                  {lang.backToLogin}
                </Link>
              </VStack>
            </VStack>
          </form>
        </Card>
    </AuthFormTwoColumn>
  );
}
