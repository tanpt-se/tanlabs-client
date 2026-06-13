'use client';

import * as React from 'react';

import * as LabelPrimitive from '@radix-ui/react-label';

import { cn } from './lib/cn';

type LabelProps = React.ComponentProps<typeof LabelPrimitive.Root> & {
  as?: 'label' | 'span' | 'div';
};

function Label({ className, as, ...props }: LabelProps) {
  const baseClassName = cn(
    'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
    className,
  );

  if (as && as !== 'label') {
    const { htmlFor: _htmlFor, ...rest } = props as React.ComponentProps<
      typeof LabelPrimitive.Root
    > & {
      htmlFor?: string;
    };
    void _htmlFor;
    return React.createElement(as, {
      ...rest,
      'data-slot': 'label',
      className: baseClassName,
    });
  }

  return <LabelPrimitive.Root data-slot="label" className={baseClassName} {...props} />;
}

export { Label };
