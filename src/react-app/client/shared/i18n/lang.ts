import { type DashboardHeaderText, type Locale, buildDashboardHeaderText } from '@tanlabs/platform';
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
  if (pathname === CLIENT_AUTH_ROUTES.myAccount) {
    return {
      breadcrumb: lang.shell.nav.myAccount,
      title: lang.myAccount.title,
      description: lang.myAccount.description,
      fallbackUser: lang.shell.fallbackUser,
      logout: lang.shell.logout,
    };
  }

  return buildDashboardHeaderText(lang);
}
