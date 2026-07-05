'use client';

import { Skeleton } from '@astryxdesign/core/Skeleton';
import { HStack, VStack } from '@astryxdesign/core/Layout';

export function DetailPageSkeleton() {
  return (
    <VStack gap={4} padding={4} aria-busy="true" aria-label="Loading details">
      <HStack gap={4} vAlign="center">
        <Skeleton width={64} height={64} radius="rounded" index={0} />
        <VStack gap={2}>
          <Skeleton width={200} height={24} index={1} />
          <Skeleton width={260} height={16} index={2} />
        </VStack>
      </HStack>
      <VStack gap={3}>
        {[0, 1, 2, 3].map((index) => (
          <HStack key={index} gap={4} vAlign="center">
            <Skeleton width={120} height={16} index={index * 2 + 3} />
            <Skeleton width={180} height={16} index={index * 2 + 4} />
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}
