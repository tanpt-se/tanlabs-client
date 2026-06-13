import * as React from 'react';

import { cn } from '../lib/cn';

type TypographyProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
  as?: T;
};

function TypographyH1<T extends React.ElementType = 'h1'>({
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = as ?? 'h1';
  return (
    <Comp
      data-slot="typography-h1"
      className={cn(
        'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance',
        className,
      )}
      {...props}
    />
  );
}

function TypographyH2<T extends React.ElementType = 'h2'>({
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = as ?? 'h2';
  return (
    <Comp
      data-slot="typography-h2"
      className={cn(
        'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
        className,
      )}
      {...props}
    />
  );
}

function TypographyH3<T extends React.ElementType = 'h3'>({
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = as ?? 'h3';
  return (
    <Comp
      data-slot="typography-h3"
      className={cn('scroll-m-20 text-2xl font-semibold tracking-tight', className)}
      {...props}
    />
  );
}

function TypographyH4<T extends React.ElementType = 'h4'>({
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = as ?? 'h4';
  return (
    <Comp
      data-slot="typography-h4"
      className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)}
      {...props}
    />
  );
}

function TypographyP<T extends React.ElementType = 'p'>({
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = as ?? 'p';
  return (
    <Comp
      data-slot="typography-p"
      className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
      {...props}
    />
  );
}

function TypographyBlockquote<T extends React.ElementType = 'blockquote'>({
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = as ?? 'blockquote';
  return (
    <Comp
      data-slot="typography-blockquote"
      className={cn('mt-6 border-l-2 pl-6 italic', className)}
      {...props}
    />
  );
}

function TypographyTable<T extends React.ElementType = 'div'>({
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = as ?? 'div';
  return (
    <Comp
      data-slot="typography-table"
      className={cn('my-6 w-full overflow-y-auto', className)}
      {...props}
    />
  );
}

function TypographyList<T extends React.ElementType = 'ul'>({
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = as ?? 'ul';
  return (
    <Comp
      data-slot="typography-list"
      className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)}
      {...props}
    />
  );
}

function TypographyInlineCode<T extends React.ElementType = 'code'>({
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = as ?? 'code';
  return (
    <Comp
      data-slot="typography-inline-code"
      className={cn(
        'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        className,
      )}
      {...props}
    />
  );
}

function TypographyLead<T extends React.ElementType = 'p'>({
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = as ?? 'p';
  return (
    <Comp
      data-slot="typography-lead"
      className={cn('text-muted-foreground text-xl', className)}
      {...props}
    />
  );
}

function TypographyLarge<T extends React.ElementType = 'div'>({
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = as ?? 'div';
  return (
    <Comp
      data-slot="typography-large"
      className={cn('text-lg font-semibold', className)}
      {...props}
    />
  );
}

function TypographySmall<T extends React.ElementType = 'small'>({
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = as ?? 'small';
  return (
    <Comp
      data-slot="typography-small"
      className={cn('text-sm leading-none font-medium', className)}
      {...props}
    />
  );
}

function TypographyMuted<T extends React.ElementType = 'p'>({
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = as ?? 'p';
  return (
    <Comp
      data-slot="typography-muted"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export {
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyInlineCode,
  TypographyLarge,
  TypographyLead,
  TypographyList,
  TypographyMuted,
  TypographyP,
  TypographySmall,
  TypographyTable,
};
