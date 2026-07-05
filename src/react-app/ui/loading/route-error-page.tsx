'use client';

import { useRouteError } from 'react-router-dom';

import { Button } from '@astryxdesign/core/Button';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { Center } from '@astryxdesign/core/Center';

export function RouteErrorPage() {
  const error = useRouteError();
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'Something went wrong while loading this page.';

  return (
    <Center axis="both" width="100%" style={{ minHeight: '50vh', padding: 24 }}>
      <EmptyState
        title="Unable to load page"
        description={message}
        actions={
          <Button
            label="Try again"
            variant="primary"
            onClick={() => window.location.reload()}
          />
        }
      />
    </Center>
  );
}
