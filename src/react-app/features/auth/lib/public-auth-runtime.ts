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

export function getPublicAuthRuntime(): PublicAuthRuntime {
  if (!runtime) {
    throw new Error(
      '[web] configurePublicAuthRuntime() was not called. Mount PublicAuthRuntimeRoot in app root.',
    );
  }
  return runtime;
}
