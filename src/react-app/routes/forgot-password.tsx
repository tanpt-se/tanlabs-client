import { ForgotPasswordForm } from '@/features/auth';
import { AuthLayout } from '@/features/auth';
import { useLocale } from '@tanlabs/providers';

import { getClientLang } from '@/shared/i18n';
import { CLIENT_PUBLIC_ROUTES } from '@/shared/routing';

export function ForgotPasswordPage() {
  const { locale } = useLocale();
  const lang = getClientLang(locale);

  return (
    <AuthLayout app="web">
      <ForgotPasswordForm
        app="web"
        backToLoginHref={CLIENT_PUBLIC_ROUTES.login}
        lang={lang.forgotPassword}
      />
    </AuthLayout>
  );
}
