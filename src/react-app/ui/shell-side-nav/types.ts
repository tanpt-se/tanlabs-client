import type { ReactNode } from 'react';

export interface ShellSideNavBrand {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  href?: string;
}

export interface ShellSideNavItem {
  key: string;
  href?: string;
  label: string;
  icon?: ReactNode;
  isSelected?: boolean;
  collapsible?: boolean | { defaultIsCollapsed?: boolean };
  children?: ShellSideNavItem[];
}

export interface ShellSideNavGroup {
  label?: string;
  items: ShellSideNavItem[];
}

export interface ShellSideNavBreadcrumb {
  label: ReactNode;
  description?: ReactNode;
  href?: string;
}
