'use client';

import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Grid } from '@astryxdesign/core/Grid';
import { VStack } from '@astryxdesign/core/Layout';
import { Link } from '@astryxdesign/core/Link';
import { Section } from '@astryxdesign/core/Section';
import { Heading, Text } from '@astryxdesign/core/Text';

import type { ClientLang } from '@/shared/i18n';
import { CLIENT_AUTH_ROUTES } from '@/shared/routing';

const HIGHLIGHT_KEYS = ['retail', 'brand', 'distribution'] as const;

export function PartnershipPage({ lang }: { lang: ClientLang['partnership'] }) {
  return (
    <Section width="100%" padding={0} variant="transparent">
      <VStack gap={8} hAlign="stretch" width="100%">
        <Text type="body" color="secondary">
          {lang.body}
        </Text>

        <Grid columns={{ minWidth: 220, max: 3 }} gap={4}>
          {HIGHLIGHT_KEYS.map((key) => (
            <Card key={key} padding={4} width="100%">
              <VStack gap={2} hAlign="stretch">
                <Heading level={3}>{lang.highlights[key].title}</Heading>
                <Text type="supporting" color="secondary">
                  {lang.highlights[key].description}
                </Text>
              </VStack>
            </Card>
          ))}
        </Grid>

        <Card padding={4} width="100%">
          <VStack gap={3} hAlign="stretch">
            <Heading level={3}>{lang.contactTitle}</Heading>
            <Text type="body" color="secondary">
              {lang.contactDescription}
            </Text>
            <Link href={`mailto:${lang.contactEmail}`} isStandalone>
              {lang.contactEmail}
            </Link>
          </VStack>
        </Card>

        <Button label={lang.cta} variant="primary" href={CLIENT_AUTH_ROUTES.about} />
      </VStack>
    </Section>
  );
}
