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
  icons,
} from '@tanlabs/components';

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
  const inputIconClassName = 'h-4 w-4';
  const inputIconContainerClassName =
    'pointer-events-none absolute top-1/2 left-3 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-focus-within:bg-accent group-focus-within:text-accent-foreground';

  return (
    <Card>
      <CardHeader className="p-6 pb-0 text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 p-6">
        <form onSubmit={submit} className="space-y-4">
          {error ? (
            <Alert variant="destructive" role="alert" aria-live="assertive">
              <AlertDescription className="mt-0">{error}</AlertDescription>
            </Alert>
          ) : null}
          {isSubmitted ? (
            <Alert variant="success" role="status" aria-live="polite">
              <AlertDescription className="mt-0">
                <Strong as="p">{lang.successTitle}</Strong>
                <Body className="mt-1">{lang.successDescription}</Body>
              </AlertDescription>
            </Alert>
          ) : null}
          <label className="block">
            <span className="sr-only">{lang.emailLabel}</span>
            <span className="group relative block">
              <span className={inputIconContainerClassName}>
                <Icon icon={icons.mail} className={inputIconClassName} aria-hidden="true" />
              </span>
              <Input
                aria-label={lang.emailLabel}
                type="email"
                autoComplete="email"
                value={email}
                disabled
                className="pl-14"
              />
            </span>
          </label>
          <label className="block">
            <span className="sr-only">{lang.codeLabel}</span>
            <span className="group relative block">
              <span className={inputIconContainerClassName}>
                <Icon icon={icons.fileText} className={inputIconClassName} aria-hidden="true" />
              </span>
              <Input
                aria-label={lang.codeLabel}
                type="text"
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
                placeholder={lang.codePlaceholder}
                value={code}
                disabled={loading || isSubmitted}
                onChange={(event) => setCode(event.target.value)}
                className="pl-14"
              />
            </span>
          </label>

          <div className="space-y-3">
            <Button type="submit" className="w-full" size="lg" disabled={loading || isSubmitted}>
              {loading ? lang.submitting : lang.submit}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={resending || resendAvailableIn > 0}
              onClick={() => void resend()}
            >
              {resending
                ? lang.resending
                : resendAvailableIn > 0
                  ? lang.resendCountdown.replace('{seconds}', String(resendAvailableIn))
                  : lang.resend}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
