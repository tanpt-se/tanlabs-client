import type { ReactNode } from 'react';

import type { ShellTopNavMegaMenuItemData } from './mega-menu-parts';

export interface ShellTopNavBrand {
  title: string;
  icon?: ReactNode;
  href?: string;
}

export interface ShellTopNavMegaMenu {
  key: string;
  label: string;
  items: ShellTopNavMegaMenuItemData[];
  featured?: ReactNode;
}

export interface ShellTopNavItem {
  key: string;
  label: string;
  href: string;
  isSelected?: boolean;
}

export type ShellTopNavEntry =
  | { type: 'item'; item: ShellTopNavItem }
  | { type: 'mega'; menu: ShellTopNavMegaMenu };

export interface ShellTopNavBreadcrumb {
  label: ReactNode;
  description?: ReactNode;
  href?: string;
}
