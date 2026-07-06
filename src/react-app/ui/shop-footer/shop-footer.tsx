'use client';

import { Divider } from '@astryxdesign/core/Divider';
import { Grid } from '@astryxdesign/core/Grid';
import { VStack } from '@astryxdesign/core/Layout';
import { Link } from '@astryxdesign/core/Link';
import { Heading, Text } from '@astryxdesign/core/Text';
import { useLocale } from '@tanlabs/providers';
import { BRAND } from '@tanlabs/config';

import { getClientLang } from '@/shared/i18n';
import { CLIENT_AUTH_ROUTES } from '@/shared/routing';

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <VStack gap={3} hAlign="stretch">
      <Heading level={4}>{title}</Heading>
      <VStack gap={2} hAlign="stretch">
        {links.map((link) => (
          <Link key={link.label} href={link.href} isStandalone>
            {link.label}
          </Link>
        ))}
      </VStack>
    </VStack>
  );
}

export function ShopFooter() {
  const { locale } = useLocale();
  const { footer } = getClientLang(locale);
  const year = new Date().getFullYear();

  return (
    <VStack gap={8} hAlign="stretch" width="100%" style={{ paddingTop: 24 }}>
      <Divider />
      <Grid columns={{ minWidth: 180 }} gap={8}>
        <VStack gap={2} hAlign="stretch">
          <Heading level={4}>{BRAND.webTitle}</Heading>
          <Text type="supporting" color="secondary">
            {footer.tagline}
          </Text>
        </VStack>

        <FooterLinkColumn
          title={footer.columns.shop}
          links={[
            { label: footer.links.allProducts, href: CLIENT_AUTH_ROUTES.dashboard },
            { label: footer.links.deals, href: CLIENT_AUTH_ROUTES.dashboard },
            { label: footer.links.cart, href: CLIENT_AUTH_ROUTES.cart },
          ]}
        />

        <FooterLinkColumn
          title={footer.columns.support}
          links={[
            { label: footer.links.help, href: '#' },
            { label: footer.links.contact, href: CLIENT_AUTH_ROUTES.about },
            { label: footer.links.shipping, href: '#' },
          ]}
        />

        <FooterLinkColumn
          title={footer.columns.company}
          links={[
            { label: footer.links.about, href: CLIENT_AUTH_ROUTES.about },
            { label: footer.links.careers, href: '#' },
            { label: footer.links.privacy, href: '#' },
            { label: footer.links.terms, href: '#' },
          ]}
        />
      </Grid>

      <Text type="supporting" color="secondary">
        {footer.copyright.replace('{year}', String(year))}
      </Text>
    </VStack>
  );
}
