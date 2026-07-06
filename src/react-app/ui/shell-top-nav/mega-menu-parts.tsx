'use client';

import { Grid } from '@astryxdesign/core/Grid';
import { Icon } from '@astryxdesign/core/Icon';
import type { IconType } from '@astryxdesign/core/Icon';
import { Stack } from '@astryxdesign/core/Stack';
import {
  TopNavMegaMenuFeaturedCard,
  TopNavMegaMenuItem,
} from '@astryxdesign/core/TopNav';

import {
  shellTopNavMegaFeaturedStyle,
  shellTopNavMegaItemsStyle,
} from './shell-top-nav.styles';

export interface ShellTopNavMegaMenuItemData {
  key: string;
  title: string;
  description?: string;
  href: string;
  icon?: IconType;
}

export function ShellTopNavMegaItems({ items }: { items: ShellTopNavMegaMenuItemData[] }) {
  return (
    <Stack style={shellTopNavMegaItemsStyle}>
      <Grid columns={2} gap={2}>
        {items.map((item) => (
          <TopNavMegaMenuItem
            key={item.key}
            title={item.title}
            description={item.description}
            href={item.href}
            icon={
              item.icon ? <Icon icon={item.icon} size="md" color="secondary" /> : undefined
            }
          />
        ))}
      </Grid>
    </Stack>
  );
}

export function ShellTopNavMegaFeatured(props: {
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  linkLabel?: string;
  linkHref?: string;
}) {
  return (
    <Stack style={shellTopNavMegaFeaturedStyle}>
      <TopNavMegaMenuFeaturedCard {...props} />
    </Stack>
  );
}
