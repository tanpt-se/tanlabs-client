'use client';

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Card } from '@astryxdesign/core/Card';
import { Center } from '@astryxdesign/core/Center';
import { Divider } from '@astryxdesign/core/Divider';
import { DropdownMenu } from '@astryxdesign/core/DropdownMenu';
import { Grid } from '@astryxdesign/core/Grid';
import {
  Layout,
  LayoutContent,
  LayoutPanel,
  VStack,
} from '@astryxdesign/core/Layout';
import { RadioList, RadioListItem } from '@astryxdesign/core/RadioList';
import { Section } from '@astryxdesign/core/Section';
import { Spinner } from '@astryxdesign/core/Spinner';
import { Heading, Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';

import { BLOG_POST_IMAGE_URL } from '@/features/blog/lib/blog-data';
import type { PublicBlogCategory, PublicBlogPostSummary } from '@/features/blog/types/blog.api';
import { CLIENT_AUTH_ROUTES } from '@/shared/routing';
import type { ClientLang } from '@/shared/i18n';

import {
  blogCardThumbnailImageStyle,
  blogCardThumbnailWrapperStyle,
} from './blog-library.styles';

type SortOrder = 'newest' | 'oldest' | 'az';

type BlogPostView = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  categorySlug: string | null;
  categoryLabel: string;
  sortKey: number;
  imageUrl: string;
};

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

function BlogLibraryCard({
  post,
  readMoreLabel,
}: {
  post: BlogPostView;
  readMoreLabel: string;
}) {
  return (
    <Card padding={0} width="100%">
      <div style={blogCardThumbnailWrapperStyle}>
        <img src={post.imageUrl} alt={post.title} style={blogCardThumbnailImageStyle} />
      </div>
      <Section variant="transparent" padding={4}>
        <VStack gap={2} hAlign="stretch">
          <Text type="supporting" color="secondary">
            {[post.categoryLabel, post.date].filter(Boolean).join(' · ')}
          </Text>
          <Heading level={3}>{post.title}</Heading>
          <Text type="body" color="secondary">
            {post.excerpt}
          </Text>
          <Link to={CLIENT_AUTH_ROUTES.blogPost(post.slug)}>{readMoreLabel}</Link>
        </VStack>
      </Section>
    </Card>
  );
}

function BlogLibrarySection({
  title,
  posts,
  readMoreLabel,
}: {
  title: string;
  posts: BlogPostView[];
  readMoreLabel: string;
}) {
  return (
    <VStack gap={4} hAlign="stretch">
      <Heading level={2}>{title}</Heading>
      <Grid columns={{ minWidth: 280, max: 3 }} gap={4}>
        {posts.map((post) => (
          <BlogLibraryCard key={post.slug} post={post} readMoreLabel={readMoreLabel} />
        ))}
      </Grid>
    </VStack>
  );
}

