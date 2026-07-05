import { useLocale } from '@tanlabs/providers';

import { DashboardShell } from '@/features/dashboard';
import { RouteTransitionOutlet } from '@/ui/loading';
import { getClientLang } from '@/shared/i18n';

export function DashboardLayout() {
  const { locale } = useLocale();
  const lang = getClientLang(locale);

  return (
    <DashboardShell shell={lang.shell} lang={lang} initialAccessToken={null}>
      <RouteTransitionOutlet />
    </DashboardShell>
  );
}
