import { CLIENT_API_ROUTES, withQuery } from '@/shared/http';
import { api } from '@/shared/http/client';

import type {
  PublicBlogCategoriesResponse,
  PublicBlogPostDetailResponse,
  PublicBlogPostsListResponse,
} from '../types/blog.api';

export function fetchBlogCategories() {
  return api.get<PublicBlogCategoriesResponse>(CLIENT_API_ROUTES.blog.categories);
}

export function fetchBlogPosts(query: {
  page?: number;
  pageSize?: number;
  search?: string;
  categorySlug?: string;
} = {}) {
  return api.get<PublicBlogPostsListResponse>(withQuery(CLIENT_API_ROUTES.blog.posts, query));
}

export function fetchBlogPostBySlug(slug: string) {
  return api.get<PublicBlogPostDetailResponse>(CLIENT_API_ROUTES.blog.post(slug));
}
