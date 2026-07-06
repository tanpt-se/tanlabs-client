'use client';

import type { ReactNode } from 'react';

import { Button } from '@astryxdesign/core/Button';
import { Divider } from '@astryxdesign/core/Divider';
import { VStack } from '@astryxdesign/core/Layout';
import { FacebookIcon, GoogleIcon } from '@/ui/login-card';
import { startSocialAuth, type SocialAuthProvider } from '@/features/auth/lib/social-auth';

export function SocialSignInButtons({
  disabled = false,
  facebookEnabled,
  facebookLabel,
  googleEnabled,
  googleLabel,
  intent = 'login',
  nextPath,
  orText,
}: {
  disabled?: boolean;
  facebookEnabled: boolean;
  facebookLabel: string;
  googleEnabled: boolean;
  googleLabel: string;
  intent?: 'login' | 'register';
  nextPath?: string;
  orText: string;
}) {
  const providers: Array<{
    key: SocialAuthProvider;
    label: string;
    icon: ReactNode;
    enabled: boolean;
  }> = [
    { key: 'google', label: googleLabel, icon: <GoogleIcon />, enabled: googleEnabled },
    { key: 'facebook', label: facebookLabel, icon: <FacebookIcon />, enabled: facebookEnabled },
  ];

  const activeProviders = providers.filter((provider) => provider.enabled);
  if (activeProviders.length === 0) {
    return null;
  }

  return (
    <>
      <Divider label={orText} />
      <VStack gap={3} hAlign="stretch">
        {activeProviders.map((provider) => (
          <Button
            key={provider.key}
            label={provider.label}
            type="button"
            variant="secondary"
            size="lg"
            icon={provider.icon}
            isDisabled={disabled}
            onClick={() => startSocialAuth(provider.key, nextPath, intent)}
          />
        ))}
      </VStack>
    </>
  );
}
