'use client';

import { useEffect, useState } from 'react';

import { Card } from '@astryxdesign/core/Card';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { Layout, LayoutContent } from '@astryxdesign/core/Layout';
import { Text, Heading } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/Stack';

export interface RateLimitModalLang {
  eyebrow: string;
  title: string;
  description: string;
  countdownLabel: string;
  close: string;
}

function formatCountdown(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSeconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((safeSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(safeSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export function RateLimitModal({
  blockedUntil,
  lang,
  onExpired,
}: {
  blockedUntil: number;
  lang: RateLimitModalLang;
  onExpired: () => void;
}) {
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(() =>
    Math.max(0, Math.ceil((blockedUntil - Date.now()) / 1000)),
  );

  useEffect(() => {
    const computeRemaining = () => Math.max(0, Math.ceil((blockedUntil - Date.now()) / 1000));

    const timer = window.setInterval(() => {
      const nextRemaining = computeRemaining();
      setRemainingSeconds(nextRemaining);
      if (nextRemaining <= 0) {
        window.clearInterval(timer);
        onExpired();
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [blockedUntil, onExpired]);

  return (
    <Dialog isOpen onOpenChange={() => undefined} purpose="required" width={400}>
      <Layout
        header={<DialogHeader title={lang.title} subtitle={lang.description} />}
        content={
          <LayoutContent padding={4}>
            <VStack gap={4} hAlign="center">
              <Text type="supporting" color="secondary">
                {lang.eyebrow}
              </Text>
              <Card padding={4} width="100%">
                <VStack gap={2} hAlign="center">
                  <Text type="body" weight="medium">
                    {lang.countdownLabel}
                  </Text>
                  <Heading level={3}>
                    {remainingSeconds === null ? '--:--:--' : formatCountdown(remainingSeconds)}
                  </Heading>
                </VStack>
              </Card>
            </VStack>
          </LayoutContent>
        }
      />
    </Dialog>
  );
}
