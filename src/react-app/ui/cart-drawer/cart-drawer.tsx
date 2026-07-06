'use client';

import { MobileNav } from '@astryxdesign/core/MobileNav';
import { useLocale } from '@tanlabs/providers';

import { useCart } from '@/features/cart';
import { getClientLang } from '@/shared/i18n';

import { CartContents } from '@/features/cart/components/cart-contents';

export function CartDrawer() {
  const { locale } = useLocale();
  const lang = getClientLang(locale);
  const { itemCount, isOpen, setCartOpen } = useCart();

  const drawerTitle =
    itemCount > 0 ? `${lang.cart.drawer.title} (${itemCount})` : lang.cart.drawer.title;

  return (
    <MobileNav
      isOpen={isOpen}
      onOpenChange={setCartOpen}
      header={drawerTitle}
      side="end"
      width={420}
    >
      <CartContents cartLang={lang.cart} />
    </MobileNav>
  );
}
