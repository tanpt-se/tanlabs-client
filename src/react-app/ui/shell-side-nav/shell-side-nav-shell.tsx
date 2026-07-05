'use client';

import type { MouseEvent, ReactNode } from 'react';

import { AppShell } from '@astryxdesign/core/AppShell';
import { Layout, LayoutContent } from '@astryxdesign/core/Layout';
import { MoreMenu } from '@astryxdesign/core/MoreMenu';
import {
  SideNav,
  SideNavHeading,
  SideNavItem,
  SideNavSection,
} from '@astryxdesign/core/SideNav';
import { VStack } from '@astryxdesign/core/Stack';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { Icon } from '@astryxdesign/core/Icon';

import { AppBreadcrumbs } from '@tanlabs/astryx';

import { LOCALE_OPTIONS } from '@/shared/i18n/locale-options';
import { useLocale, useTheme } from '@tanlabs/providers';

import type {
  ShellSideNavBrand,
  ShellSideNavBreadcrumb,
  ShellSideNavGroup,
  ShellSideNavUserMenu,
} from './types';

function shouldHandleClientNavigation(event: MouseEvent<Element>) {
  return !(
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.altKey ||
    event.ctrlKey ||
    event.shiftKey
  );
}

function ShellSideNavUserFooter({ userMenu }: { userMenu: ShellSideNavUserMenu }) {
  const { setLocale } = useLocale();
  const { setTheme } = useTheme();
  const displayName = userMenu.userName ?? userMenu.email ?? 'Account';

  return (
    <SideNavSection title="Account" isHeaderHidden>
      <SideNavItem
        label={displayName}
        icon={<Icon icon={UserCircleIcon} size="sm" />}
        endContent={
          <MoreMenu
            size="sm"
            label="Account options"
            items={[
              {
                type: 'section',
                title: 'Theme',
                items: [
                  { label: 'Light', onClick: () => setTheme('light') },
                  { label: 'Dark', onClick: () => setTheme('dark') },
                  { label: 'System', onClick: () => setTheme('system') },
                ],
              },
              {
                type: 'section',
                title: 'Language',
                items: LOCALE_OPTIONS.map((option) => ({
                  label: option.label,
                  onClick: () => setLocale(option.value),
                })),
              },
              ...(userMenu.onLogout
                ? [
                    { type: 'divider' as const },
                    {
                      label: userMenu.logoutLabel ?? 'Logout',
                      onClick: () => {
                        void userMenu.onLogout?.();
                      },
                    },
                  ]
                : []),
            ]}
          />
        }
      />
    </SideNavSection>
  );
}

export function ShellSideNavLayout({
  brand,
  breadcrumbs,
  children,
  navGroups,
  onNavigate,
  userMenu,
}: {
  brand?: ShellSideNavBrand;
  breadcrumbs?: ShellSideNavBreadcrumb[];
  children: ReactNode;
  navGroups: ShellSideNavGroup[];
  onNavigate?: (href: string) => void;
  userMenu?: ShellSideNavUserMenu;
}) {
  return (
    <AppShell
      contentPadding={0}
      sideNav={
        <SideNav
          collapsible
          resizable={{ defaultWidth: 288, minWidth: 220, maxWidth: 420 }}
          header={
            brand ? (
              <SideNavHeading
                heading={brand.title}
                subheading={brand.subtitle}
                headingHref={brand.href}
                icon={brand.icon}
              />
            ) : undefined
          }
          footer={userMenu ? <ShellSideNavUserFooter userMenu={userMenu} /> : undefined}
        >
          {navGroups.map((group, index) => (
            <SideNavSection
              key={group.label ?? index}
              title={group.label ?? 'Navigation'}
              isHeaderHidden={!group.label}
            >
              {group.items.map((item) => (
                <SideNavItem
                  key={item.key}
                  label={item.label}
                  href={item.href}
                  icon={item.icon}
                  isSelected={item.isSelected}
                  onClick={(event) => {
                    if (!item.href || !onNavigate || !shouldHandleClientNavigation(event)) {
                      return;
                    }
                    event.preventDefault();
                    onNavigate(item.href);
                  }}
                />
              ))}
            </SideNavSection>
          ))}
        </SideNav>
      }
    >
      <Layout
        height="fill"
        content={
          <LayoutContent padding={4}>
            <VStack gap={4} hAlign="stretch">
              {breadcrumbs && breadcrumbs.length > 0 ? (
                <AppBreadcrumbs items={breadcrumbs} onNavigate={onNavigate} />
              ) : null}
              {children}
            </VStack>
          </LayoutContent>
        }
      />
    </AppShell>
  );
}
