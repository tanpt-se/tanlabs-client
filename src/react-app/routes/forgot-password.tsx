import { ForgotPasswordForm } from '@/features/auth';
import { AuthLayout } from '@/features/auth';
import { useLocale } from '@tanlabs/providers';

import { getClientLang } from '@/shared/i18n';
import { buildOpenShopLoginUrl } from '@/shared/routing/shop-login';

export function ForgotPasswordPage() {
  const { locale } = useLocale();
  const lang = getClientLang(locale);

  return (
    <AuthLayout>
      <ForgotPasswordForm backToLoginHref={buildOpenShopLoginUrl()} lang={lang.forgotPassword} />
    </AuthLayout>
  );
}
