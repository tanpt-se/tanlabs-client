'use client';

import { Center } from '@astryxdesign/core/Center';
import { Spinner } from '@astryxdesign/core/Spinner';

export function AuthBootstrapFallback() {
  return (
    <Center axis="both" width="100%" style={{ minHeight: '100vh' }}>
      <Spinner size="lg" label="Loading session" />
    </Center>
  );
}
