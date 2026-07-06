'use client';

import type { ReactNode } from 'react';

import { AppShell } from '@astryxdesign/core/AppShell';
import { NavIcon } from '@astryxdesign/core/NavIcon';
import { VStack } from '@astryxdesign/core/Stack';
import {
  TopNav,
  TopNavHeading,
  TopNavItem,
  TopNavMegaMenu,
} from '@astryxdesign/core/TopNav';

import { AppBreadcrumbs } from '@tanlabs/astryx';
import { AppContainer } from '@/ui/app-container';
import { ShopFooter } from '@/ui/shop-footer';

import { ShellTopNavMegaItems } from './mega-menu-parts';
import type {
  ShellTopNavBrand,
  ShellTopNavBreadcrumb,
  ShellTopNavEntry,
} from './types';

function renderCenterContent(navEntries: ShellTopNavEntry[]) {
  return navEntries.map((entry) => {
    if (entry.type === 'item') {
      const { item } = entry;
      return (
        <TopNavItem
          key={item.key}
          label={item.label}
          href={item.href}
          isSelected={item.isSelected}
        />
      );
    }

    const { menu } = entry;
    return (
      <TopNavMegaMenu
        key={menu.key}
        label={menu.label}
        featured={menu.featured}
        items={<ShellTopNavMegaItems items={menu.items} />}
      />
    );
  });
}

export function ShellTopNavLayout({
  brand,
  breadcrumbs,
  backHref,
  backLabel,
  children,
  endContent,
  navEntries,
  onNavigate,
}: {
  brand?: ShellTopNavBrand;
  breadcrumbs?: ShellTopNavBreadcrumb[];
  backHref?: string;
  backLabel?: string;
  children: ReactNode;
  endContent?: ReactNode;
  navEntries: ShellTopNavEntry[];
  onNavigate?: (href: string) => void;
}) {
  return (
    <AppShell
      variant="surface"
      height="auto"
      contentPadding={0}
      topNav={
        <VStack width="100%" hAlign="stretch">
          <AppContainer clipOverflow={false}>
            <TopNav
              label="Shop navigation"
              heading={
                brand ? (
                  <TopNavHeading
                    heading={brand.title}
                    logo={brand.icon ? <NavIcon icon={brand.icon} /> : undefined}
                    headingHref={brand.href}
                  />
                ) : undefined
              }
              centerContent={renderCenterContent(navEntries)}
              endContent={endContent}
            />
          </AppContainer>
        </VStack>
      }
    >
      <AppContainer contentArea>
        <VStack gap={10} hAlign="stretch" width="100%" style={{ minWidth: 0 }}>
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <AppBreadcrumbs
              items={breadcrumbs}
              onNavigate={onNavigate}
              backHref={backHref}
              backLabel={backLabel}
            />
          ) : null}
          {children}
          <ShopFooter />
        </VStack>
      </AppContainer>
    </AppShell>
  );
}
