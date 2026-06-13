import { type PublicAuthClientConfig, readPublicAuthClientConfig } from '@tanlabs/config';

import { CSRF_COOKIE } from '@/shared/auth';

export type ClientConfig = PublicAuthClientConfig;

export function getClientConfig(): ClientConfig {
  return readPublicAuthClientConfig(CSRF_COOKIE);
}
