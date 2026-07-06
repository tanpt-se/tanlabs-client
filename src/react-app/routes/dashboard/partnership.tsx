import { useLocale } from '@tanlabs/providers';

import { PartnershipPage } from '@/features/partnership';
import { getClientLang } from '@/shared/i18n';

export function PartnershipRoute() {
  const { locale } = useLocale();
  const lang = getClientLang(locale);

  return <PartnershipPage lang={lang.partnership} />;
}
