import { Navigate } from 'react-router-dom';
import { useLocale } from '@tanlabs/providers';

import { SettingsPage } from '@/features/dashboard/components/settings-page';
import { getClientLang } from '@/shared/i18n';
import { getUser } from '@/shared/auth';
import { CLIENT_AUTH_ROUTES } from '@/shared/routing';

export function SettingsRoute() {
  const { locale } = useLocale();
  const lang = getClientLang(locale);
  const user = getUser();

  return (
    <SettingsPage
      lang={lang.myAccount}
      initialUser={user ? { id: user.id } : null}
    />
  );
}

export function MyAccountRedirectRoute() {
  return <Navigate to={CLIENT_AUTH_ROUTES.settings} replace />;
}
