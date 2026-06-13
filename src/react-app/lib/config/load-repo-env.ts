import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

function applyEnvFile(filePath: string, { override = false } = {}): void {
  if (!existsSync(filePath)) {
    return;
  }

  for (const rawLine of readFileSync(filePath, 'utf8').split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separator = line.indexOf('=');
    if (separator <= 0) continue;

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (override || !process.env[key]?.trim()) {
      process.env[key] = value;
    }
  }
}

/** Monorepo root from `apps/web-app` (or any path two levels below root). */
export function resolveRepoRoot(fromDir: string): string {
  return path.resolve(fromDir, '../..');
}

/** Load root `.env.variable` then `.env.secret`. Used by Next.js config at build/dev time. */
export function loadRepoEnvFiles(repoRoot: string, { overrideSecrets = true } = {}): void {
  applyEnvFile(path.join(repoRoot, '.env.variable'));
  applyEnvFile(path.join(repoRoot, '.env.secret'), { override: overrideSecrets });
}
