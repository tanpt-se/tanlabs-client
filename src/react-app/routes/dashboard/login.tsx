import { useSearchParams } from 'react-router-dom';
import { useLocale } from '@tanlabs/providers';

import { ShopLoginForm } from '@/features/auth/components/shop-login-form';
import { resolveLoginNotice } from '@/features/auth/lib/login-notices';
import { getClientLang } from '@/shared/i18n';
import { LOGIN_NEXT_QUERY_PARAM, LOGIN_REASON_QUERY_PARAM, resolveAuthenticatedRedirect } from '@/shared/routing';
import { consumeAuthReturnPath } from '@/shared/routing/login-url';

export function LoginRoute() {
  const { locale } = useLocale();
  const lang = getClientLang(locale);
  const [searchParams] = useSearchParams();
  const nextPath = resolveAuthenticatedRedirect(
    searchParams.get(LOGIN_NEXT_QUERY_PARAM) ?? consumeAuthReturnPath() ?? undefined,
  );
  const reason = searchParams.get(LOGIN_REASON_QUERY_PARAM) ?? searchParams.get('reason') ?? undefined;
  const notice = resolveLoginNotice(reason, lang.login);

  return <ShopLoginForm key={locale} lang={lang.login} nextPath={nextPath} notice={notice} />;
}
