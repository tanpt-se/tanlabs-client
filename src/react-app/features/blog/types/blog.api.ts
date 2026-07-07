export interface PublicBlogCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
}

export interface PublicBlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  featuredImageUrl: string | null;
  publishedAt: string | null;
  category: { slug: string; name: string } | null;
}

export interface PublicBlogPostDetail {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: unknown[];
  featuredImageUrl: string | null;
  publishedAt: string | null;
  category: { slug: string; name: string } | null;
}

export interface PublicBlogCategoriesResponse {
  categories: PublicBlogCategory[];
}

export interface PublicBlogPostsListResponse {
  posts: PublicBlogPostSummary[];
  page: number;
  pageSize: number;
  total: number;
}

export interface PublicBlogPostDetailResponse {
  post: PublicBlogPostDetail;
}

export type BlogBlockType =
  | 'heading'
  | 'paragraph'
  | 'video'
  | 'gallery'
  | 'layout'
  | 'button'
  | 'divider'
  | 'quote'
  | 'list'
  | 'hero'
  | 'text'
  | 'image'
  | 'cards'
  | 'features'
  | 'cta';

export interface BlogBlock {
  id: string;
  type: BlogBlockType;
  label: string;
  props: Record<string, unknown>;
}
