'use client';

import { VStack } from '@astryxdesign/core/Layout';
import { Text } from '@astryxdesign/core/Text';

import { CartContents } from '@/features/cart/components/cart-contents';
import type { ClientLang } from '@/shared/i18n';

export function CartPage({ lang }: { lang: ClientLang['cart'] }) {
  return (
    <VStack gap={6} hAlign="stretch" width="100%">
      <Text type="supporting" color="secondary">
        {lang.description}
      </Text>
      <CartContents cartLang={lang} />
    </VStack>
  );
}
