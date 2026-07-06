import { useParams } from 'react-router-dom';
import { useLocale } from '@tanlabs/providers';

import { BlogPostDetailPage } from '@/features/blog/components/blog-post-detail-page';
import { getClientLang } from '@/shared/i18n';

export function BlogPostDetailRoute() {
  const { slug = '' } = useParams();
  const { locale } = useLocale();
  const lang = getClientLang(locale);

  return <BlogPostDetailPage lang={lang.blog} slug={slug} />;
}
