import { useSearchParams } from 'react-router-dom';
import { useLocale } from '@tanlabs/providers';

import { RegisterForm } from '@/features/auth';
import { getClientLang } from '@/shared/i18n';

export function RegisterRoute() {
  const { locale } = useLocale();
  const lang = getClientLang(locale);
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') ?? undefined;
  const notice =
    reason === 'social-auth-failed'
      ? {
          title: lang.register.socialAuthFailedTitle,
          description: lang.register.socialAuthFailedDescription,
        }
      : reason === 'social-auth-email-unverified'
        ? {
            title: lang.register.socialEmailUnverifiedTitle,
            description: lang.register.socialEmailUnverifiedDescription,
          }
        : reason === 'social-auth-email-in-use'
          ? {
              title: lang.register.socialEmailInUseTitle,
              description: lang.register.socialEmailInUseDescription,
            }
          : reason === 'social-auth-account-locked'
            ? {
                title: lang.register.socialAccountLockedTitle,
                description: lang.register.socialAccountLockedDescription,
              }
            : undefined;

  return <RegisterForm key={locale} lang={lang.register} notice={notice} />;
}
