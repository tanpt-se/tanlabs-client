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
  if (pathname === CLIENT_AUTH_ROUTES.settings) {
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
