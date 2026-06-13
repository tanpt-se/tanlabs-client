import type { LoginResponse } from '@tanlabs/contracts';

import type { PublicAuthPost, PublicAuthRequests } from './public-auth-requests';

export interface PublicAuthRoutes {
  login: string;
  register: string;
  verifyEmail: string;
  accountSetup: string;
  forgotPassword: string;
  resetPassword: string;
}

export interface PublicAuthRuntime {
  routes: PublicAuthRoutes;
  requests: PublicAuthRequests;
  getApiBaseUrl: () => string;
  getTurnstileSiteKey: () => string | undefined;
  getGoogleOAuthEnabled: () => boolean;
  apiPost: PublicAuthPost;
  usersSocialLinkStart: (provider: string) => string;
  loginRateLimitCookieName?: string;
  clearClientSession?: () => void;
  saveClientSession?: (data: LoginResponse) => void;
}

let runtime: PublicAuthRuntime | null = null;

export function configurePublicAuthRuntime(next: PublicAuthRuntime): void {
  runtime = next;
}

export function getPublicAuthRuntime(appLabel: string): PublicAuthRuntime {
  if (!runtime) {
    throw new Error(
      `[${appLabel}] configurePublicAuthRuntime() was not called. Mount PublicAuthRuntimeRoot in app root.`,
    );
  }
  return runtime;
}
