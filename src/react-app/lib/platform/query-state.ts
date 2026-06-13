export function readSearchParam(value?: string | string[]): string {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

export function parsePositiveInt(value: string | string[] | undefined, fallback: number): number {
  const parsed = Number(readSearchParam(value));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
