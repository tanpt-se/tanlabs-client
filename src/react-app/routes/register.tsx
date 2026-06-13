import { RegisterForm } from '@/features/auth';
import { AuthLayout } from '@/features/auth';
import { useSearchParams } from 'react-router-dom';

import { getClientLang } from '@/shared/i18n';
import { useLocale } from '@tanlabs/providers';

export function RegisterPage() {
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

  return (
    <AuthLayout app="web">
      <RegisterForm
        key={locale}
        title={lang.register.formTitle}
        description={lang.register.formDescription}
        lang={lang.register}
        notice={notice}
      />
    </AuthLayout>
  );
}
