'use client';

import { useEffect, useState } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Eyebrow,
  ModalScaffold,
  PageTitle,
} from '@tanlabs/components';

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
  const [remainingSeconds, setRemainingSeconds] = useState(
    Math.max(0, Math.ceil((blockedUntil - Date.now()) / 1000)),
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      const nextRemaining = Math.max(0, Math.ceil((blockedUntil - Date.now()) / 1000));
      setRemainingSeconds(nextRemaining);
      if (nextRemaining <= 0) {
        window.clearInterval(timer);
        onExpired();
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [blockedUntil, onExpired]);

  return (
    <ModalScaffold
      closeLabel={lang.close}
      dismissible={false}
      onClose={() => undefined}
      panelClassName="max-w-md bg-(--surface-overlay) shadow-(--shadow-panel)"
      title={lang.title}
      description={lang.description}
      bodyClassName="space-y-4 text-center"
    >
      <Eyebrow as="p" className="text-center">
        {lang.eyebrow}
      </Eyebrow>
      <Card
        role="timer"
        aria-label={lang.countdownLabel}
        className="border-(--warning-border) bg-(--warning-soft)"
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold tracking-normal text-(--warning-text)">
            {lang.countdownLabel}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PageTitle as="p" className="font-mono tracking-[0.22em]">
            {formatCountdown(remainingSeconds)}
          </PageTitle>
        </CardContent>
      </Card>
    </ModalScaffold>
  );
}
