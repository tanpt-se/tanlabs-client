'use client';

import type { ComponentProps } from 'react';

import { Toaster as SonnerPrimitive, toast as sonnerToast } from 'sonner';

type ToasterProps = ComponentProps<typeof SonnerPrimitive>;

function Toaster(props: ToasterProps) {
  return (
    <SonnerPrimitive
      theme="system"
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export type ToastTone = 'success' | 'danger' | 'warning' | 'info' | 'default';

export type ToastPayload = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  tone?: ToastTone;
  id?: string | number;
  duration?: number;
};

function pushToast(payload: ToastPayload): string | number {
  const { title, description, tone = 'default', id, duration } = payload;
  const options = { description, id, duration } as const;
  const message = (title ?? '') as string;
  switch (tone) {
    case 'success':
      return sonnerToast.success(message, options);
    case 'danger':
      return sonnerToast.error(message, options);
    case 'warning':
      return sonnerToast.warning(message, options);
    case 'info':
      return sonnerToast.info(message, options);
    default:
      return sonnerToast(message, options);
  }
}

function useToast() {
  return {
    toast: pushToast,
    pushToast,
    dismiss: (id?: string | number) => sonnerToast.dismiss(id),
  };
}

export { Toaster, pushToast, sonnerToast, useToast };
