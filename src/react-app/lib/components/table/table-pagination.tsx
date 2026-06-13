import * as React from 'react';

import { cn } from '../lib/cn';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '../pagination';
import { TypographyMuted } from '../typography';
import { TABLE_PAGE_SIZE_OPTIONS } from './constants';

export type TablePaginationLabels = {
  page: React.ReactNode;
  of: React.ReactNode;
  pageSize: React.ReactNode;
  previous: string;
  next: string;
};

export type TablePaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  setPage: (updater: number | ((value: number) => number)) => void;
  setPageSize: (size: number) => void;
  labels: TablePaginationLabels;
  pageSizeOptions?: readonly number[];
  resetPageOnPageSizeChange?: boolean;
  className?: string;
};

export function TablePagination({
  page,
  pageSize,
  total,
  setPage,
  setPageSize,
  labels,
  pageSizeOptions = TABLE_PAGE_SIZE_OPTIONS,
  resetPageOnPageSizeChange = false,
  className,
}: TablePaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pageCount);
  const canPrev = safePage > 1;
  const canNext = safePage < pageCount;

  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-3 px-1 py-3', className)}>
      <TypographyMuted>
        {labels.page} {safePage} {labels.of} {pageCount}
      </TypographyMuted>
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{labels.pageSize}</span>
          <select
            className="border-input bg-background h-8 rounded-md border px-2 text-sm"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              if (resetPageOnPageSizeChange) {
                setPage(1);
              }
            }}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                text={labels.previous}
                className={!canPrev ? 'pointer-events-none opacity-50' : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  if (!canPrev) return;
                  setPage((value) => Math.max(1, value - 1));
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                text={labels.next}
                className={!canNext ? 'pointer-events-none opacity-50' : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  if (!canNext) return;
                  setPage((value) => Math.min(pageCount, value + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
