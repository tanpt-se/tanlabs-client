'use client';

import type { CSSProperties } from 'react';

import { TrashIcon } from '@heroicons/react/24/outline';
import { AspectRatio } from '@astryxdesign/core/AspectRatio';
import { Button } from '@astryxdesign/core/Button';
import { Divider } from '@astryxdesign/core/Divider';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { HStack, VStack } from '@astryxdesign/core/Layout';
import { List, ListItem } from '@astryxdesign/core/List';
import { Text } from '@astryxdesign/core/Text';
import { useLocale } from '@tanlabs/providers';
import { useNavigate } from 'react-router-dom';

import { useCart } from '@/features/cart/cart-context';
import { useShopAuthenticated } from '@/features/cart/hooks/use-shop-authenticated';
import type { ClientLang } from '@/shared/i18n';
import { CLIENT_AUTH_ROUTES } from '@/shared/routing';
import { buildOpenShopLoginUrl } from '@/shared/routing/shop-login';

const thumbnailStyle: CSSProperties = {
  width: 56,
  borderRadius: 'var(--radius-element)',
  overflow: 'hidden',
};

const thumbnailImageStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

function formatMoney(amount: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function CartContents({
  cartLang,
  onCheckout,
}: {
  cartLang: ClientLang['cart'];
  onCheckout?: () => void;
}) {
  const { locale } = useLocale();
  const navigate = useNavigate();
  const isAuthenticated = useShopAuthenticated();
  const { items, subtotal, removeItem, closeCart } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }

    onCheckout?.();
    closeCart();
    navigate(CLIENT_AUTH_ROUTES.cart);
  };

  if (items.length === 0) {
    return (
      <EmptyState
        title={cartLang.drawer.emptyTitle}
        description={cartLang.drawer.emptyDescription}
      />
    );
  }

  return (
    <VStack gap={6} hAlign="stretch" width="100%">
      <List hasDividers density="balanced">
        {items.map((item) => {
          const name = cartLang.items[item.nameKey];
          const lineTotal = item.price * item.quantity;

          return (
            <ListItem
              key={item.id}
              label={name}
              description={
                <VStack gap={1} hAlign="stretch">
                  <Text type="supporting" color="secondary">
                    {cartLang.drawer.quantity}: {item.quantity}
                  </Text>
                  <Text type="body">{formatMoney(lineTotal, locale)}</Text>
                </VStack>
              }
              startContent={
                <div style={thumbnailStyle}>
                  <AspectRatio ratio={1}>
                    <img src={item.imageUrl} alt={name} style={thumbnailImageStyle} />
                  </AspectRatio>
                </div>
              }
              endContent={
                <IconButton
                  label={cartLang.drawer.remove}
                  icon={<Icon icon={TrashIcon} size="sm" />}
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                />
              }
            />
          );
        })}
      </List>

      <Divider />

      <VStack gap={4} hAlign="stretch">
        <HStack hAlign="between" width="100%">
          <Text type="body">{cartLang.drawer.subtotal}</Text>
          <Text type="body">{formatMoney(subtotal, locale)}</Text>
        </HStack>
        {!isAuthenticated ? (
          <Text type="supporting" color="secondary">
            {cartLang.drawer.checkoutGuestHint}
          </Text>
        ) : null}
        <Button label={cartLang.drawer.checkout} variant="primary" clickAction={handleCheckout} />
        {!isAuthenticated ? (
          <Button
            label={cartLang.drawer.checkoutSignInOptional}
            variant="ghost"
            href={buildOpenShopLoginUrl(CLIENT_AUTH_ROUTES.cart)}
          />
        ) : null}
      </VStack>
    </VStack>
  );
}
