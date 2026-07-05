import type { ReactNode } from 'react';

export interface ShellSideNavBrand {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  href?: string;
}

export interface ShellSideNavItem {
  key: string;
  href: string;
  label: string;
  icon?: ReactNode;
  isSelected?: boolean;
}

export interface ShellSideNavGroup {
  label?: string;
  items: ShellSideNavItem[];
}

export interface ShellSideNavUserMenu {
  userName?: string;
  email?: string;
  logoutLabel?: string;
  onLogout?: () => void | Promise<void>;
}

export interface ShellSideNavBreadcrumb {
  label: ReactNode;
  description?: ReactNode;
  href?: string;
}
