export interface DashboardHeaderText {
  breadcrumb: string;
  title: string;
  description: string;
  fallbackUser: string;
  logout: string;
}

interface DashboardHeaderLang {
  dashboard: { breadcrumb: string; description: string };
  shell: { nav: { dashboard: string }; fallbackUser: string; logout: string };
}

export function buildDashboardHeaderText(lang: DashboardHeaderLang): DashboardHeaderText {
  return {
    breadcrumb: lang.dashboard.breadcrumb,
    title: lang.shell.nav.dashboard,
    description: lang.dashboard.description,
    fallbackUser: lang.shell.fallbackUser,
    logout: lang.shell.logout,
  };
}
