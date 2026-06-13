import { useLocale } from '@tanlabs/providers';

import { MyAccountPage } from '@/features/dashboard/components/my-account-page';
import { getClientLang } from '@/shared/i18n';
import { getUser } from '@/shared/auth';

export function MyAccountRoute() {
  const { locale } = useLocale();
  const lang = getClientLang(locale);
  const user = getUser();

  return (
    <MyAccountPage
      lang={lang.myAccount}
      initialUser={user ? { id: user.id } : null}
    />
  );
}
