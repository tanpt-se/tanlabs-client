import { VerifyEmailForm } from '@/features/auth';
import { AuthLayout } from '@/features/auth';
import { Navigate, useSearchParams } from 'react-router-dom';

import { CLIENT_PUBLIC_ROUTES } from '@/shared/routing';
import { getClientLang } from '@/shared/i18n';
import { useLocale } from '@tanlabs/providers';

export function VerifyEmailPage() {
  const { locale } = useLocale();
  const lang = getClientLang(locale);
  const [searchParams] = useSearchParams();

  const email = searchParams.get('email') ?? undefined;
  const challengeId = searchParams.get('challengeId') ?? undefined;
  const verificationContextToken = searchParams.get('verificationContextToken') ?? undefined;
  const resendAvailableIn = Number(searchParams.get('resendAvailableIn') ?? '0');

  if (!email || !challengeId || !verificationContextToken) {
    return <Navigate to={CLIENT_PUBLIC_ROUTES.register} replace />;
  }

  return (
    <AuthLayout>
      <VerifyEmailForm
        key={locale}
        title={lang.verifyEmail.formTitle}
        description={lang.verifyEmail.formDescription}
        lang={lang.verifyEmail}
        initialState={{
          email,
          challengeId,
          verificationContextToken,
          resendAvailableIn: Number.isFinite(resendAvailableIn) ? resendAvailableIn : 0,
        }}
      />
    </AuthLayout>
  );
}
