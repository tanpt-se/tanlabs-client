'use client';

import type { MouseEvent, ReactNode } from 'react';

import { AppShell } from '@astryxdesign/core/AppShell';
import { Layout, LayoutContent } from '@astryxdesign/core/Layout';
import {
  SideNav,
  SideNavHeading,
  SideNavItem,
  SideNavSection,
} from '@astryxdesign/core/SideNav';
import { VStack } from '@astryxdesign/core/Stack';

import { AppBreadcrumbs } from '@tanlabs/astryx';

import type {
  ShellSideNavBrand,
  ShellSideNavBreadcrumb,
  ShellSideNavGroup,
  ShellSideNavItem,
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

function ShellSideNavItemTree({
  item,
  onNavigate,
}: {
  item: ShellSideNavItem;
  onNavigate?: (href: string) => void;
}) {
  const hasChildren = Boolean(item.children?.length);

  const handleClick = (event: MouseEvent<Element>) => {
    if (!item.href || !onNavigate || !shouldHandleClientNavigation(event)) {
      return;
    }
    event.preventDefault();
    onNavigate(item.href);
  };

  if (hasChildren) {
    return (
      <SideNavItem
        label={item.label}
        icon={item.icon}
        href={item.href}
        isSelected={item.isSelected}
        collapsible={item.collapsible ?? true}
        onClick={item.href ? handleClick : undefined}
      >
        {item.children?.map((child) => (
          <ShellSideNavItemTree key={child.key} item={child} onNavigate={onNavigate} />
        ))}
      </SideNavItem>
    );
  }

  return (
    <SideNavItem
      label={item.label}
      href={item.href}
      icon={item.icon}
      isSelected={item.isSelected}
      onClick={handleClick}
    />
  );
}

export function ShellSideNavLayout({
  brand,
  breadcrumbs,
  backHref,
  backLabel,
  children,
  navGroups,
  onNavigate,
}: {
  brand?: ShellSideNavBrand;
  breadcrumbs?: ShellSideNavBreadcrumb[];
  backHref?: string;
  backLabel?: string;
  children: ReactNode;
  navGroups: ShellSideNavGroup[];
  onNavigate?: (href: string) => void;
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
                style={{
                  minHeight: 'calc(var(--size-element-lg) + var(--spacing-6))',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
            ) : undefined
          }
        >
          {navGroups.map((group, index) => (
            <SideNavSection
              key={group.label ?? index}
              title={group.label ?? 'Navigation'}
              isHeaderHidden={!group.label}
            >
              {group.items.map((item) => (
                <ShellSideNavItemTree key={item.key} item={item} onNavigate={onNavigate} />
              ))}
            </SideNavSection>
          ))}
        </SideNav>
      }
    >
      <Layout
        height="fill"
        content={
          <LayoutContent
            padding={4}
            style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, height: '100%' }}
          >
            <VStack
              gap={4}
              hAlign="stretch"
              style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}
            >
              {breadcrumbs && breadcrumbs.length > 0 ? (
                <AppBreadcrumbs
                  items={breadcrumbs}
                  onNavigate={onNavigate}
                  backHref={backHref}
                  backLabel={backLabel}
                />
              ) : null}
              {children}
            </VStack>
          </LayoutContent>
        }
      />
    </AppShell>
  );
}
