/** Normalize uploaded media paths so the shop worker can proxy `/media/*`. */
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) {
    return '';
  }

  const trimmed = url.trim();
  if (trimmed.startsWith('/media/')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.pathname.startsWith('/media/')) {
      return parsed.pathname;
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}
