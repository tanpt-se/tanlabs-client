'use client';

import { LoginCard, type LoginCardCopy } from '@/ui/login-card';
import { startSocialAuth } from '@/features/auth/lib/social-auth';

import { RateLimitModal } from '@/features/auth/components/rate-limit-modal';
import { usePublicOAuthConfig } from '@/features/auth/lib/public-oauth-config';
import { useWebLoginForm } from '@/features/auth/hooks/use-web-login-form';
import type { ClientLang } from '@/shared/i18n';
import { CLIENT_PUBLIC_ROUTES, resolveAuthenticatedRedirect } from '@/shared/routing';
import { appendNextQueryParam } from '@/shared/routing/login-url';

export function LoginForm({
  lang,
  nextPath,
  notice,
  variant = 'page',
  onLoginSuccess,
}: {
  lang: ClientLang['login'];
  nextPath?: string;
  notice?: { title: string; description: string; ctaHref?: string; ctaLabel?: string };
  variant?: 'page' | 'embedded';
  onLoginSuccess?: () => void;
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
  } = useWebLoginForm(lang, nextPath, resolveAuthenticatedRedirect, { onLoginSuccess });
  const { googleEnabled: googleAuthEnabled } = usePublicOAuthConfig();
  const createAccountHref = appendNextQueryParam(
    CLIENT_PUBLIC_ROUTES.register,
    nextPath ? resolveAuthenticatedRedirect(nextPath) : undefined,
  );
  const copy: LoginCardCopy = {
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
      <LoginCard
        copy={copy}
        createAccountHref={createAccountHref}
        email={email}
        error={error}
        forgotPasswordHref={CLIENT_PUBLIC_ROUTES.forgotPassword}
        googleAuthEnabled={googleAuthEnabled}
        isRateLimited={isRateLimited}
        loading={loading}
        notice={notice}
        onEmailChange={setEmail}
        onGoogleSignIn={() => startSocialAuth('google', nextPath, 'login')}
        onPasswordChange={setPassword}
        onSubmit={submit}
        onTwoFactorCodeChange={setTwoFactorCode}
        password={password}
        pendingTwoFactorMethod={pendingTwoFactor?.method}
        twoFactorCode={twoFactorCode}
        variant={variant}
      />
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
