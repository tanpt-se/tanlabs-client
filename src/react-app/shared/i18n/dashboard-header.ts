export interface DashboardHeaderText {
  breadcrumb: string;
  title: string;
  description: string;
  fallbackUser: string;
  logout: string;
}

interface DashboardHeaderLang {
  dashboard: { breadcrumb: string; title?: string; description: string };
  shell: { fallbackUser: string; logout: string };
}

export function buildDashboardHeaderText(lang: DashboardHeaderLang): DashboardHeaderText {
  return {
    breadcrumb: lang.dashboard.breadcrumb,
    title: lang.dashboard.title ?? lang.dashboard.breadcrumb,
    description: lang.dashboard.description,
    fallbackUser: lang.shell.fallbackUser,
    logout: lang.shell.logout,
  };
}
