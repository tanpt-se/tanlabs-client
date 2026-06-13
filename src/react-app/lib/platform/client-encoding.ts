export function decodeBase64Url(input: string): string | null {
  try {
    const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');

    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
      return window.atob(padded);
    }

    return Buffer.from(padded, 'base64').toString('utf8');
  } catch {
    return null;
  }
}
