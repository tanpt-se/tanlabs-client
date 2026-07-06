import { Navigate } from 'react-router-dom';
import { useLocale } from '@tanlabs/providers';

import { useClientLogout } from '@/features/auth';
import { SettingsPage } from '@/features/dashboard/components/settings-page';
import { getClientLang } from '@/shared/i18n';
import { getUser } from '@/shared/auth';
import { CLIENT_AUTH_ROUTES } from '@/shared/routing';

function useSettingsRouteProps() {
  const { locale } = useLocale();
  const lang = getClientLang(locale);
  const user = getUser();
  const logout = useClientLogout();

  return {
    lang: lang.myAccount,
    shell: lang.shell,
    initialUser: user ? { id: user.id } : null,
    onLogout: logout,
  };
}

export function SettingsRedirectRoute() {
  return <Navigate to={CLIENT_AUTH_ROUTES.settingsAccount} replace />;
}

export function SettingsAccountRoute() {
  const props = useSettingsRouteProps();
  return <SettingsPage {...props} section="account" />;
}

export function SettingsGeneralRoute() {
  const props = useSettingsRouteProps();
  return <SettingsPage {...props} section="general" />;
}

export function SettingsBillingRoute() {
  const props = useSettingsRouteProps();
  return <SettingsPage {...props} section="billing" />;
}

export function MyAccountRedirectRoute() {
  return <Navigate to={CLIENT_AUTH_ROUTES.settingsAccount} replace />;
}

/** @deprecated Use section-specific routes. */
export function SettingsRoute() {
  return <SettingsAccountRoute />;
}
