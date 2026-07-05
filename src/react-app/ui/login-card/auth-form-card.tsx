'use client';

import type { ReactNode } from 'react';

import { Card } from '@astryxdesign/core/Card';
import { Heading, Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/Layout';

export function AuthFormCard({
  children,
  subtitle,
  title,
}: {
  children: ReactNode;
  subtitle?: string;
  title: string;
}) {
  return (
    <Card padding={8} width="100%">
      <VStack gap={4} hAlign="stretch">
        <VStack gap={1} hAlign="center">
          <Heading level={2}>{title}</Heading>
          {subtitle ? (
            <Text type="body" color="secondary" size="sm">
              {subtitle}
            </Text>
          ) : null}
        </VStack>
        {children}
      </VStack>
    </Card>
  );
}
