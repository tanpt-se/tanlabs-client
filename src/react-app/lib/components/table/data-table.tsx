'use client';

import * as React from 'react';

import {
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type Table as TanStackTable,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { cn } from '../lib/cn';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableShell,
  TableViewport,
} from './primitives';

function applyUpdater<T>(updater: T | ((old: T) => T), old: T): T {
  return typeof updater === 'function' ? (updater as (value: T) => T)(old) : updater;
}

function rowSelectionFromIds(ids: readonly string[]): RowSelectionState {
  return Object.fromEntries(ids.map((id) => [id, true] as const));
}

function idsFromRowSelection(state: RowSelectionState): string[] {
  return Object.entries(state)
    .filter(([, selected]) => selected)
    .map(([id]) => id);
}

function createSelectColumn<TData>(): ColumnDef<TData, unknown> {
  const checkboxClass =
    'size-4 shrink-0 rounded border border-input bg-background accent-primary disabled:cursor-not-allowed disabled:opacity-50';

  return {
    id: '__select__',
    header: ({ table }) => <SelectAllCheckbox table={table} className={checkboxClass} />,
    cell: ({ row }) => (
      <input
        type="checkbox"
        role="checkbox"
        aria-label="Select row"
        className={checkboxClass}
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        onClick={(event) => event.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  };
}

function SelectAllCheckbox<TData>({
  table,
  className,
}: {
  table: TanStackTable<TData>;
  className: string;
}) {
  const ref = React.useRef<HTMLInputElement>(null);
  const isSome = table.getIsSomePageRowsSelected();
  const isAll = table.getIsAllPageRowsSelected();

  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    node.indeterminate = Boolean(isSome && !isAll);
  }, [isAll, isSome]);

  return (
    <input
      ref={ref}
      type="checkbox"
      role="checkbox"
      aria-label="Select all rows on this page"
      className={className}
      checked={isAll}
      onChange={table.getToggleAllPageRowsSelectedHandler()}
    />
  );
}

export type DataTableSelection = {
  selectedIds: readonly string[];
  onSelectedIdsChange: (ids: string[]) => void;
};

export type DataTablePagination = {
  page: number;
  pageSize: number;
  total: number;
  setPage: (page: number | ((value: number) => number)) => void;
  setPageSize: (size: number) => void;
};

export type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowId: (row: TData) => string;
  selection?: DataTableSelection;
  pagination?: DataTablePagination;
  loading?: boolean;
  error?: string | null;
  emptyText?: React.ReactNode;
  loadingText?: React.ReactNode;
  onRowClick?: (row: TData) => void;
  rowClassName?: string;
  layout?: 'default' | 'bare';
  className?: string;
  tableClassName?: string;
  viewportClassName?: string;
  stickyHeader?: boolean;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  getRowId,
  selection,
  pagination,
  loading,
  error,
  emptyText,
  loadingText,
  onRowClick,
  rowClassName,
  layout = 'default',
  className,
  tableClassName,
  viewportClassName,
  stickyHeader = false,
}: DataTableProps<TData, TValue>) {
  const selectionRef = React.useRef(selection);
  selectionRef.current = selection;

  const onRowSelectionChange: OnChangeFn<RowSelectionState> | undefined = selection
    ? (updater) => {
        const current = selectionRef.current;
        if (!current) {
          return;
        }
        const prev = rowSelectionFromIds(current.selectedIds);
        const next = applyUpdater(updater, prev);
        current.onSelectedIdsChange(idsFromRowSelection(next));
      }
    : undefined;

  const rowSelection = selection ? rowSelectionFromIds(selection.selectedIds) : {};

  const columnsWithSelect = React.useMemo(() => {
    if (!selection) {
      return columns;
    }
    return [createSelectColumn<TData>(), ...columns];
  }, [columns, selection]);

  const paginationState: PaginationState | undefined = pagination
    ? { pageIndex: pagination.page - 1, pageSize: pagination.pageSize }
    : undefined;

  const paginationRef = React.useRef(pagination);
  paginationRef.current = pagination;

  const onPaginationChange: OnChangeFn<PaginationState> | undefined = pagination
    ? (updater) => {
        const pag = paginationRef.current;
        if (!pag) {
          return;
        }
        const current: PaginationState = { pageIndex: pag.page - 1, pageSize: pag.pageSize };
        const next = applyUpdater(updater, current);
        if (next.pageIndex !== current.pageIndex) {
          pag.setPage(next.pageIndex + 1);
        }
        if (next.pageSize !== current.pageSize) {
          pag.setPageSize(next.pageSize);
        }
      }
    : undefined;

  const pageCount =
    pagination && pagination.pageSize > 0
      ? Math.max(1, Math.ceil(pagination.total / pagination.pageSize))
      : undefined;

  const table = useReactTable({
    data,
    columns: columnsWithSelect,
    getRowId: (originalRow) => getRowId(originalRow),
    state: {
      ...(selection ? { rowSelection } : {}),
      ...(paginationState ? { pagination: paginationState } : {}),
    },
    onRowSelectionChange,
    enableRowSelection: Boolean(selection),
    manualPagination: Boolean(pagination),
    pageCount,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
  });

  const colCount = columnsWithSelect.length;

  const tableInner = (
    <Table className={tableClassName}>
      <TableHeader className={stickyHeader ? 'bg-card sticky top-0 z-20' : undefined}>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="border-t-0 hover:bg-transparent">
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className={cn(
                  stickyHeader ? 'bg-card' : undefined,
                  header.column.id === '__select__' ? 'w-10' : undefined,
                )}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={colCount} className="text-muted-foreground py-16 text-center">
              {loadingText ?? '...'}
            </TableCell>
          </TableRow>
        ) : null}
        {!loading && error ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={colCount} className="text-destructive py-16 text-center">
              {error}
            </TableCell>
          </TableRow>
        ) : null}
        {!loading && !error && table.getRowModel().rows.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={colCount} className="text-muted-foreground py-16 text-center">
              {emptyText ?? 'No results.'}
            </TableCell>
          </TableRow>
        ) : null}
        {!loading && !error
          ? table
              .getRowModel()
              .rows.map((row) => (
                <DataTableBodyRow
                  key={row.id}
                  row={row}
                  onRowClick={onRowClick}
                  rowClassName={rowClassName}
                />
              ))
          : null}
      </TableBody>
    </Table>
  );

  if (layout === 'bare') {
    return (
      <div className={cn('overflow-x-auto', className)}>
        <TableViewport className={viewportClassName}>{tableInner}</TableViewport>
      </div>
    );
  }

  return (
    <TableShell className={className}>
      <TableViewport className={viewportClassName}>{tableInner}</TableViewport>
    </TableShell>
  );
}

function DataTableBodyRow<TData>({
  row,
  onRowClick,
  rowClassName,
}: {
  row: Row<TData>;
  onRowClick?: (row: TData) => void;
  rowClassName?: string;
}) {
  const clickable = Boolean(onRowClick);
  return (
    <TableRow
      data-state={row.getIsSelected() ? 'selected' : undefined}
      className={cn(
        clickable &&
          'cursor-pointer transition hover:bg-(--surface-soft) focus-visible:ring-2 focus-visible:ring-(--accent)/50 focus-visible:outline-none',
        rowClassName,
      )}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? () => onRowClick?.(row.original) : undefined}
      onKeyDown={
        clickable
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onRowClick?.(row.original);
              }
            }
          : undefined
      }
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
