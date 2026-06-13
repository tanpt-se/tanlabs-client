export function isPlatformTestEnv(): boolean {
  return import.meta.env.MODE === 'test';
}

export function logClientError(error: unknown, context?: string): void {
  if (isPlatformTestEnv()) {
    return;
  }

  if (context) {
    console.error(`[${context}]`, error);
    return;
  }

  console.error(error);
}
