import { useLocale } from '@tanlabs/providers';

import { AboutPage } from '@/features/about';
import { getClientLang } from '@/shared/i18n';

export function AboutRoute() {
  const { locale } = useLocale();
  const lang = getClientLang(locale);

  return <AboutPage lang={lang.about} />;
}
