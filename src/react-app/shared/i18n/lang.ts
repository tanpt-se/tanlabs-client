import { buildDashboardHeaderText, type DashboardHeaderText } from './dashboard-header';
import type { Locale } from '@/lib/platform/preferences';
import type { DeepWiden } from '@tanlabs/types';

import { CLIENT_AUTH_ROUTES, CLIENT_PUBLIC_ROUTES } from '@/shared/routing';

import { enClientLang } from './messages/en';
import { viClientLang } from './messages/vi';

const clientLangByLocale = {
  en: enClientLang,
  vi: viClientLang,
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

  if (pathname === CLIENT_AUTH_ROUTES.cart) {
    return {
      breadcrumb: lang.cart.title,
      title: lang.cart.title,
      description: lang.cart.description,
      fallbackUser: lang.shell.fallbackUser,
      logout: lang.shell.logout,
    };
  }

  if (pathname === CLIENT_AUTH_ROUTES.blog) {
    return {
      breadcrumb: lang.blog.title,
      title: lang.blog.title,
      description: lang.blog.description,
      fallbackUser: lang.shell.fallbackUser,
      logout: lang.shell.logout,
    };
  }

  if (pathname.startsWith(`${CLIENT_AUTH_ROUTES.blog}/`)) {
    return {
      breadcrumb: lang.blog.title,
      title: lang.blog.detail.notFoundTitle,
      description: lang.blog.description,
      fallbackUser: lang.shell.fallbackUser,
      logout: lang.shell.logout,
    };
  }

  if (pathname === CLIENT_AUTH_ROUTES.about) {
    return {
      breadcrumb: lang.about.title,
      title: lang.about.title,
      description: lang.about.description,
      fallbackUser: lang.shell.fallbackUser,
      logout: lang.shell.logout,
    };
  }

  if (pathname === CLIENT_AUTH_ROUTES.partnership) {
    return {
      breadcrumb: lang.partnership.title,
      title: lang.partnership.title,
      description: lang.partnership.description,
      fallbackUser: lang.shell.fallbackUser,
      logout: lang.shell.logout,
    };
  }

  if (pathname === CLIENT_PUBLIC_ROUTES.register) {
    return {
      breadcrumb: lang.register.title,
      title: lang.register.title,
      description: lang.register.description,
      fallbackUser: lang.shell.fallbackUser,
      logout: lang.shell.logout,
    };
  }

  if (pathname === CLIENT_PUBLIC_ROUTES.login) {
    return {
      breadcrumb: lang.login.title,
      title: lang.login.title,
      description: lang.login.description,
      fallbackUser: lang.shell.fallbackUser,
      logout: lang.shell.logout,
    };
  }

  if (pathname === CLIENT_AUTH_ROUTES.settings || pathname.startsWith('/settings/')) {
    return {
      breadcrumb: lang.shell.header.myAccount,
      title: lang.myAccount.title,
      description: lang.myAccount.description,
      fallbackUser: lang.shell.fallbackUser,
      logout: lang.shell.logout,
    };
  }

  return buildDashboardHeaderText(lang);
}
