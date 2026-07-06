'use client';

import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Center } from '@astryxdesign/core/Center';
import { Grid } from '@astryxdesign/core/Grid';
import { HStack, VStack } from '@astryxdesign/core/Layout';
import { Section } from '@astryxdesign/core/Section';
import { Heading, Text } from '@astryxdesign/core/Text';

import type { BlogBlock } from '../types/blog.api';

function asBlocks(value: unknown): BlogBlock[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is BlogBlock => {
    return (
      typeof item === 'object' &&
      item !== null &&
      'type' in item &&
      'props' in item
    );
  });
}

function BlockPreview({ block }: { block: BlogBlock }) {
  const props = block.props;

  switch (block.type) {
    case 'hero':
      return (
        <Section variant="transparent" padding={6}>
          <VStack gap={2} hAlign="stretch">
            <Heading level={1}>{(props.heading as string) || 'Hero heading'}</Heading>
            <Text type="body" color="secondary">
              {(props.subheading as string) || ''}
            </Text>
            {(props.buttonLabel as string) ? (
              <Button label={props.buttonLabel as string} variant="primary" />
            ) : null}
          </VStack>
        </Section>
      );
    case 'text':
      return (
        <Section variant="transparent" padding={4}>
          <Text type="body">{(props.content as string) || ''}</Text>
        </Section>
      );
    case 'image':
      return (
        <Section variant="transparent" padding={4}>
          {(props.src as string) ? (
            <img
              src={props.src as string}
              alt={(props.alt as string) || ''}
              style={{ width: '100%', borderRadius: 12 }}
            />
          ) : (
            <Center>
              <Text type="supporting" color="secondary">
                Image
              </Text>
            </Center>
          )}
        </Section>
      );
    case 'button':
      return (
        <Section variant="transparent" padding={4}>
          <Button label={(props.label as string) || 'Button'} variant="primary" />
        </Section>
      );
    case 'cards':
      return (
        <Section variant="transparent" padding={4}>
          <Grid columns={{ minWidth: 200, max: 3 }} gap={3}>
            {Array.isArray(props.items)
              ? (props.items as Array<{ title?: string; description?: string }>).map((item, index) => (
                  <Card key={index} padding={4}>
                    <VStack gap={1}>
                      <Text type="label" weight="semibold">
                        {item.title || 'Card'}
                      </Text>
                      <Text type="supporting" color="secondary">
                        {item.description || ''}
                      </Text>
                    </VStack>
                  </Card>
                ))
              : null}
          </Grid>
        </Section>
      );
    case 'features':
      return (
        <Section variant="transparent" padding={4}>
          <VStack gap={3}>
            <Heading level={3}>{(props.heading as string) || 'Features'}</Heading>
            {Array.isArray(props.items)
              ? (props.items as Array<{ title?: string; description?: string }>).map((item, index) => (
                  <HStack key={index} gap={3} vAlign="start">
                    <VStack gap={0}>
                      <Text type="label" weight="semibold">
                        {item.title || 'Feature'}
                      </Text>
                      <Text type="supporting" color="secondary">
                        {item.description || ''}
                      </Text>
                    </VStack>
                  </HStack>
                ))
              : null}
          </VStack>
        </Section>
      );
    case 'cta':
      return (
        <Card padding={6}>
          <VStack gap={2}>
            <Heading level={3}>{(props.heading as string) || 'Call to action'}</Heading>
            <Text type="body" color="secondary">
              {(props.description as string) || ''}
            </Text>
            {(props.buttonLabel as string) ? (
              <Button label={props.buttonLabel as string} variant="primary" />
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
