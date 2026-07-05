import type { ReactNode } from 'react';

import { Card } from '@astryxdesign/core/Card';
import { Grid } from '@astryxdesign/core/Grid';
import { VStack } from '@astryxdesign/core/Layout';
import { Text, Heading } from '@astryxdesign/core/Text';

import type { ClientLang } from '@/shared/i18n';

import { DashboardSampleChart } from './dashboard-sample-chart';

const MOCK_WEEKLY_SIGN_INS = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 19 },
  { label: 'Wed', value: 15 },
  { label: 'Thu', value: 24 },
  { label: 'Fri', value: 21 },
  { label: 'Sat', value: 9 },
  { label: 'Sun', value: 14 },
] as const;

const MOCK_MONTHLY_SESSIONS = [
  { label: 'Jan', value: 42 },
  { label: 'Feb', value: 51 },
  { label: 'Mar', value: 48 },
  { label: 'Apr', value: 63 },
  { label: 'May', value: 58 },
  { label: 'Jun', value: 71 },
] as const;

const MOCK_SUCCESS_RATE = [
  { label: 'W1', value: 96 },
  { label: 'W2', value: 94 },
  { label: 'W3', value: 98 },
  { label: 'W4', value: 97 },
  { label: 'W5', value: 99 },
  { label: 'W6', value: 95 },
] as const;

const MOCK_DEVICES = [
  { label: 'Desktop', value: 58 },
  { label: 'Mobile', value: 32 },
  { label: 'Tablet', value: 10 },
] as const;

function DashboardChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card padding={6} width="100%">
      <VStack gap={4} hAlign="stretch">
        <VStack gap={1} hAlign="stretch">
          <Heading level={3}>{title}</Heading>
          <Text type="supporting" color="secondary">
            {description}
          </Text>
        </VStack>
        {children}
      </VStack>
    </Card>
  );
}

export function DashboardHome({ lang }: { lang: ClientLang['dashboard'] }) {
  const { charts } = lang;

  return (
    <VStack gap={4} hAlign="stretch" width="100%">
      <Grid columns={{ minWidth: 360 }} gap={4}>
        <DashboardChartCard title={charts.weeklySignIns.title} description={charts.weeklySignIns.description}>
          <DashboardSampleChart
            variant="bar"
            ariaLabel={charts.weeklySignIns.ariaLabel}
            data={[...MOCK_WEEKLY_SIGN_INS]}
          />
        </DashboardChartCard>

        <DashboardChartCard title={charts.activeSessions.title} description={charts.activeSessions.description}>
          <DashboardSampleChart
            variant="line"
            ariaLabel={charts.activeSessions.ariaLabel}
            data={[...MOCK_MONTHLY_SESSIONS]}
          />
        </DashboardChartCard>

        <DashboardChartCard title={charts.successRate.title} description={charts.successRate.description}>
          <DashboardSampleChart
            variant="area"
            ariaLabel={charts.successRate.ariaLabel}
            data={[...MOCK_SUCCESS_RATE]}
          />
        </DashboardChartCard>

        <DashboardChartCard title={charts.devices.title} description={charts.devices.description}>
          <DashboardSampleChart
            variant="donut"
            ariaLabel={charts.devices.ariaLabel}
            data={[...MOCK_DEVICES]}
            height={260}
          />
        </DashboardChartCard>
      </Grid>
    </VStack>
  );
}
