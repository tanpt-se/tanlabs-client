'use client';

import type { ReactNode } from 'react';

import { AuthPageShell } from '@/ui/login-card';
import { AuthPreferenceBar } from '@tanlabs/astryx';

export function AuthLayout({
  children,
}: {
  children: ReactNode;
  contentViewTransitionName?: string;
}) {
  return <AuthPageShell overlay={<AuthPreferenceBar />}>{children}</AuthPageShell>;
}
