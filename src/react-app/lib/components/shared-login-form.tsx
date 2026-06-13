'use client';

import { useState } from 'react';

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
  InlineLoadingIndicator as LoadingIndicator,
  Meta,
  PasswordVisibilityToggle,
  Strong,
  TransitionLink,
  icons,
  typographyNavLinkClassName,
} from '.';

type TwoFactorMethod = 'email_otp' | 'totp';

export interface SharedLoginFormCopy {
  title: string;
  subtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  twoFactorStepTitle: string;
  twoFactorStepDescription: string;
  otpEmailLabel: string;
  otpAuthenticatorLabel: string;
  otpEmailHint: string;
  otpAuthenticatorHint: string;
  otpPlaceholder: string;
  submitDefault: string;
  submitRateLimited: string;
  submitTwoFactor: string;
  submitLoading: string;
  orText: string;
  googleSignIn: string;
  forgotPassword?: string;
  createAccount?: string;
}

export interface SharedLoginFormNotice {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}

const fieldIconClassName = 'h-4 w-4';
const fieldIconContainerClassName =
  'pointer-events-none absolute top-1/2 left-3 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-focus-within:bg-accent group-focus-within:text-accent-foreground';
const passwordToggleContainerClassName =
  'absolute top-1/2 right-3 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-focus-within:bg-accent group-focus-within:text-accent-foreground';

export function SharedLoginForm(props: {
  copy: SharedLoginFormCopy;
  createAccountHref?: string;
  email: string;
  error?: string;
  forgotPasswordHref?: string;
  googleAuthEnabled: boolean;
  isRateLimited?: boolean;
  loading: boolean;
  notice?: SharedLoginFormNotice;
  onEmailChange: (value: string) => void;
  onGoogleSignIn: () => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onTwoFactorCodeChange: (value: string) => void;
  password: string;
  pendingTwoFactorMethod?: TwoFactorMethod;
  twoFactorCode: string;
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {
    copy,
    createAccountHref,
    email,
    error,
    forgotPasswordHref,
    googleAuthEnabled,
    isRateLimited = false,
    loading,
    notice,
    onEmailChange,
    onGoogleSignIn,
    onPasswordChange,
    onSubmit,
    onTwoFactorCodeChange,
    password,
    pendingTwoFactorMethod,
    twoFactorCode,
  } = props;
  const pendingTwoFactor = Boolean(pendingTwoFactorMethod);
  const submitLabel = loading
    ? copy.submitLoading
    : isRateLimited
      ? copy.submitRateLimited
      : pendingTwoFactor
        ? copy.submitTwoFactor
        : copy.submitDefault;

  return (
    <Card>
      <CardHeader className="p-6 pb-0 text-center">
        <CardTitle>{copy.title}</CardTitle>
        <CardDescription>{copy.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          {notice ? (
            <Alert variant="default" role="status" aria-live="polite">
              <AlertDescription className="mt-0">
                <Strong as="p">{notice.title}</Strong>
                <Meta className="mt-1">{notice.description}</Meta>
                {notice.ctaHref && notice.ctaLabel ? (
                  <TransitionLink
                    href={notice.ctaHref}
                    className={`mt-2 inline-block ${typographyNavLinkClassName}`}
                  >
                    {notice.ctaLabel}
                  </TransitionLink>
                ) : null}
              </AlertDescription>
            </Alert>
          ) : null}
          {error ? (
            <Alert variant="destructive" role="alert" aria-live="assertive">
              <AlertDescription className="mt-0">{error}</AlertDescription>
            </Alert>
          ) : null}

          <label className="block">
            <span className="sr-only">{copy.emailLabel}</span>
            <span className="group relative block">
              <span className={fieldIconContainerClassName}>
                <Icon icon={icons.mail} className={fieldIconClassName} aria-hidden="true" />
              </span>
              <Input
                aria-label={copy.emailLabel}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => onEmailChange(event.target.value)}
                placeholder={copy.emailPlaceholder}
                disabled={loading || isRateLimited}
                className="pl-14"
              />
            </span>
          </label>

          <label className="block">
            <span className="sr-only">{copy.passwordLabel}</span>
            <span className="group relative block">
              <span className={fieldIconContainerClassName}>
                <Icon icon={icons.lockKeyhole} className={fieldIconClassName} aria-hidden="true" />
              </span>
              <Input
                aria-label={copy.passwordLabel}
                type={isPasswordVisible ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
                placeholder={copy.passwordPlaceholder}
                disabled={loading || isRateLimited}
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

          {pendingTwoFactor ? (
            <>
              <Alert variant="default" role="status" aria-live="polite">
                <AlertDescription className="mt-0">
                  <Strong as="p">{copy.twoFactorStepTitle}</Strong>
                  <Meta className="mt-1">{copy.twoFactorStepDescription}</Meta>
                </AlertDescription>
              </Alert>
              <label className="block">
                <span className="sr-only">
                  {pendingTwoFactorMethod === 'email_otp'
                    ? copy.otpEmailLabel
                    : copy.otpAuthenticatorLabel}
                </span>
                <span className="group relative block">
                  <span className={fieldIconContainerClassName}>
                    <Icon icon={icons.fileText} className={fieldIconClassName} aria-hidden="true" />
                  </span>
                  <Input
                    aria-label={
                      pendingTwoFactorMethod === 'email_otp'
                        ? copy.otpEmailLabel
                        : copy.otpAuthenticatorLabel
                    }
                    type="text"
                    autoComplete="one-time-code"
                    value={twoFactorCode}
                    onChange={(event) => onTwoFactorCodeChange(event.target.value)}
                    inputMode="numeric"
                    maxLength={6}
                    placeholder={copy.otpPlaceholder}
                    disabled={loading || isRateLimited}
                    className="pl-14"
                  />
                </span>
              </label>
              <Body>
                {pendingTwoFactorMethod === 'email_otp'
                  ? copy.otpEmailHint
                  : copy.otpAuthenticatorHint}
              </Body>
            </>
          ) : null}

          <Button type="submit" disabled={loading || isRateLimited} className="w-full" size="lg">
            {submitLabel}
          </Button>
          {googleAuthEnabled && !pendingTwoFactor ? (
            <>
              <Fine as="p" className="text-center">
                {copy.orText}
              </Fine>
              <Button
                type="button"
                variant="outline"
                disabled={loading || isRateLimited}
                className="w-full"
                size="lg"
                onClick={onGoogleSignIn}
              >
                <GoogleMark />
                {copy.googleSignIn}
              </Button>
            </>
          ) : null}
          {loading ? <LoadingIndicator label={copy.submitLoading} /> : null}
          {forgotPasswordHref && copy.forgotPassword ? (
            <TransitionLink
              href={forgotPasswordHref}
              className={`block w-full text-center ${typographyNavLinkClassName}`}
            >
              {copy.forgotPassword}
            </TransitionLink>
          ) : null}
          {createAccountHref && copy.createAccount ? (
            <TransitionLink
              href={createAccountHref}
              className={`block w-full text-center ${typographyNavLinkClassName}`}
            >
              {copy.createAccount}
            </TransitionLink>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
