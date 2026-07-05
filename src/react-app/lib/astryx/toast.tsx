'use client';

import type { ReactNode } from 'react';

import { ToastViewport, useToast as useAstryxToast } from '@astryxdesign/core/Toast';

export type ToastTone = 'success' | 'danger' | 'warning' | 'info' | 'default';

export type ToastPayload = {
  title?: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  id?: string | number;
  duration?: number;
};

export function ToastProvider() {
  return <ToastViewport position="topEnd" />;
}

export function useToast() {
  const show = useAstryxToast();

  const notify = (payload: ToastPayload) => {
    const message = payload.description ?? payload.title ?? '';
    const type = payload.tone === 'danger' ? 'error' : 'info';
    return show({
      body: message,
      type,
      uniqueID: payload.id != null ? String(payload.id) : undefined,
      autoHideDuration: payload.duration,
    });
  };

  return {
    toast: notify,
    pushToast: notify,
    dismiss: () => undefined,
  };
}
