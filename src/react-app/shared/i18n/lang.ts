import { buildDashboardHeaderText, type DashboardHeaderText } from './dashboard-header';
import type { Locale } from '@/lib/platform/preferences';
import type { DeepWiden } from '@tanlabs/types';

import { CLIENT_AUTH_ROUTES } from '@/shared/routing';

import { enClientLang } from './messages/en';
import { jaClientLang } from './messages/ja';
import { koClientLang } from './messages/ko';
import { viClientLang } from './messages/vi';

const clientLangByLocale = {
  en: enClientLang,
  vi: viClientLang,
  ja: jaClientLang,
  ko: koClientLang,
} as const;

export type ClientLang = DeepWiden<typeof enClientLang>;
export type { DashboardHeaderText };
export { buildDashboardHeaderText };

export function getClientLang(locale: Locale): ClientLang {
  return clientLangByLocale[locale] ?? enClientLang;
}

export function resolveDashboardHeaderText(pathname: string, lang: ClientLang): DashboardHeaderText {
  if (pathname === CLIENT_AUTH_ROUTES.settingsAccount) {
    return {
      breadcrumb: lang.myAccount.sections.accountTitle,
      title: lang.myAccount.sections.accountTitle,
      description: lang.myAccount.sections.accountDescription,
      fallbackUser: lang.shell.fallbackUser,
      logout: lang.shell.logout,
    };
  }

  if (pathname === CLIENT_AUTH_ROUTES.settingsGeneral) {
    return {
      breadcrumb: lang.myAccount.sections.generalTitle,
      title: lang.myAccount.sections.generalTitle,
      description: lang.myAccount.sections.generalDescription,
      fallbackUser: lang.shell.fallbackUser,
      logout: lang.shell.logout,
    };
  }

  if (pathname === CLIENT_AUTH_ROUTES.settingsBilling) {
    return {
      breadcrumb: lang.myAccount.sections.billingTitle,
      title: lang.myAccount.sections.billingTitle,
      description: lang.myAccount.sections.billingDescription,
      fallbackUser: lang.shell.fallbackUser,
      logout: lang.shell.logout,
    };
  }

  if (pathname === CLIENT_AUTH_ROUTES.settings || pathname.startsWith('/settings/')) {
    return {
      breadcrumb: lang.shell.nav.settings,
      title: lang.myAccount.title,
      description: lang.myAccount.description,
      fallbackUser: lang.shell.fallbackUser,
      logout: lang.shell.logout,
    };
  }

  return buildDashboardHeaderText(lang);
}

export function resolveDashboardPageChrome(pathname: string, lang: ClientLang) {
  const isSettingsSubpage =
    pathname === CLIENT_AUTH_ROUTES.settingsAccount ||
    pathname === CLIENT_AUTH_ROUTES.settingsGeneral ||
    pathname === CLIENT_AUTH_ROUTES.settingsBilling;

  if (isSettingsSubpage) {
    const headerText = resolveDashboardHeaderText(pathname, lang);
    return {
      breadcrumbs: [
        { label: lang.shell.nav.dashboard, href: CLIENT_AUTH_ROUTES.dashboard },
        { label: lang.shell.nav.settings, href: CLIENT_AUTH_ROUTES.settingsAccount },
        { label: headerText.title },
      ],
    };
  }

  const headerText = resolveDashboardHeaderText(pathname, lang);
  return {
    breadcrumbs: [{ label: headerText.breadcrumb, description: headerText.description }],
  };
}
