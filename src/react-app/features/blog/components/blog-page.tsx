'use client';

import { BlogLibrary } from '@/ui/blog-library';
import { useBlogCategories, useBlogPostsList } from '@/features/blog/hooks/use-blog-data';

import type { ClientLang } from '@/shared/i18n';

export function BlogPage({ lang }: { lang: ClientLang['blog'] }) {
  const postsQuery = useBlogPostsList();
  const categoriesQuery = useBlogCategories();

  const loading = postsQuery.loading || categoriesQuery.loading;
  const error = postsQuery.error ?? categoriesQuery.error;

  return (
    <BlogLibrary
      lang={lang}
      posts={postsQuery.data}
      categories={categoriesQuery.data}
      loading={loading}
      error={error}
    />
  );
}
