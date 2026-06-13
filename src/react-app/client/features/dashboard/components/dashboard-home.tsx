import { DashboardOverview } from '@tanlabs/components';

import type { ClientLang } from '@/shared/i18n';

export function DashboardHome({ lang }: { lang: ClientLang['dashboard'] }) {
  return (
    <DashboardOverview stats={[]} title={lang.title} description={lang.description} actions={[]} />
  );
}
