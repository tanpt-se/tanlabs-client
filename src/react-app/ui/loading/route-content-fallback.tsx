'use client';

import { Skeleton } from '@astryxdesign/core/Skeleton';
import { HStack, VStack } from '@astryxdesign/core/Layout';

export function RouteContentFallback() {
  return (
    <VStack gap={4} padding={4} aria-busy="true" aria-label="Loading page">
      <Skeleton width="40%" height={28} index={0} />
      <Skeleton width="65%" height={16} index={1} />
      <VStack gap={3}>
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} width="100%" height={96} radius={3} index={index + 2} />
        ))}
      </VStack>
    </VStack>
  );
}

export function DashboardPageSkeleton() {
  return (
    <VStack gap={4} padding={4} aria-busy="true" aria-label="Loading dashboard">
      <HStack gap={4} wrap="wrap">
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} width={280} height={140} radius={3} index={index} />
        ))}
      </HStack>
    </VStack>
  );
}
