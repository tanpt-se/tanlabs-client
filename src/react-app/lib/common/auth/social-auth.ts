import { withQuery } from '@tanlabs/contracts';

import { type PublicAuthApp, bindPublicAuthRuntime } from './runtime-access';

export type SocialAuthProvider = 'google';

export function buildSocialAuthStartUrl(
  app: PublicAuthApp,
  provider: SocialAuthProvider,
  nextPath?: string,
  intent: 'login' | 'register' = 'login',
  audience?: string,
): string {
  const { getApiBaseUrl } = bindPublicAuthRuntime(app)();
  return `${getApiBaseUrl()}${withQuery(`/auth/oauth/${provider}/start`, {
    ...(audience ? { audience } : {}),
    intent,
    next: nextPath,
  })}`;
}

export function startSocialAuth(
  app: PublicAuthApp,
  provider: SocialAuthProvider,
  nextPath?: string,
  intent: 'login' | 'register' = 'login',
  audience?: string,
): void {
  window.location.assign(buildSocialAuthStartUrl(app, provider, nextPath, intent, audience));
}

export async function startSocialLink(
  app: PublicAuthApp,
  provider: SocialAuthProvider,
  nextPath = '/my-account',
): Promise<void> {
  const { apiPost, usersSocialLinkStart } = bindPublicAuthRuntime(app)();
  const result = await apiPost<{ url: string }>(
    withQuery(usersSocialLinkStart(provider), { next: nextPath }),
    {},
  );
  window.location.assign(result.url);
}
