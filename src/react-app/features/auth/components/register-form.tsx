'use client';

import { useEffect } from 'react';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Divider } from '@astryxdesign/core/Divider';
import { Link } from '@astryxdesign/core/Link';
import { VStack } from '@astryxdesign/core/Layout';
import { TextInput } from '@astryxdesign/core/TextInput';
import { AuthFormCard } from '@/ui/login-card';
import { GoogleIcon } from '@/ui/login-card';
import { startSocialAuth } from '@/features/auth/lib/social-auth';

import { TurnstileWidget } from '@/features/auth/components/turnstile-widget';
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
  description,
  lang,
  notice,
  title,
}: {
  description: string;
  lang: ClientLang['register'];
  notice?: { title: string; description: string };
  title: string;
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

  const googleAuthEnabled = getPublicAuthRuntime().getGoogleOAuthEnabled();
  const turnstileSiteKey = getPublicAuthRuntime().getTurnstileSiteKey();

  return (
    <AuthFormCard title={title} subtitle={description}>
      <form onSubmit={submit}>
        <VStack gap={4} hAlign="stretch">
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

          <Button
            label={loading ? lang.submitting : lang.submit}
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            isDisabled={Boolean(turnstileSiteKey && !captchaToken)}
          />

          {googleAuthEnabled ? (
            <>
              <Divider label={lang.orText} />
              <Button
                label={lang.googleSignUp}
                type="button"
                variant="secondary"
                size="lg"
                icon={<GoogleIcon />}
                isDisabled={loading}
                onClick={() => startSocialAuth('google', undefined, 'register')}
              />
            </>
          ) : null}

          <VStack hAlign="center">
            <Link href={CLIENT_PUBLIC_ROUTES.login} type="supporting">
              {lang.backToLogin}
            </Link>
          </VStack>
        </VStack>
      </form>
    </AuthFormCard>
  );
}
