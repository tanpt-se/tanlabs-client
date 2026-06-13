import type { CSSProperties, ReactNode } from 'react';

import { Button } from './button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './card';
import { TypographyP as Body, TypographyH3 as MetricValue } from './typography';

export type DashboardOverviewStat = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
};

export type DashboardOverviewAction = {
  key: string;
  variant?: 'outline';
  asChildElement: ReactNode;
};

export function DashboardOverview({
  stats,
  title,
  description,
  actions,
}: {
  stats: DashboardOverviewStat[];
  title?: ReactNode;
  description: ReactNode;
  actions: DashboardOverviewAction[];
}) {
  const statToneVars = ['--chart-1', '--chart-2', '--chart-3', '--chart-4'] as const;

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {stats.map((item, index) => {
        const toneVar = statToneVars[index % statToneVars.length];
        const iconToneStyle: CSSProperties = {
          color: `var(${toneVar})`,
          backgroundColor: `color-mix(in oklch, var(${toneVar}) 14%, transparent)`,
        };
        const formattedValue =
          typeof item.value === 'number' ? item.value.toLocaleString('en-US') : item.value;

        return (
          <Card key={item.label} className="border-border/70 bg-card/90 gap-1 shadow-xs">
            <CardHeader className="pb-0">
              <CardTitle className="text-foreground text-base font-semibold">
                {item.label}
              </CardTitle>
              <CardAction>
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-2xl ring-1 ring-black/5"
                  style={iconToneStyle}
                >
                  {item.icon}
                </div>
              </CardAction>
            </CardHeader>
            <CardContent className="pt-0">
              <MetricValue as="p" className="border-none pb-0 text-4xl leading-none tracking-tight">
                {formattedValue}
              </MetricValue>
            </CardContent>
          </Card>
        );
      })}

      <Card className="border-border/70 lg:col-span-4">
        <CardContent className="p-8">
          {title ? <CardTitle className="text-foreground text-lg">{title}</CardTitle> : null}
          <Body className={title ? 'mt-2 max-w-xl' : 'max-w-xl'}>{description}</Body>
          <div className="mt-8 flex flex-wrap gap-4">
            {actions.map((action) => (
              <Button key={action.key} asChild variant={action.variant}>
                {action.asChildElement}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
