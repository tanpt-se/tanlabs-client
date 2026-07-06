import { useLocale } from '@tanlabs/providers';

import { BlogPage } from '@/features/blog';
import { getClientLang } from '@/shared/i18n';

export function BlogRoute() {
  const { locale } = useLocale();
  const lang = getClientLang(locale);

  return <BlogPage lang={lang.blog} />;
}
