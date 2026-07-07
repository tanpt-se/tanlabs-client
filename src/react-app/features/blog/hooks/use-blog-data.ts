import { useCallback, useEffect, useState } from 'react';

import { fetchAllPaginated } from '@/shared/http/fetch-all-pages';

import {
  fetchBlogCategories,
  fetchBlogPostBySlug,
  fetchBlogPostPreview,
  fetchBlogPosts,
} from '../requests/blog.requests';
import type { PublicBlogCategory, PublicBlogPostDetail, PublicBlogPostSummary } from '../types/blog.api';

interface AsyncState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useBlogCategories(): AsyncState<PublicBlogCategory[]> {
  const [data, setData] = useState<PublicBlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const reload = useCallback(() => setReloadToken((v) => v + 1), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchBlogCategories()
      .then((response) => {
        if (active) setData(response.categories);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : 'Failed to load categories.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reloadToken]);

  return { data, loading, error, reload };
}

export function useBlogPostsList(): AsyncState<PublicBlogPostSummary[]> {
  const [data, setData] = useState<PublicBlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const reload = useCallback(() => setReloadToken((v) => v + 1), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchAllPaginated(
      async (page, pageSize) => {
        const response = await fetchBlogPosts({ page, pageSize });
        return { items: response.posts, total: response.total };
      },
      50,
    )
      .then((posts) => {
        if (active) setData(posts);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : 'Failed to load posts.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reloadToken]);

  return { data, loading, error, reload };
}

export function useBlogPostDetail(
  slug: string,
  previewToken?: string | null,
): AsyncState<PublicBlogPostDetail | null> {
  const [data, setData] = useState<PublicBlogPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const reload = useCallback(() => setReloadToken((v) => v + 1), []);

  useEffect(() => {
    if (!slug) {
      setData(null);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);
    const request = previewToken
      ? fetchBlogPostPreview(slug, previewToken)
      : fetchBlogPostBySlug(slug);

    request
      .then((response) => {
        if (active) setData(response.post);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : 'Failed to load post.');
          setData(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug, previewToken, reloadToken]);

  return { data, loading, error, reload };
}
