'use client';

import { SharedLoginForm, type SharedLoginFormCopy } from '@tanlabs/components/shared-login-form';
import { startSocialAuth } from '@tanlabs/web-common/auth/social-auth';

import { RateLimitModal } from '@/features/auth/components/rate-limit-modal';
import { useWebLoginForm } from '@/features/auth/hooks/use-web-login-form';
import { getPublicAuthRuntime } from '@/shared/auth/public-auth-runtime';
import type { ClientLang } from '@/shared/i18n';
import { CLIENT_PUBLIC_ROUTES, resolveAuthenticatedRedirect } from '@/shared/routing';

export function LoginForm({
  lang,
  nextPath,
  notice,
}: {
  lang: ClientLang['login'];
  nextPath?: string;
  notice?: { title: string; description: string; ctaHref?: string; ctaLabel?: string };
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
  const googleAuthEnabled = getPublicAuthRuntime().getGoogleOAuthEnabled();
  const copy: SharedLoginFormCopy = {
    title: lang.formTitle,
    subtitle: lang.formDescription,
    emailLabel: lang.fields.email,
    emailPlaceholder: lang.placeholders.email,
    passwordLabel: lang.fields.password,
    passwordPlaceholder: lang.placeholders.password,
    twoFactorStepTitle: lang.twoFactorStepTitle,
    twoFactorStepDescription: lang.twoFactorStepDescription,
    otpEmailLabel: lang.fields.emailOtpCode,
    otpAuthenticatorLabel: lang.fields.authenticatorCode,
    otpEmailHint: lang.twoFactorStepDescription,
    otpAuthenticatorHint: lang.twoFactorStepDescription,
    otpPlaceholder: lang.placeholders.code,
    submitDefault: lang.submit,
    submitRateLimited: lang.rateLimited,
    submitTwoFactor: lang.verifyAndSignIn,
    submitLoading: lang.authenticating,
    orText: lang.orText,
    googleSignIn: lang.googleSignIn,
    forgotPassword: lang.forgotPassword,
    createAccount: lang.createAccount,
  };

  return (
    <>
      <SharedLoginForm
        copy={copy}
        createAccountHref={CLIENT_PUBLIC_ROUTES.register}
        email={email}
        error={error}
        forgotPasswordHref={CLIENT_PUBLIC_ROUTES.forgotPassword}
        googleAuthEnabled={googleAuthEnabled}
        isRateLimited={isRateLimited}
        loading={loading}
        notice={notice}
        onEmailChange={setEmail}
        onGoogleSignIn={() => startSocialAuth('web', 'google', nextPath, 'login', 'web')}
        onPasswordChange={setPassword}
        onSubmit={submit}
        onTwoFactorCodeChange={setTwoFactorCode}
        password={password}
        pendingTwoFactorMethod={pendingTwoFactor?.method}
        twoFactorCode={twoFactorCode}
      />
      {isRateLimited ? (
        <RateLimitModal
          blockedUntil={rateLimitedUntil ?? Date.now()}
          lang={lang.rateLimitModal}
          onExpired={clearRateLimit}
        />
      ) : null}
    </>
  );
}
