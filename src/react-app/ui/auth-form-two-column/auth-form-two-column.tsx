'use client';

import type { ReactNode } from 'react';

import { AspectRatio } from '@astryxdesign/core/AspectRatio';
import { Grid } from '@astryxdesign/core/Grid';
import { VStack } from '@astryxdesign/core/Layout';
import { Section } from '@astryxdesign/core/Section';
import { Text } from '@astryxdesign/core/Text';

import {
  AUTH_FORM_HERO_IMAGE_URL,
  authFormHeroImageStyle,
} from './auth-form-two-column.styles';

export function AuthFormTwoColumn({
  children,
  heroDescription,
  imageAlt,
  imageUrl = AUTH_FORM_HERO_IMAGE_URL,
}: {
  children: ReactNode;
  heroDescription: string;
  imageAlt: string;
  imageUrl?: string;
}) {
  return (
    <Section width="100%" padding={0} variant="transparent">
      <Grid columns={{ minWidth: 320, max: 2, repeat: 'fit' }} align="center" gap={10} width="100%">
        <VStack gap={6} hAlign="stretch" width="100%">
          <VStack gap={3} hAlign="stretch">
            <Text type="body" color="secondary">
              {heroDescription}
            </Text>
          </VStack>
          <AspectRatio ratio={4 / 3}>
            <img src={imageUrl} alt={imageAlt} style={authFormHeroImageStyle} />
          </AspectRatio>
        </VStack>
        {children}
      </Grid>
    </Section>
  );
}
