import { LoginForm } from '@/features/auth';
import { AuthLayout } from '@/features/auth';
import { resolveAuthNoticeByReason } from '@tanlabs/platform';
import { useSearchParams } from 'react-router-dom';

import { getClientLang } from '@/shared/i18n';
import { useLocale } from '@tanlabs/providers';
import { resolveAuthenticatedRedirect } from '@/shared/routing';
import { MiddlewareFallback } from '@tanlabs/web-common/auth/components/middleware-fallback';
import { clientAuthConfig } from '@/auth-config';

export function LoginPage() {
  const { locale } = useLocale();
  const lang = getClientLang(locale);
  const [searchParams] = useSearchParams();
  const nextPath = resolveAuthenticatedRedirect(searchParams.get('next') ?? undefined);
  const reason = searchParams.get('reason') ?? undefined;
  const notice = resolveAuthNoticeByReason(reason, {
    'session-revoked': {
      title: lang.login.forcedLogoutTitle,
      description: lang.login.forcedLogoutDescription,
    },
    'session-ended': {
      title: lang.login.sessionEndedTitle,
      description: lang.login.sessionEndedDescription,
    },
    'social-auth-failed': {
      title: lang.login.socialAuthFailedTitle,
      description: lang.login.socialAuthFailedDescription,
    },
    'social-auth-registration-required': {
      title: lang.login.socialRegistrationRequiredTitle,
      description: lang.login.socialRegistrationRequiredDescription,
    },
    'social-auth-email-unverified': {
      title: lang.login.socialEmailUnverifiedTitle,
      description: lang.login.socialEmailUnverifiedDescription,
    },
    'social-auth-account-locked': {
      title: lang.login.socialAccountLockedTitle,
      description: lang.login.socialAccountLockedDescription,
    },
  });

  return (
    <>
      <MiddlewareFallback
        authenticatedRedirectPath={clientAuthConfig.routes.defaultAuthenticatedRedirect}
        authCookieName={clientAuthConfig.cookies.auth}
        publicLoginPath={clientAuthConfig.routes.login}
      />
      <AuthLayout app="web">
        <LoginForm key={locale} lang={lang.login} nextPath={nextPath} notice={notice} />
      </AuthLayout>
    </>
  );
}
