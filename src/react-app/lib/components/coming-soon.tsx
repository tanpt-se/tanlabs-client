'use client';

import { type ReactNode } from 'react';

import { Card, CardContent } from './card';

interface ComingSoonProps {
  icon: ReactNode;
  title: string;
  description: string;
  comingSoonText: string;
}

export function ComingSoon({ icon, title, description, comingSoonText }: ComingSoonProps) {
  return (
    <div className="flex h-full min-h-full w-full flex-col">
      <Card className="flex w-full flex-1 flex-col">
        <CardContent className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center">
            <div className="bg-primary/10 text-primary mb-8 flex size-24 items-center justify-center rounded-2xl">
              {icon}
            </div>

            <h1 className="text-foreground mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              {title}
            </h1>
            <p className="text-muted-foreground mb-10 max-w-md text-lg leading-relaxed">
              {description}
            </p>

            <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-6 py-2 font-medium">
              <span className="bg-primary size-2 rounded-full" />
              {comingSoonText}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
