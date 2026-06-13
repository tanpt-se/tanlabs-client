import {
  type RuntimeEnvField,
  type RuntimeEnvScope,
  filterRuntimeEnvSchema,
  getMissingRuntimeEnvKeys,
} from './runtime-env-schema';

export function createRuntimeEnvHelpers(scope: RuntimeEnvScope): {
  fields: RuntimeEnvField[];
  getMissingKeys: (env: Record<string, string | undefined>) => string[];
} {
  return {
    fields: filterRuntimeEnvSchema(scope),
    getMissingKeys: (env) => getMissingRuntimeEnvKeys(scope, env),
  };
}
