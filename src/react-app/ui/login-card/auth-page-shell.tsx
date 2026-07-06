'use client';

import type { CSSProperties, ReactNode } from 'react';

import { CubeIcon } from '@heroicons/react/24/outline';
import { Center } from '@astryxdesign/core/Center';
import { Icon } from '@astryxdesign/core/Icon';
import { VStack } from '@astryxdesign/core/Layout';
import { Text } from '@astryxdesign/core/Text';
import { BRAND } from '@tanlabs/config';

import { loginCardContentStyle, loginCardPageStyle } from './styles';

const overlayStyle: CSSProperties = {
  position: 'absolute',
  top: 'var(--spacing-6)',
  right: 'var(--spacing-6)',
  zIndex: 2,
};

export function AuthPageShell({
  children,
  overlay,
}: {
  children: ReactNode;
  overlay?: ReactNode;
}) {
  return (
    <Center axis="both" width="100%" style={loginCardPageStyle}>
      {overlay ? <div style={overlayStyle}>{overlay}</div> : null}
      <VStack gap={4} hAlign="center" style={loginCardContentStyle}>
        <VStack gap={2} hAlign="center">
          <Icon icon={CubeIcon} size="lg" />
          <Text type="body" weight="bold" size="lg">
            {BRAND.webTitle}
          </Text>
        </VStack>
        {children}
      </VStack>
    </Center>
  );
}
