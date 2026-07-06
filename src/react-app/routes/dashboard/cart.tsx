import { useLocale } from '@tanlabs/providers';

import { CartPage } from '@/features/dashboard/components/cart-page';
import { getClientLang } from '@/shared/i18n';

export function CartRoute() {
  const { locale } = useLocale();
  const lang = getClientLang(locale);

  return <CartPage lang={lang.cart} />;
}
