'use client';

import { useState, useEffect, type CSSProperties, type ReactNode } from 'react';

import {
  ArrowLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useMediaQuery } from '@astryxdesign/core/hooks';
import { Button } from '@astryxdesign/core/Button';
import { Divider } from '@astryxdesign/core/Divider';
import { Icon } from '@astryxdesign/core/Icon';
import {
  Layout,
  LayoutContent,
  LayoutPanel,
  VStack,
} from '@astryxdesign/core/Layout';
import { List, ListItem } from '@astryxdesign/core/List';
import { Toolbar } from '@astryxdesign/core/Toolbar';
import { Heading } from '@astryxdesign/core/Text';
import type { IconType } from '@astryxdesign/core/Icon';
import { useNavigate } from 'react-router-dom';

import { APP_CONTENT_MAX_WIDTH } from '@/ui/app-container';

import type { SettingsSectionId } from '@/features/dashboard/lib/settings-section';

const sideNavPadding: CSSProperties = {
  paddingBlock: 'var(--spacing-4)',
  paddingInline: 'var(--spacing-3)',
};

const sideNavHeading: CSSProperties = {
  marginInline: 'var(--spacing-4)',
};

export type SettingsSidebarItem = {
  id: SettingsSectionId;
  label: string;
  href: string;
  icon: IconType;
};

export function SettingsSidebarLayout({
  activeSection,
  backLabel,
  children,
  sections,
  sidebarTitle,
  sectionTitle,
}: {
  activeSection: SettingsSectionId;
  backLabel: string;
  children: ReactNode;
  sections: SettingsSidebarItem[];
  sidebarTitle: string;
  sectionTitle: string;
}) {
  const navigate = useNavigate();
  const isNarrow = useMediaQuery('(max-width: 768px)');
  const [mobileView, setMobileView] = useState<'nav' | 'detail'>('nav');

  useEffect(() => {
    if (isNarrow) {
      setMobileView('detail');
      return;
    }
    setMobileView('nav');
  }, [activeSection, isNarrow]);

  const selectSection = (item: SettingsSidebarItem) => {
    navigate(item.href);
    if (isNarrow) {
      setMobileView('detail');
    }
  };

  const navList = (
    <VStack gap={4} style={sideNavPadding}>
      <Heading level={2} style={sideNavHeading}>
        {sidebarTitle}
      </Heading>
      <List density="spacious">
        {sections.map((item) => (
          <ListItem
            key={item.id}
            label={item.label}
            startContent={<Icon icon={item.icon} />}
            endContent={
              isNarrow ? <Icon icon={ChevronRightIcon} size="sm" color="secondary" /> : undefined
            }
            isSelected={!isNarrow && activeSection === item.id}
            onClick={() => selectSection(item)}
          />
        ))}
      </List>
      <Divider />
    </VStack>
  );

  if (isNarrow && mobileView === 'nav') {
    return (
      <Layout
        height="auto"
        contentWidth={APP_CONTENT_MAX_WIDTH}
        content={<LayoutContent padding={2}>{navList}</LayoutContent>}
      />
    );
  }

  return (
    <Layout
      height="auto"
      contentWidth={APP_CONTENT_MAX_WIDTH}
      start={
        isNarrow ? undefined : (
          <LayoutPanel hasDivider padding={0} width={280}>
            {navList}
          </LayoutPanel>
        )
      }
      content={
        <LayoutContent padding={4}>
          <VStack gap={6} hAlign="stretch" width="100%">
            {isNarrow ? (
              <Toolbar
                label={`${backLabel} — ${sectionTitle}`}
                gap={2}
                startContent={
                  <>
                    <Button
                      label={backLabel}
                      variant="ghost"
                      size="sm"
                      isIconOnly
                      icon={<Icon icon={ArrowLeftIcon} size="sm" />}
                      onClick={() => setMobileView('nav')}
                    />
                    <Heading level={2}>{sectionTitle}</Heading>
                  </>
                }
              />
            ) : (
              <Heading level={2}>{sectionTitle}</Heading>
            )}
            {children}
          </VStack>
        </LayoutContent>
      }
    />
  );
}
