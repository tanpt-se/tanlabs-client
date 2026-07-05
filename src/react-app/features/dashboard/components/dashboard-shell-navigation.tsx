'use client';

import { Cog6ToothIcon, HomeIcon } from '@heroicons/react/24/outline';
import { Icon } from '@astryxdesign/core/Icon';
import type { IconType } from '@astryxdesign/core/Icon';
import type { ShellSideNavGroup } from '@/ui/shell-side-nav';

import type { ClientLang } from '@/shared/i18n';
import { CLIENT_AUTH_ROUTES } from '@/shared/routing';

function navIcon(IconComponent: IconType) {
  return <Icon icon={IconComponent} size="sm" />;
}

function isSettingsPath(pathname: string) {
  return (
    pathname === CLIENT_AUTH_ROUTES.settings ||
    pathname.startsWith('/settings/')
  );
}

export function buildDashboardShellNavigation(params: {
  pathname: string;
  shell: ClientLang['shell'];
}): ShellSideNavGroup[] {
  const { pathname, shell } = params;
  const settingsMenu = shell.nav.settingsMenu;

  return [
    {
      items: [
        {
          key: 'dashboard',
          href: CLIENT_AUTH_ROUTES.dashboard,
          label: shell.nav.dashboard,
          icon: navIcon(HomeIcon),
          isSelected: pathname === CLIENT_AUTH_ROUTES.dashboard,
        },
        {
          key: 'settings',
          label: shell.nav.settings,
          icon: navIcon(Cog6ToothIcon),
          collapsible: { defaultIsCollapsed: !isSettingsPath(pathname) },
          children: [
            {
              key: 'settings-account',
              href: CLIENT_AUTH_ROUTES.settingsAccount,
              label: settingsMenu.account,
              isSelected: pathname === CLIENT_AUTH_ROUTES.settingsAccount,
            },
            {
              key: 'settings-general',
              href: CLIENT_AUTH_ROUTES.settingsGeneral,
              label: settingsMenu.general,
              isSelected: pathname === CLIENT_AUTH_ROUTES.settingsGeneral,
            },
            {
              key: 'settings-billing',
              href: CLIENT_AUTH_ROUTES.settingsBilling,
              label: settingsMenu.billing,
              isSelected: pathname === CLIENT_AUTH_ROUTES.settingsBilling,
            },
          ],
        },
      ],
    },
  ];
}
