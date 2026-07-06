'use client';

import { Cog6ToothIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Button } from '@astryxdesign/core/Button';
import { Icon } from '@astryxdesign/core/Icon';
import { MoreMenu } from '@astryxdesign/core/MoreMenu';
import type { DropdownMenuOption } from '@astryxdesign/core/DropdownMenu';
import { useLocale, useTheme } from '@tanlabs/providers';
import { useLocation } from 'react-router-dom';

import { useCart } from '@/features/cart';
import { LOCALE_OPTIONS } from '@/shared/i18n/locale-options';
import type { ClientLang } from '@/shared/i18n';
import { CLIENT_AUTH_ROUTES } from '@/shared/routing';
import { buildOpenShopLoginUrlFromLocation } from '@/shared/routing/shop-login';

export function ShopHeaderActions({
  lang,
  isAuthenticated,
}: {
  lang: ClientLang['shell'];
  isAuthenticated: boolean;
}) {
  const { setLocale } = useLocale();
  const { setTheme } = useTheme();
  const { pathname, search } = useLocation();
  const { itemCount, openCart } = useCart();

  const cartLabel =
    itemCount > 0 ? `${lang.header.cart} (${itemCount})` : lang.header.cart;

  const authAction = isAuthenticated
    ? { href: CLIENT_AUTH_ROUTES.settingsAccount }
    : { href: buildOpenShopLoginUrlFromLocation(pathname, search) };

  const preferenceItems: DropdownMenuOption[] = [
    {
      type: 'section',
      title: lang.header.languageSection,
      items: LOCALE_OPTIONS.map((option) => ({
        label: option.label,
        onClick: () => setLocale(option.value),
      })),
    },
    { type: 'divider' },
    {
      type: 'section',
      title: lang.header.themeSection,
      items: [
        { label: lang.themeOptions.light, onClick: () => setTheme('light') },
        { label: lang.themeOptions.dark, onClick: () => setTheme('dark') },
        { label: lang.themeOptions.system, onClick: () => setTheme('system') },
      ],
    },
  ];

  return (
    <>
      <MoreMenu
        size="sm"
        label={lang.header.preferences}
        icon={<Icon icon={Cog6ToothIcon} size="sm" />}
        items={preferenceItems}
      />
      <Button
        label={cartLabel}
        variant="primary"
        icon={<Icon icon={ShoppingCartIcon} size="sm" />}
        onClick={openCart}
      />
      <Button
        label={isAuthenticated ? lang.header.myAccount : lang.header.login}
        variant="ghost"
        {...authAction}
      />
    </>
  );
}
