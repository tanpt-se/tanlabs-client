'use client';

import type { ReactNode } from 'react';

import { useMediaQuery } from '@astryxdesign/core/hooks';
import { Grid } from '@astryxdesign/core/Grid';
import { Layout, LayoutContent, LayoutPanel, VStack } from '@astryxdesign/core/Layout';
import { List, ListItem } from '@astryxdesign/core/List';
import { Tab, TabList } from '@astryxdesign/core/TabList';
import { Heading, Text } from '@astryxdesign/core/Text';

import { APP_CONTENT_MAX_WIDTH } from '@/ui/app-container';

export type SettingsSection = {
  id: string;
  label: string;
};

export function SettingsLayout({
  activeSection,
  children,
  onSectionChange,
  sections,
}: {
  activeSection: string;
  children: ReactNode;
  onSectionChange: (sectionId: string) => void;
  sections: SettingsSection[];
}) {
  const isNarrow = useMediaQuery('(max-width: 768px)');

  return (
    <Layout
      height="auto"
      contentWidth={APP_CONTENT_MAX_WIDTH}
      start={
        isNarrow ? undefined : (
          <LayoutPanel hasDivider={false} width={260} padding={2}>
            <List density="balanced">
              {sections.map((section) => (
                <ListItem
                  key={section.id}
                  label={section.label}
                  isSelected={activeSection === section.id}
                  onClick={() => onSectionChange(section.id)}
                />
              ))}
            </List>
          </LayoutPanel>
        )
      }
      content={
        <LayoutContent padding={4}>
          <VStack gap={4}>
            {isNarrow ? (
              <VStack hAlign="center">
                <TabList value={activeSection} onChange={onSectionChange}>
                  {sections.map((section) => (
                    <Tab key={section.id} value={section.id} label={section.label} />
                  ))}
                </TabList>
              </VStack>
            ) : null}
            {children}
          </VStack>
        </LayoutContent>
      }
    />
  );
}

export function SettingsSectionPanel({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description?: string;
  title?: string;
}) {
  if (!title) {
    return <VStack gap={4}>{children}</VStack>;
  }

  return (
    <Grid columns={{ minWidth: 320 }} gap={10}>
      <VStack gap={1}>
        <Heading level={3}>{title}</Heading>
        {description ? (
          <Text type="supporting" color="secondary">
            {description}
          </Text>
        ) : null}
      </VStack>
      <VStack gap={4}>{children}</VStack>
    </Grid>
  );
}
