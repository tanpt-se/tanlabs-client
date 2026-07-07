'use client';

import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Grid } from '@astryxdesign/core/Grid';
import { HStack, VStack } from '@astryxdesign/core/Layout';
import { Section } from '@astryxdesign/core/Section';
import { Heading, Text } from '@astryxdesign/core/Text';

import {
  alignStyle,
  aspectRatioStyle,
  blockSpacingPx,
  dividerWidthPercent,
  GAP_PX,
  getVideoEmbed,
  headingLevel,
  IMAGE_WIDTH_PERCENT,
  layoutAlignItems,
  layoutJustifyContent,
  parseGalleryItems,
  parseLayoutColumns,
  type AspectRatio,
  type BlockGap,
  type GalleryCaptionPosition,
  type ImageFit,
  type ImageWidth,
  type LayoutDirection,
  type NestedBlock,
  type TextSize,
} from '../lib/blog-block-utils';
import { resolveMediaUrl } from '../lib/resolve-media-url';
import type { BlogBlock } from '../types/blog.api';

function asBlocks(value: unknown): BlogBlock[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index) => {
      if (typeof item !== 'object' || item === null || !('type' in item) || !('props' in item)) {
        return null;
      }
      const record = item as Record<string, unknown>;
      return {
        id: typeof record.id === 'string' ? record.id : `block-${index}`,
        type: record.type as BlogBlock['type'],
        label: typeof record.label === 'string' ? record.label : String(record.type),
        props: (record.props as Record<string, unknown>) ?? {},
      };
    })
    .filter((block): block is BlogBlock => block !== null);
}

function cardItems(props: Record<string, unknown>) {
  const raw = Array.isArray(props.cards)
    ? props.cards
    : Array.isArray(props.items)
      ? props.items
      : [];
  return raw as Array<{ title?: string; description?: string; name?: string }>;
}

