'use client';

import type { SidebarItemConfig } from '@tanlabs/components';
import type { MainLayoutSidebarGroup } from '@tanlabs/providers';
import { House, User } from 'lucide-react';

import type { ClientLang } from '@/shared/i18n';
import { CLIENT_AUTH_ROUTES } from '@/shared/routing';

function icon(IconComponent: typeof House) {
  return (
    <span className="flex size-4 items-center justify-center">
      <IconComponent className="size-4" />
    </span>
  );
}

export function buildDashboardShellNavigation(params: {
  pathname: string;
  shell: ClientLang['shell'];
}): MainLayoutSidebarGroup[] {
  const { pathname, shell } = params;

  const items: SidebarItemConfig[] = [
    {
      key: 'dashboard',
      href: CLIENT_AUTH_ROUTES.dashboard,
      label: shell.nav.dashboard,
      icon: icon(House),
      active: pathname === CLIENT_AUTH_ROUTES.dashboard,
    },
    {
      key: 'my-account',
      href: CLIENT_AUTH_ROUTES.myAccount,
      label: shell.nav.myAccount,
      icon: icon(User),
      active: pathname === CLIENT_AUTH_ROUTES.myAccount,
    },
  ];

  return [{ items }];
}
