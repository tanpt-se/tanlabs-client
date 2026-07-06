import { withQuery } from '@tanlabs/contracts';

import { getPublicAuthRuntime } from './public-auth-runtime';

export type SocialAuthProvider = 'google' | 'facebook';

const WEB_AUDIENCE = 'web';

export function buildSocialAuthStartUrl(
  provider: SocialAuthProvider,
  nextPath?: string,
  intent: 'login' | 'register' = 'login',
): string {
  const { getApiBaseUrl } = getPublicAuthRuntime();
  return `${getApiBaseUrl()}${withQuery(`/auth/oauth/${provider}/start`, {
    audience: WEB_AUDIENCE,
    intent,
    next: nextPath,
  })}`;
}

export function startSocialAuth(
  provider: SocialAuthProvider,
  nextPath?: string,
  intent: 'login' | 'register' = 'login',
): void {
  window.location.assign(buildSocialAuthStartUrl(provider, nextPath, intent));
}

export async function startSocialLink(
  provider: SocialAuthProvider,
  nextPath = '/settings',
): Promise<void> {
  const { apiPost, usersSocialLinkStart } = getPublicAuthRuntime();
  const result = await apiPost<{ url: string }>(
    withQuery(usersSocialLinkStart(provider), { next: nextPath }),
    {},
  );
  window.location.assign(result.url);
}