function renderImage(
  props: Record<string, unknown>,
  options?: { showCaption?: boolean },
) {
  const src = resolveMediaUrl(props.src as string | undefined);
  if (!src) return null;
  const width = IMAGE_WIDTH_PERCENT[(props.width as ImageWidth) ?? 'full'];
  const align = alignStyle(props.align);
  const linkUrl = (props.linkUrl as string | undefined)?.trim();
  const img = (
    <img
      src={src}
      alt={(props.alt as string) || ''}
      style={{
        width,
        maxWidth: '100%',
        marginInline: align === 'center' ? 'auto' : undefined,
        marginLeft: align === 'right' ? 'auto' : undefined,
        display: 'block',
        borderRadius: props.rounded === false ? 0 : 12,
        objectFit: (props.objectFit as ImageFit) ?? 'cover',
      }}
    />
  );

  return (
    <>
      {linkUrl ? (
        <a href={linkUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
          {img}
        </a>
      ) : (
        img
      )}
      {options?.showCaption !== false && (props.caption as string) ? (
        <Text type="supporting" color="secondary" style={{ textAlign: align }}>
          {props.caption as string}
        </Text>
      ) : null}
    </>
  );
}

function NestedBlockView({ block }: { block: NestedBlock }) {
  const props = block.props;

  switch (block.type) {
    case 'heading':
      return (
        <Heading
          level={headingLevel(props.level)}
          style={{
            textAlign: alignStyle(props.align),
            marginBlock: blockSpacingPx(props.spacing),
          }}
        >
          {(props.text as string) || ''}
        </Heading>
      );
    case 'paragraph':
      return (
        <Text
          type={(props.size as TextSize) === 'lead' ? 'body' : 'body'}
          style={{
            whiteSpace: 'pre-wrap',
            textAlign: alignStyle(props.align),
            fontSize: (props.size as TextSize) === 'lead' ? '1.125rem' : undefined,
            lineHeight: (props.size as TextSize) === 'lead' ? 1.7 : undefined,
          }}
        >
          {(props.content as string) || ''}
        </Text>
      );
    case 'image':
      return renderImage(props, { showCaption: false });
    case 'video': {
      const embed = getVideoEmbed((props.url as string) || '');
      if (!embed) return null;
      const ratio = aspectRatioStyle((props.aspectRatio as AspectRatio) ?? '16:9') ?? '16 / 9';
      const align = alignStyle(props.align);
      const media =
        embed.kind === 'iframe' ? (
          <iframe
            src={embed.src}
            title="Video"
            style={{ width: '100%', aspectRatio: ratio, border: 0, borderRadius: 12 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video src={embed.src} controls style={{ width: '100%', borderRadius: 12 }} />
        );
      return (
        <div style={{ textAlign: align }}>
          <div style={{ display: 'inline-block', width: '100%', maxWidth: '100%' }}>{media}</div>
        </div>
      );
    }
    case 'button':
      return (
        <ButtonBlock
          label={(props.label as string) || 'Button'}
          url={props.url as string | undefined}
          variant={(props.variant as 'primary' | 'secondary' | 'ghost') ?? 'primary'}
          size={(props.size as 'sm' | 'md' | 'lg') ?? 'md'}
          align={props.align as string | undefined}
          openInNewTab={props.openInNewTab as boolean | undefined}
        />
      );
    default:
      return null;
  }
}

function ButtonBlock({
  label,
  url,
  variant,
  size,
  align,
  openInNewTab,
}: {
  label: string;
  url?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  align?: string;
  openInNewTab?: boolean;
}) {
  const button = (
    <Button label={label || 'Button'} variant={variant ?? 'primary'} size={size ?? 'md'} />
  );
  const style = { textAlign: alignStyle(align) as 'left' | 'center' | 'right', width: '100%' as const };

  if (!url?.trim()) {
    return <div style={style}>{button}</div>;
  }

  return (
    <div style={style}>
      <a
        href={url}
        target={openInNewTab !== false ? '_blank' : undefined}
        rel={openInNewTab !== false ? 'noopener noreferrer' : undefined}
        style={{ textDecoration: 'none', display: 'inline-block' }}
      >
        {button}
      </a>
    </div>
  );
}

function BlockPreview({ block }: { block: BlogBlock }) {
  const props = block.props;

  switch (block.type) {
    case 'heading':
      return (
        <Section variant="transparent" padding={2}>
          <Heading
            level={headingLevel(props.level)}
            style={{
              textAlign: alignStyle(props.align),
              marginBlock: blockSpacingPx(props.spacing),
            }}
          >
            {(props.text as string) || ''}
          </Heading>
        </Section>
      );
    case 'paragraph':
      return (
        <Section variant="transparent" padding={2}>
          <Text
            type="body"
            style={{
              whiteSpace: 'pre-wrap',
              textAlign: alignStyle(props.align),
              fontSize: (props.size as TextSize) === 'lead' ? '1.125rem' : undefined,
              lineHeight: (props.size as TextSize) === 'lead' ? 1.7 : undefined,
            }}
          >
            {(props.content as string) || ''}
          </Text>
        </Section>
      );
    case 'gallery': {
      const items = parseGalleryItems(props.items);
      if (items.length === 0) return null;
      const columns = Math.min(4, Math.max(2, Number(props.columns ?? 3)));
      const gap = GAP_PX[(props.gap as BlockGap) ?? 'md'];
      const ratio = aspectRatioStyle((props.aspectRatio as AspectRatio) ?? '4:3');
      const captionPosition = (props.captionPosition as GalleryCaptionPosition) ?? 'below';
      const rounded = props.rounded !== false;

      return (
        <Section variant="transparent" padding={4}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gap,
            }}
          >
            {items.map((item) => {
              const src = resolveMediaUrl(item.src);
              if (!src) return null;
              return (
                <figure key={item.id} style={{ margin: 0, position: 'relative' }}>
                  <img
                    src={src}
                    alt={item.alt ?? ''}
                    style={{
                      width: '100%',
                      display: 'block',
                      borderRadius: rounded ? 12 : 0,
                      aspectRatio: ratio,
                      objectFit: 'cover',
                    }}
                  />
                  {item.caption && captionPosition === 'below' ? (
                    <figcaption>
                      <Text type="supporting" color="secondary">
                        {item.caption}
                      </Text>
                    </figcaption>
                  ) : null}
                  {item.caption && captionPosition === 'overlay' ? (
                    <Text
                      type="supporting"
                      style={{
                        position: 'absolute',
                        left: 8,
                        right: 8,
                        bottom: 8,
                        color: 'white',
                        background: 'rgba(0,0,0,0.55)',
                        borderRadius: 8,
                        padding: '4px 8px',
                      }}
                    >
                      {item.caption}
                    </Text>
                  ) : null}
                </figure>
              );
            })}
          </div>
        </Section>
      );
    }
    case 'layout': {
      const columns = parseLayoutColumns(props.columns);
      if (columns.length === 0) return null;
      const direction = (props.direction as LayoutDirection) ?? 'row';
      const gap = GAP_PX[(props.gap as BlockGap) ?? 'md'];
      const alignItems = layoutAlignItems(props.valign);
      const justifyContent = layoutJustifyContent(props.halign);

      if (direction === 'col') {
        return (
          <Section variant="transparent" padding={2}>
            <VStack gap={gap / 8} hAlign="stretch">
              {columns.map((column) => (
                <VStack key={column.id} gap={2} hAlign="stretch">
                  {column.blocks.map((child) => (
                    <NestedBlockView key={child.id} block={child} />
                  ))}
                </VStack>
              ))}
            </VStack>
          </Section>
        );
      }

      return (
        <Section variant="transparent" padding={2}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
              gap,
              alignItems,
              justifyContent,
            }}
          >
            {columns.map((column) => (
              <div key={column.id} style={{ gridColumn: `span ${column.span}`, minWidth: 0 }}>
                <VStack gap={2} hAlign="stretch">
                  {column.blocks.map((child) => (
                    <NestedBlockView key={child.id} block={child} />
                  ))}
                </VStack>
              </div>
            ))}
          </div>
        </Section>
      );
    }
    case 'hero':
      return (
        <Section variant="transparent" padding={4}>
          <VStack gap={2}>
            {(props.heading as string) ? <Heading level={1}>{props.heading as string}</Heading> : null}
            {(props.subheading as string) ? (
              <Text type="body" color="secondary">
                {props.subheading as string}
              </Text>
            ) : null}
            {(props.buttonLabel as string) ? (
              <ButtonBlock
                label={props.buttonLabel as string}
                url={(props.buttonUrl as string) || '#'}
                variant="primary"
                align={(props.alignment as string) ?? 'left'}
              />
            ) : null}
          </VStack>
        </Section>
      );
    case 'button':
      return (
        <Section variant="transparent" padding={4}>
          <ButtonBlock
            label={(props.label as string) || 'Button'}
            url={props.url as string | undefined}
            variant={(props.variant as 'primary' | 'secondary' | 'ghost') ?? 'primary'}
            size={(props.size as 'sm' | 'md' | 'lg') ?? 'md'}
            align={props.align as string | undefined}
            openInNewTab={props.openInNewTab as boolean | undefined}
          />
        </Section>
      );
    case 'divider': {
      const spacing = blockSpacingPx(props.spacing);
      const lineWidth = dividerWidthPercent(props.width);
      const align = alignStyle(props.align);
      return (
        <Section variant="transparent" padding={2}>
          <div style={{ textAlign: align }}>
            <hr
              style={{
                width: lineWidth,
                margin: `${spacing}px auto`,
                marginLeft: align === 'left' ? 0 : undefined,
                marginRight: align === 'right' ? 0 : undefined,
                border: 'none',
                borderTop: `1px ${props.style === 'dashed' ? 'dashed' : 'solid'} var(--color-border-muted, #ccc)`,
              }}
            />
          </div>
        </Section>
      );
    }
    case 'quote':
      return (
        <Section variant="transparent" padding={4}>
          <blockquote
            style={{
              margin: 0,
              paddingLeft: 16,
              borderLeft: '4px solid var(--color-border-muted, #ccc)',
              textAlign: alignStyle(props.align),
            }}
          >
            <Text type="body" style={{ fontStyle: 'italic' }}>
              {(props.content as string) || ''}
            </Text>
            {(props.cite as string) ? (
              <Text type="supporting" color="secondary">
                — {props.cite as string}
              </Text>
            ) : null}
          </blockquote>
        </Section>
      );
    case 'list': {
      const items = Array.isArray(props.items) ? (props.items as string[]) : [];
      if (items.length === 0) return null;
      const Tag = props.ordered ? 'ol' : 'ul';
      const itemGap = blockSpacingPx(props.spacing) / 2;
      return (
        <Section variant="transparent" padding={2}>
          <Tag style={{ margin: 0, paddingLeft: 24 }}>
            {items.map((item, index) => (
              <li key={index} style={{ marginBottom: index < items.length - 1 ? itemGap : 0 }}>
                <Text type="body">{item}</Text>
              </li>
            ))}
          </Tag>
        </Section>
      );
    }
    case 'text': {
      const content = (props.content as string) || (props.description as string) || '';
      const heading = props.heading as string | undefined;
      return (
        <Section variant="transparent" padding={2}>
          <VStack gap={2}>
            {heading ? <Heading level={2}>{heading}</Heading> : null}
            {content ? (
              <Text type="body" style={{ whiteSpace: 'pre-wrap' }}>
                {content}
              </Text>
            ) : null}
          </VStack>
        </Section>
      );
    }
    case 'image':
      return (
        <Section variant="transparent" padding={4}>
          <VStack gap={2} hAlign="stretch">
            {renderImage(props)}
          </VStack>
        </Section>
      );
    case 'video': {
      const embed = getVideoEmbed((props.url as string) || '');
      if (!embed) return null;
      const ratio = aspectRatioStyle((props.aspectRatio as AspectRatio) ?? '16:9') ?? '16 / 9';
      const align = alignStyle(props.align);
      return (
        <Section variant="transparent" padding={4}>
          <VStack gap={2}>
            <div style={{ textAlign: align }}>
              {embed.kind === 'iframe' ? (
                <iframe
                  src={embed.src}
                  title={(props.caption as string) || 'Video'}
                  style={{ width: '100%', aspectRatio: ratio, border: 0, borderRadius: 12 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={embed.src} controls style={{ width: '100%', borderRadius: 12 }} />
              )}
            </div>
            {(props.caption as string) ? (
              <Text type="supporting" color="secondary">
                {props.caption as string}
              </Text>
            ) : null}
          </VStack>
        </Section>
      );
    }
    case 'cards':
      return (
        <Section variant="transparent" padding={4}>
          <Grid columns={{ minWidth: 200, max: 3 }} gap={3}>
            {cardItems(props).map((item, index) => (
              <Card key={index} padding={4}>
                <VStack gap={1}>
                  <Text type="label" weight="semibold">
                    {item.title || item.name || 'Card'}
                  </Text>
                  <Text type="supporting" color="secondary">
                    {item.description || ''}
                  </Text>
                </VStack>
              </Card>
            ))}
          </Grid>
        </Section>
      );
    case 'features':
      return (
        <Section variant="transparent" padding={4}>
          <VStack gap={3}>
            <Heading level={3}>{(props.heading as string) || 'Features'}</Heading>
            {cardItems(props).map((item, index) => (
              <HStack key={index} gap={3} vAlign="start">
                <VStack gap={0}>
                  <Text type="label" weight="semibold">
                    {item.title || item.name || 'Feature'}
                  </Text>
                  <Text type="supporting" color="secondary">
                    {item.description || ''}
                  </Text>
                </VStack>
              </HStack>
            ))}
          </VStack>
        </Section>
      );
    case 'cta':
      return (
        <Card padding={6}>
          <VStack gap={2}>
            <Heading level={3}>{(props.heading as string) || ''}</Heading>
            <Text type="body" color="secondary">
              {(props.description as string) || ''}
            </Text>
            {(props.buttonLabel as string) || (props.primaryLabel as string) ? (
              <Button
                label={(props.buttonLabel as string) || (props.primaryLabel as string) || 'Learn more'}
                variant="primary"
              />
            ) : null}
          </VStack>
        </Card>
      );
    default:
      return null;
  }
}

export function BlogContentRenderer({ body }: { body: unknown }) {
  const blocks = asBlocks(body);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <VStack gap={4} hAlign="stretch">
      {blocks.map((block) => (
        <BlockPreview key={block.id} block={block} />
      ))}
    </VStack>
  );
}
