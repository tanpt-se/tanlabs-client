'use client';

import {
  ChartBarIcon,
  ShoppingBagIcon,
  SparklesIcon,
  Squares2X2Icon,
  SwatchIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

import { ShellTopNavMegaFeatured } from '@/ui/shell-top-nav';
import type { ShellTopNavEntry } from '@/ui/shell-top-nav';

import type { ClientLang } from '@/shared/i18n';
import { CLIENT_AUTH_ROUTES } from '@/shared/routing';

export function buildDashboardShellNavigation(params: {
  pathname: string;
  shell: ClientLang['shell'];
}): ShellTopNavEntry[] {
  const { pathname, shell } = params;
  const shopMenu = shell.nav.shopMenu;
  const shopHref = CLIENT_AUTH_ROUTES.dashboard;

  return [
    {
      type: 'mega',
      menu: {
        key: 'shop',
        label: shell.nav.shop,
        featured: (
          <ShellTopNavMegaFeatured
            title={shopMenu.featuredTitle}
            description={shopMenu.featuredDescription}
            linkHref={shopHref}
            linkLabel={shopMenu.featuredAction}
          />
        ),
        items: [
          {
            key: 'shop-all-products',
            href: shopHref,
            title: shopMenu.allProducts,
            description: shopMenu.allProductsDescription,
            icon: ShoppingBagIcon,
          },
          {
            key: 'shop-categories',
            href: shopHref,
            title: shopMenu.categories,
            description: shopMenu.categoriesDescription,
            icon: Squares2X2Icon,
          },
          {
            key: 'shop-collections',
            href: shopHref,
            title: shopMenu.collections,
            description: shopMenu.collectionsDescription,
            icon: SwatchIcon,
          },
          {
            key: 'shop-new-arrivals',
            href: shopHref,
            title: shopMenu.newArrivals,
            description: shopMenu.newArrivalsDescription,
            icon: SparklesIcon,
          },
          {
            key: 'shop-best-sellers',
            href: shopHref,
            title: shopMenu.bestSellers,
            description: shopMenu.bestSellersDescription,
            icon: ChartBarIcon,
          },
          {
            key: 'shop-sale',
            href: shopHref,
            title: shopMenu.sale,
            description: shopMenu.saleDescription,
            icon: TagIcon,
          },
        ],
      },
    },
    {
      type: 'item',
      item: {
        key: 'blog',
        href: CLIENT_AUTH_ROUTES.blog,
        label: shell.nav.blog,
        isSelected: pathname === CLIENT_AUTH_ROUTES.blog,
      },
    },
    {
      type: 'item',
      item: {
        key: 'about',
        href: CLIENT_AUTH_ROUTES.about,
        label: shell.nav.about,
        isSelected: pathname === CLIENT_AUTH_ROUTES.about,
      },
    },
    {
      type: 'item',
      item: {
        key: 'partnership',
        href: CLIENT_AUTH_ROUTES.partnership,
        label: shell.nav.partnership,
        isSelected: pathname === CLIENT_AUTH_ROUTES.partnership,
      },
    },
  ];
}
