import type { ClientLang } from './lang';
import { resolveDashboardHeaderText } from './lang';
import type { DashboardPageChrome } from './dashboard-breadcrumbs';

import { CLIENT_AUTH_ROUTES, CLIENT_PUBLIC_ROUTES } from '@/shared/routing';

function homeCrumb(lang: ClientLang) {
  return {
    label: lang.dashboard.breadcrumb,
    href: CLIENT_AUTH_ROUTES.dashboard,
  };
}

function topLevelPageChrome(
  lang: ClientLang,
  pathname: string,
): DashboardPageChrome {
  const headerText = resolveDashboardHeaderText(pathname, lang);

  return {
    breadcrumbs: [
      homeCrumb(lang),
      {
        label: headerText.title,
        description: headerText.description,
      },
    ],
  };
}

export function resolveDashboardPageChrome(
  pathname: string,
  lang: ClientLang,
): DashboardPageChrome {
  if (pathname === CLIENT_AUTH_ROUTES.dashboard) {
    return { breadcrumbs: [] };
  }

  const isSettingsSubpage =
    pathname === CLIENT_AUTH_ROUTES.settingsAccount ||
    pathname === CLIENT_AUTH_ROUTES.settingsGeneral ||
    pathname === CLIENT_AUTH_ROUTES.settingsBilling;

  if (isSettingsSubpage) {
    const headerText = resolveDashboardHeaderText(pathname, lang);

    return {
      back: {
        href: CLIENT_AUTH_ROUTES.settingsAccount,
        label: lang.shell.back,
      },
      breadcrumbs: [
        homeCrumb(lang),
        {
          label: lang.shell.header.myAccount,
          href: CLIENT_AUTH_ROUTES.settingsAccount,
        },
        {
          label: headerText.title,
          description: headerText.description,
        },
      ],
    };
  }

  if (pathname === CLIENT_PUBLIC_ROUTES.login) {
    return {
      back: {
        href: CLIENT_AUTH_ROUTES.dashboard,
        label: lang.shell.back,
      },
      breadcrumbs: [
        homeCrumb(lang),
        {
          label: lang.login.title,
          description: lang.login.description,
        },
      ],
    };
  }

  if (pathname === CLIENT_PUBLIC_ROUTES.register) {
    return {
      back: {
        href: CLIENT_PUBLIC_ROUTES.login,
        label: lang.login.title,
      },
      breadcrumbs: [
        homeCrumb(lang),
        {
          label: lang.login.title,
          href: CLIENT_PUBLIC_ROUTES.login,
        },
        {
          label: lang.register.title,
          description: lang.register.description,
        },
      ],
    };
  }

  return topLevelPageChrome(lang, pathname);
}
