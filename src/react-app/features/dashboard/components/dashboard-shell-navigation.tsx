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

export function buildDashboardShellNavigation(params: {
  pathname: string;
  shell: ClientLang['shell'];
}): ShellSideNavGroup[] {
  const { pathname, shell } = params;

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
          href: CLIENT_AUTH_ROUTES.settings,
          label: shell.nav.settings,
          icon: navIcon(Cog6ToothIcon),
          isSelected: pathname === CLIENT_AUTH_ROUTES.settings,
        },
      ],
    },
  ];
}
