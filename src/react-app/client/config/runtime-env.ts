import { createRuntimeEnvHelpers } from '@tanlabs/config';

const adminRuntimeEnv = createRuntimeEnvHelpers('admin');

export const adminRuntimeEnvFields = adminRuntimeEnv.fields;

export function getMissingAdminRuntimeEnvKeys(env: Record<string, string | undefined>): string[] {
  return adminRuntimeEnv.getMissingKeys(env);
}
