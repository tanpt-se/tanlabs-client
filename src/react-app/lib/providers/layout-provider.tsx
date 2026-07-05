'use client';

import type { ReactNode } from 'react';

import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Center } from '@astryxdesign/core/Center';
import { Link } from '@astryxdesign/core/Link';
import { VStack } from '@astryxdesign/core/Layout';
import { Text, Heading } from '@astryxdesign/core/Text';
import {
  DarkBackground,
  LightBackground,
  StatusErrorIllustration,
  StatusNotFoundIllustration,
  StatusSessionIllustration,
} from '@tanlabs/assets';
import { useTheme } from '@tanlabs/providers';

export function BaseLayout({ children }: { children: ReactNode; className?: string }) {
  const { theme } = useTheme();

  return (
    <Center axis="both" width="100%" style={{ minHeight: '100dvh', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true">
        {theme === 'dark' ? <DarkBackground /> : <LightBackground />}
      </div>
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>{children}</div>
    </Center>
  );
}

export function StatusPage({
  code,
  title,
  description,
  dashboardHref,
  dashboardLabel,
  reloadLabel,
  onReload,
}: {
  code?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  dashboardHref?: string;
  dashboardLabel?: ReactNode;
  reloadLabel?: ReactNode;
  onReload?: () => void;
}) {
  const normalizedCode = typeof code === 'string' ? code : undefined;
  const illustration =
    normalizedCode === '404' ? (
      <StatusNotFoundIllustration />
    ) : normalizedCode === '401' || normalizedCode === '440' ? (
      <StatusSessionIllustration />
    ) : (
      <StatusErrorIllustration />
    );

  return (
    <BaseLayout>
      <Card padding={6} width="100%" style={{ maxWidth: 480 }}>
        <VStack gap={4} hAlign="center">
          {illustration}
          {code ? (
            <Text type="supporting" color="secondary">
              {code}
            </Text>
          ) : null}
          {title ? <Heading level={2}>{title}</Heading> : null}
          {description ? (
            <Text type="body" color="secondary" justify="center">
              {description}
            </Text>
          ) : null}
          {dashboardHref || reloadLabel ? (
            <VStack gap={2} hAlign="center">
              {dashboardHref ? (
                <Link href={dashboardHref}>
                  {String(dashboardLabel ?? 'Go to dashboard')}
                </Link>
              ) : null}
              {reloadLabel ? (
                <Button
                  label={String(reloadLabel)}
                  variant="secondary"
                  onClick={() => {
                    if (onReload) {
                      onReload();
                      return;
                    }
                    window.location.reload();
                  }}
                />
              ) : null}
            </VStack>
          ) : null}
        </VStack>
      </Card>
    </BaseLayout>
  );
}
