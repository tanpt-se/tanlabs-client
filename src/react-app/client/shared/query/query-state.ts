import { TABLE_PAGE_SIZE_OPTIONS } from '@tanlabs/components';

export function normalizePageSize(value: number): number {
  return TABLE_PAGE_SIZE_OPTIONS.some((option) => option === value)
    ? value
    : TABLE_PAGE_SIZE_OPTIONS[1];
}
