'use client';

import { useState } from 'react';

import { AspectRatio } from '@astryxdesign/core/AspectRatio';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Divider } from '@astryxdesign/core/Divider';
import { Grid } from '@astryxdesign/core/Grid';
import { HStack, VStack } from '@astryxdesign/core/Layout';
import { Link } from '@astryxdesign/core/Link';
import { Section } from '@astryxdesign/core/Section';
import { Text, Heading } from '@astryxdesign/core/Text';
import { TextArea } from '@astryxdesign/core/TextArea';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Token } from '@astryxdesign/core/Token';
import { useToast } from '@tanlabs/astryx';

import type { ClientLang } from '@/shared/i18n';

import {
  ABOUT_CONTACT_IMAGE_URL,
  aboutContactIllustrationStyle,
} from './about-contact.styles';

const INQUIRY_KEYS = ['orders', 'products', 'returns', 'partnerships', 'other'] as const;

type InquiryKey = (typeof INQUIRY_KEYS)[number];

export function AboutContact({ lang }: { lang: ClientLang['about'] }) {
  const { pushToast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryReason, setInquiryReason] = useState<InquiryKey | ''>('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const errors = submitted
    ? {
        fullName: !fullName.trim() ? lang.form.required : undefined,
        email: !email.trim() ? lang.form.required : undefined,
        details: !details.trim() ? lang.form.required : undefined,
      }
    : {};

  const handleSubmit = () => {
    setSubmitted(true);
    if (!fullName.trim() || !email.trim() || !details.trim()) {
      return;
    }

    pushToast({
      title: lang.form.successTitle,
      description: lang.form.successDescription,
      tone: 'success',
    });
    setFullName('');
    setEmail('');
    setPhone('');
    setInquiryReason('');
    setDetails('');
    setSubmitted(false);
  };

  return (
    <Section width="100%" padding={0} variant="transparent">
      <VStack gap={10} hAlign="stretch" width="100%">
        <Grid columns={{ minWidth: 320, max: 2, repeat: 'fit' }} gap={10} width="100%">
          <VStack gap={6} hAlign="stretch" width="100%">
            <VStack gap={3} hAlign="stretch">
              <Text type="body" color="secondary">
                {lang.heroDescription}
              </Text>
            </VStack>

            <AspectRatio ratio={4 / 3}>
              <img
                src={ABOUT_CONTACT_IMAGE_URL}
                alt={lang.imageAlt}
                style={aboutContactIllustrationStyle}
              />
            </AspectRatio>

            <VStack gap={3} hAlign="stretch">
              <Heading level={3}>{lang.contactInfoTitle}</Heading>
              <Text type="body" color="secondary">
                {lang.contactAddress}
              </Text>
              <Text type="body" color="secondary">
                {lang.contactHours}
              </Text>
              <Link href={`tel:${lang.contactPhoneHref}`} isStandalone>
                {lang.contactPhone}
              </Link>
            </VStack>
          </VStack>

          <Card padding={8} width="100%">
            <VStack gap={4} hAlign="stretch">
              <Text type="label">{lang.form.title}</Text>
              <TextInput
                label={lang.form.fullName}
                isLabelHidden
                placeholder={`${lang.form.fullName}*`}
                value={fullName}
                onChange={setFullName}
                status={errors.fullName ? { type: 'error', message: errors.fullName } : undefined}
              />
              <Grid columns={{ minWidth: 180 }} gap={3}>
                <TextInput
                  label={lang.form.email}
                  isLabelHidden
                  placeholder={`${lang.form.email}*`}
                  value={email}
                  onChange={setEmail}
                  status={errors.email ? { type: 'error', message: errors.email } : undefined}
                />
                <TextInput
                  label={lang.form.phone}
                  isLabelHidden
                  placeholder={lang.form.phone}
                  value={phone}
                  onChange={setPhone}
                />
              </Grid>

              <VStack gap={2} hAlign="stretch">
                <Text type="label">{lang.form.inquiryLabel}</Text>
                <HStack gap={2} wrap="wrap">
                  {INQUIRY_KEYS.map((key) => (
                    <Token
                      key={key}
                      label={lang.form.inquiryOptions[key]}
                      color={inquiryReason === key ? 'blue' : 'default'}
                      onClick={() => setInquiryReason((current) => (current === key ? '' : key))}
                    />
                  ))}
                </HStack>
              </VStack>

              <TextArea
                label={lang.form.message}
                isLabelHidden
                placeholder={`${lang.form.message}*`}
                value={details}
                onChange={setDetails}
                status={errors.details ? { type: 'error', message: errors.details } : undefined}
              />

              <VStack hAlign="stretch">
                <Button label={lang.form.submit} variant="primary" onClick={handleSubmit} />
              </VStack>
            </VStack>
          </Card>
        </Grid>

        <VStack gap={6} hAlign="stretch" width="100%">
          <Divider />
          <Grid columns={{ minWidth: 200, max: 3, repeat: 'fit' }} gap={6} width="100%">
            {lang.contactChannels.map((channel) => (
              <VStack key={channel.label} gap={1} hAlign="center">
                <Text type="supporting" color="secondary">
                  {channel.label}
                </Text>
                <Link href={`mailto:${channel.email}`} isStandalone>
                  {channel.email}
                </Link>
              </VStack>
            ))}
          </Grid>
        </VStack>
      </VStack>
    </Section>
  );
}
