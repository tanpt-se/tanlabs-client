export type RuntimeEnvScope = 'api' | 'web' | 'admin' | 'shared';

export interface RuntimeEnvField {
  key: string;
  scope: RuntimeEnvScope;
  requiredInProduction: boolean;
  secret: boolean;
  description: string;
}

export const runtimeEnvSchema: RuntimeEnvField[] = [
  {
    key: 'NEXT_PUBLIC_API_URL',
    scope: 'web',
    requiredInProduction: true,
    secret: false,
    description: 'Public browser API base URL for the web app.',
  },
  {
    key: 'APP_ORIGIN',
    scope: 'shared',
    requiredInProduction: true,
    secret: false,
    description: 'Canonical public web application origin.',
  },
  {
    key: 'ADMIN_APP_ORIGIN',
    scope: 'admin',
    requiredInProduction: true,
    secret: false,
    description: 'Canonical admin console origin.',
  },
  {
    key: 'ACCESS_TOKEN_SECRET',
    scope: 'api',
    requiredInProduction: true,
    secret: true,
    description: 'JWT signing secret for access tokens.',
  },
  {
    key: 'TOKEN_HASH_SECRET',
    scope: 'api',
    requiredInProduction: true,
    secret: true,
    description: 'Hash secret for opaque token material.',
  },
  {
    key: 'DATABASE_URL',
    scope: 'api',
    requiredInProduction: true,
    secret: true,
    description: 'Primary PostgreSQL connection string.',
  },
  {
    key: 'REDIS_URL',
    scope: 'api',
    requiredInProduction: false,
    secret: true,
    description: 'Redis connection URL for state, rate limiting, and auth internals.',
  },
  {
    key: 'INTERNAL_REFRESH_SERVICE_ID',
    scope: 'shared',
    requiredInProduction: true,
    secret: false,
    description: 'Trusted internal SSR refresh caller identity.',
  },
];

export function filterRuntimeEnvSchema(scope: RuntimeEnvScope): RuntimeEnvField[] {
  return runtimeEnvSchema.filter((field) => field.scope === scope || field.scope === 'shared');
}

export function getMissingRuntimeEnvKeys(
  scope: RuntimeEnvScope,
  env: Record<string, string | undefined>,
): string[] {
  return filterRuntimeEnvSchema(scope)
    .filter((field) => field.requiredInProduction)
    .filter((field) => !env[field.key])
    .map((field) => field.key);
}
