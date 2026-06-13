'use client';

import { useEffect, useState } from 'react';

import { GoogleMark } from '@tanlabs/assets';
import {
  Alert,
  AlertDescription,
  Body,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Fine,
  Icon,
  Input,
  Meta,
  PasswordVisibilityToggle,
  Strong,
  TransitionLink,
  icons,
  typographyNavLinkClassName,
} from '@tanlabs/components';
import { startSocialAuth } from '@tanlabs/web-common/auth/social-auth';

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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
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
  const inputIconClassName = 'h-4 w-4';
  const inputIconContainerClassName =
    'pointer-events-none absolute top-1/2 left-3 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-focus-within:bg-accent group-focus-within:text-accent-foreground';
  const passwordToggleContainerClassName =
    'absolute top-1/2 right-3 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-focus-within:bg-accent group-focus-within:text-accent-foreground';

  return (
    <Card>
      <CardHeader className="p-6 pb-0 text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 p-6">
        <form onSubmit={submit} className="space-y-4">
          {notice ? (
            <Alert role="status" aria-live="polite">
              <AlertDescription className="mt-0">
                <Strong as="p">{notice.title}</Strong>
                <Meta className="mt-1">{notice.description}</Meta>
              </AlertDescription>
            </Alert>
          ) : null}
          {error ? (
            <Alert variant="destructive" role="alert" aria-live="assertive">
              <AlertDescription className="mt-0">{error}</AlertDescription>
            </Alert>
          ) : null}
          <label className="block">
            <span className="sr-only">{lang.fields.email}</span>
            <span className="group relative block">
              <span className={inputIconContainerClassName}>
                <Icon icon={icons.mail} className={inputIconClassName} aria-hidden="true" />
              </span>
              <Input
                aria-label={lang.fields.email}
                type="email"
                autoComplete="email"
                placeholder={lang.placeholders.email}
                value={email}
                disabled={loading}
                onChange={(event) => setEmail(event.target.value)}
                className="pl-14"
              />
            </span>
          </label>
          <label className="block">
            <span className="sr-only">{lang.fields.displayName}</span>
            <span className="group relative block">
              <span className={inputIconContainerClassName}>
                <Icon icon={icons.userRound} className={inputIconClassName} aria-hidden="true" />
              </span>
              <Input
                aria-label={lang.fields.displayName}
                type="text"
                autoComplete="name"
                placeholder={lang.placeholders.displayName}
                value={displayName}
                disabled={loading}
                onChange={(event) => setDisplayName(event.target.value)}
                className="pl-14"
              />
            </span>
          </label>
          <label className="block">
            <span className="sr-only">{lang.fields.password}</span>
            <span className="group relative block">
              <span className={inputIconContainerClassName}>
                <Icon icon={icons.lockKeyhole} className={inputIconClassName} aria-hidden="true" />
              </span>
              <Input
                aria-label={lang.fields.password}
                type={isPasswordVisible ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder={lang.placeholders.password}
                value={password}
                disabled={loading}
                onChange={(event) => setPassword(event.target.value)}
                className="pr-14 pl-14"
              />
              <span className={passwordToggleContainerClassName}>
                <PasswordVisibilityToggle
                  visible={isPasswordVisible}
                  onShow={() => setIsPasswordVisible(true)}
                  onHide={() => setIsPasswordVisible(false)}
                />
              </span>
            </span>
          </label>
          <label className="block">
            <span className="sr-only">{lang.fields.confirmPassword}</span>
            <span className="group relative block">
              <span className={inputIconContainerClassName}>
                <Icon icon={icons.lockKeyhole} className={inputIconClassName} aria-hidden="true" />
              </span>
              <Input
                aria-label={lang.fields.confirmPassword}
                type={isConfirmPasswordVisible ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder={lang.placeholders.confirmPassword}
                value={confirmPassword}
                disabled={loading}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="pr-14 pl-14"
              />
              <span className={passwordToggleContainerClassName}>
                <PasswordVisibilityToggle
                  visible={isConfirmPasswordVisible}
                  onShow={() => setIsConfirmPasswordVisible(true)}
                  onHide={() => setIsConfirmPasswordVisible(false)}
                />
              </span>
            </span>
          </label>

          {turnstileSiteKey ? (
            <>
              <Card>
                <CardContent className="p-3">
                  <TurnstileWidget siteKey={turnstileSiteKey} onTokenChange={setCaptchaToken} />
                </CardContent>
              </Card>
              {!captchaToken ? <Body>{lang.validation.captchaRequired}</Body> : null}
            </>
          ) : null}

          <div className="space-y-3">
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? lang.submitting : lang.submit}
            </Button>
            {googleAuthEnabled ? (
              <>
                <Fine as="p" className="text-center">
                  {lang.orText}
                </Fine>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                  onClick={() => startSocialAuth('web', 'google', undefined, 'register', 'web')}
                >
                  <GoogleMark />
                  {lang.googleSignUp}
                </Button>
              </>
            ) : null}
            <TransitionLink
              href={CLIENT_PUBLIC_ROUTES.login}
              className={`block w-full text-center ${typographyNavLinkClassName}`}
            >
              {lang.backToLogin}
            </TransitionLink>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
