'use client';

import { Skeleton } from '@astryxdesign/core/Skeleton';
import { HStack, StackItem, VStack } from '@astryxdesign/core/Layout';

export type TablePageSkeletonVariant = 'users' | 'default';

export function TablePageSkeleton({
  variant = 'default',
  rows = 6,
}: {
  variant?: TablePageSkeletonVariant;
  rows?: number;
}) {
  return (
    <VStack gap={3} aria-busy="true" aria-label="Loading table">
      <HStack gap={3}>
        <Skeleton width="100%" height={40} radius={2} index={0} />
      </HStack>
      <VStack gap={2}>
        {Array.from({ length: rows }, (_, rowIndex) =>
          variant === 'users' ? (
            <HStack key={rowIndex} gap={4} vAlign="center">
              <Skeleton width={32} height={32} radius="rounded" index={rowIndex * 4 + 1} />
              <StackItem size="fill">
                <VStack gap={1}>
                  <Skeleton width="45%" height={16} index={rowIndex * 4 + 2} />
                  <Skeleton width="35%" height={12} index={rowIndex * 4 + 3} />
                </VStack>
              </StackItem>
              <Skeleton width={80} height={16} index={rowIndex * 4 + 4} />
              <Skeleton width={72} height={24} radius={2} index={rowIndex * 4 + 5} />
              <Skeleton width={64} height={16} index={rowIndex * 4 + 6} />
            </HStack>
          ) : (
            <HStack key={rowIndex} gap={4} vAlign="center">
              <Skeleton width="35%" height={16} index={rowIndex * 3 + 1} />
              <Skeleton width="20%" height={16} index={rowIndex * 3 + 2} />
              <Skeleton width="15%" height={16} index={rowIndex * 3 + 3} />
              <Skeleton width="12%" height={16} index={rowIndex * 3 + 4} />
            </HStack>
          ),
        )}
      </VStack>
    </VStack>
  );
}
