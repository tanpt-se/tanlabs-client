import { useLocale } from '@tanlabs/providers';

import { DashboardHome } from '@/features/dashboard';
import { getClientLang } from '@/shared/i18n';

export function DashboardPage() {
  const { locale } = useLocale();
  const lang = getClientLang(locale);

  return <DashboardHome lang={lang.dashboard} />;
}