export function BlogLibrary({
  lang,
  posts,
  categories,
  loading,
  error,
}: {
  lang: ClientLang['blog'];
  posts: PublicBlogPostSummary[];
  categories: PublicBlogCategory[];
  loading: boolean;
  error: string | null;
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const categoryLabels = useMemo(() => {
    const map = new Map<string, string>();
    for (const category of categories) {
      map.set(category.slug, category.name);
    }
    return map;
  }, [categories]);

  const postViews = useMemo<BlogPostView[]>(
    () =>
      posts.map((post) => {
        const categorySlug = post.category?.slug ?? null;
        const publishedAt = post.publishedAt;
        return {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt ?? '',
          date: formatPublishedDate(publishedAt),
          categorySlug,
          categoryLabel: post.category?.name ?? lang.filters.uncategorized,
          sortKey: publishedAt ? new Date(publishedAt).getTime() : 0,
          imageUrl: post.featuredImageUrl || BLOG_POST_IMAGE_URL,
        };
      }),
    [lang.filters.uncategorized, posts],
  );

  const filteredPosts = useMemo(() => {
    let next = postViews;

    if (activeCategory !== 'all') {
      next = next.filter((post) => post.categorySlug === activeCategory);
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      next = next.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.categoryLabel.toLowerCase().includes(query),
      );
    }

    const sorted = [...next];
    if (sortOrder === 'newest') {
      sorted.sort((a, b) => b.sortKey - a.sortKey);
    } else if (sortOrder === 'oldest') {
      sorted.sort((a, b) => a.sortKey - b.sortKey);
    } else {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    return sorted;
  }, [activeCategory, postViews, search, sortOrder]);

  const groupedSections = useMemo(() => {
    if (activeCategory !== 'all') {
      return null;
    }

    const groups = new Map<string, BlogPostView[]>();
    for (const post of filteredPosts) {
      const key = post.categorySlug ?? 'uncategorized';
      const current = groups.get(key) ?? [];
      current.push(post);
      groups.set(key, current);
    }

    return categories
      .map((category) => ({
        key: category.slug,
        title: category.name,
        posts: groups.get(category.slug) ?? [],
      }))
      .filter((section) => section.posts.length > 0);
  }, [activeCategory, categories, filteredPosts]);

  const sortLabel =
    sortOrder === 'newest'
      ? lang.filters.sortNewest
      : sortOrder === 'oldest'
        ? lang.filters.sortOldest
        : lang.filters.sortAz;

  return (
    <Layout
      height="auto"
      style={{ width: '100%', minWidth: 0 }}
      start={
        <LayoutPanel hasDivider role="navigation" width={280} label={lang.filters.sidebarLabel}>
          <VStack gap={6} hAlign="stretch">
            <TextInput
              label={lang.filters.search}
              isLabelHidden
              placeholder={lang.filters.searchPlaceholder}
              value={search}
              onChange={setSearch}
              startIcon={MagnifyingGlassIcon}
              size="lg"
            />

            <DropdownMenu
              button={{ label: sortLabel, size: 'lg', variant: 'secondary' }}
              items={[
                { label: lang.filters.sortNewest, onClick: () => setSortOrder('newest') },
                { label: lang.filters.sortOldest, onClick: () => setSortOrder('oldest') },
                { label: lang.filters.sortAz, onClick: () => setSortOrder('az') },
              ]}
            />

            <RadioList
              label={lang.filters.categories}
              value={activeCategory}
              onChange={setActiveCategory}
            >
              <RadioListItem label={lang.categories.all} value="all" />
              {categories.map((category) => (
                <RadioListItem key={category.id} label={category.name} value={category.slug} />
              ))}
            </RadioList>
          </VStack>
        </LayoutPanel>
      }
      content={
        <LayoutContent padding={0}>
          <VStack gap={6} hAlign="stretch">
            {loading ? (
              <Center>
                <Spinner />
              </Center>
            ) : error ? (
              <Center>
                <Text type="supporting" color="secondary">
                  {error}
                </Text>
              </Center>
            ) : filteredPosts.length === 0 ? (
              <Center>
                <Text type="supporting" color="secondary">
                  {lang.filters.noResults}
                </Text>
              </Center>
            ) : (
              <VStack gap={6} hAlign="stretch">
                {(groupedSections ?? [
                  {
                    key: activeCategory,
                    title:
                      activeCategory === 'all'
                        ? lang.categories.all
                        : categoryLabels.get(activeCategory) ?? activeCategory,
                    posts: filteredPosts,
                  },
                ]).flatMap((section, index) => [
                  ...(index > 0 ? [<Divider key={`divider-${section.key}`} />] : []),
                  <BlogLibrarySection
                    key={section.key}
                    title={section.title}
                    posts={section.posts}
                    readMoreLabel={lang.readMore}
                  />,
                ])}
              </VStack>
            )}
          </VStack>
        </LayoutContent>
      }
    />
  );
}
