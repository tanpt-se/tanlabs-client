import type { AppBreadcrumbItem } from '@/lib/astryx/app-breadcrumbs';

export type DashboardPageChrome = {
  breadcrumbs: AppBreadcrumbItem[];
  back?: {
    href: string;
    label: string;
  };
};
