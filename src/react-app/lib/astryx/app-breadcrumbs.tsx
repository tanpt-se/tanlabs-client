'use client';

import type { MouseEvent, ReactNode } from 'react';

import { BreadcrumbItem, Breadcrumbs } from '@astryxdesign/core/Breadcrumbs';
import { VStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';

export type AppBreadcrumbItem = {
  label: ReactNode;
  description?: ReactNode;
  href?: string;
};

function shouldHandleClientNavigation(event: MouseEvent<Element>) {
  return !(
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.altKey ||
    event.ctrlKey ||
    event.shiftKey
  );
}

export function AppBreadcrumbs({
  items,
  onNavigate,
  variant = 'supporting',
}: {
  items: AppBreadcrumbItem[];
  onNavigate?: (href: string) => void;
  variant?: 'default' | 'supporting';
}) {
  if (items.length === 0) {
    return null;
  }

  const lastCrumb = items[items.length - 1];

  return (
    <VStack gap={1} hAlign="stretch">
      <Breadcrumbs variant={variant}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const href = !isLast ? item.href : undefined;

          return (
            <BreadcrumbItem
              key={item.href ?? `${index}-${String(item.label)}`}
              href={href}
              isCurrent={isLast}
              onClick={
                href && onNavigate
                  ? (event) => {
                      if (!shouldHandleClientNavigation(event)) {
                        return;
                      }
                      event.preventDefault();
                      onNavigate(href);
                    }
                  : undefined
              }
            >
              {item.label}
            </BreadcrumbItem>
          );
        })}
      </Breadcrumbs>
      {lastCrumb?.description ? (
        <Text type="supporting" color="secondary" size="sm">
          {lastCrumb.description}
        </Text>
      ) : null}
    </VStack>
  );
}
