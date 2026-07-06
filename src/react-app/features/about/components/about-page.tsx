'use client';

import { AboutContact } from '@/ui/about-contact';

import type { ClientLang } from '@/shared/i18n';

export function AboutPage({ lang }: { lang: ClientLang['about'] }) {
  return <AboutContact lang={lang} />;
}
