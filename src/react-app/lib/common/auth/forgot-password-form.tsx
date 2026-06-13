'use client';

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
  Icon,
  Input,
  Strong,
  TransitionLink,
  icons,
  typographyNavLinkClassName,
} from '@tanlabs/components';

import type { PublicAuthApp } from './runtime-access';
import { useForgotPasswordForm } from './use-forgot-password-form';

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
  app,
  backToLoginHref,
  lang,
  title,
  description,
}: {
  app: PublicAuthApp;
  backToLoginHref: string;
  lang: ForgotPasswordLang;
  title?: string;
  description?: string;
}) {
  const resolvedTitle = title ?? lang.title ?? 'Forgot password';
  const resolvedDescription = description ?? lang.description ?? '';
  const { email, error, isSubmitted, loading, setEmail, submit } = useForgotPasswordForm(app, lang);
  const infoAlertClassName =
    'rounded-xl border border-(--border-soft) bg-(--surface-soft) px-4 py-3 text-sm text-(--text-body)';
  const errorAlertClassName =
    'rounded-xl border border-(--danger-border) bg-(--danger-soft) px-4 py-3 text-sm text-(--danger-text)';
  const fieldIconWrapClassName =
    'pointer-events-none absolute top-1/2 left-3 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-focus-within:bg-accent group-focus-within:text-accent-foreground';

  return (
    <Card>
      <CardHeader className="p-6 pb-0 text-center">
        <CardTitle>{resolvedTitle}</CardTitle>
        {resolvedDescription ? <CardDescription>{resolvedDescription}</CardDescription> : null}
      </CardHeader>
      <CardContent className="p-6 pt-4">
        {isSubmitted ? (
          <Alert className={infoAlertClassName}>
            <AlertDescription>
              <Strong>{lang.successTitle}</Strong>
              <Body className="mt-2">{lang.successDescription}</Body>
            </AlertDescription>
          </Alert>
        ) : (
          <form className="space-y-4" onSubmit={submit}>
            {error ? (
              <Alert className={errorAlertClassName}>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
            <div className="group relative">
              <span className={fieldIconWrapClassName}>
                <Icon icon={icons.mail} className="h-4 w-4" />
              </span>
              <Input
                type="email"
                autoComplete="email"
                placeholder={lang.emailPlaceholder ?? lang.emailLabel}
                aria-label={lang.emailLabel}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="pl-12"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? lang.submitting : lang.submit}
            </Button>
          </form>
        )}
        <div className="mt-4 text-center">
          <TransitionLink href={backToLoginHref} className={typographyNavLinkClassName}>
            {lang.backToLogin}
          </TransitionLink>
        </div>
      </CardContent>
    </Card>
  );
}
