'use client';

import { Link } from 'react-router-dom';

import { Button } from '@astryxdesign/core/Button';
import { Center } from '@astryxdesign/core/Center';
import { Spinner } from '@astryxdesign/core/Spinner';
import { VStack } from '@astryxdesign/core/Layout';
import { Heading, Text } from '@astryxdesign/core/Text';

import { useBlogPostDetail } from '@/features/blog/hooks/use-blog-data';
import { BlogContentRenderer } from '@/features/blog/components/blog-content-renderer';
import { BLOG_POST_IMAGE_URL } from '@/features/blog/lib/blog-data';
import { resolveMediaUrl } from '@/features/blog/lib/resolve-media-url';
import { CLIENT_AUTH_ROUTES } from '@/shared/routing';

import type { ClientLang } from '@/shared/i18n';

function formatPublishedDate(value: string | null) {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function BlogPostDetailPage({
  lang,
  slug,
  previewToken,
}: {
  lang: ClientLang['blog'];
  slug: string;
  previewToken?: string | null;
}) {
  const { data: post, loading, error } = useBlogPostDetail(slug, previewToken);

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (error || !post) {
    return (
      <Center>
        <VStack gap={4} hAlign="center">
          <Heading level={2}>{lang.detail.notFoundTitle}</Heading>
          <Text type="body" color="secondary">
            {lang.detail.notFoundDescription}
          </Text>
          <Link to={CLIENT_AUTH_ROUTES.blog}>
            <Button label={lang.detail.backToBlog} variant="secondary" />
          </Link>
        </VStack>
      </Center>
    );
  }

  const imageUrl = resolveMediaUrl(post.featuredImageUrl) || BLOG_POST_IMAGE_URL;
  const publishedLabel = formatPublishedDate(post.publishedAt);
  const categoryLabel = post.category?.name;

  return (
    <VStack gap={6} hAlign="stretch">
      {previewToken ? (
        <Text type="supporting" color="secondary">
          {lang.detail.previewBanner}
        </Text>
      ) : null}
      <img
        src={imageUrl}
        alt={post.title}
        style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 16 }}
      />
      <VStack gap={2} hAlign="stretch">
        <Text type="supporting" color="secondary">
          {[categoryLabel, publishedLabel].filter(Boolean).join(' · ')}
        </Text>
        <Heading level={1}>{post.title}</Heading>
        {post.excerpt ? (
          <Text type="body" color="secondary">
            {post.excerpt}
          </Text>
        ) : null}
      </VStack>
      <BlogContentRenderer body={post.body} />
    </VStack>
  );
}
