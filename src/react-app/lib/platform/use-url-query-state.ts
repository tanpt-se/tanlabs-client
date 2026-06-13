'use client';

import { useEffect, useMemo, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

export interface UrlQueryStateConfig<TQuery extends { page: number; pageSize: number }> {
  buildQuery: (query: TQuery) => string;
  initialQuery: TQuery;
  resetPageKeys: Array<keyof TQuery>;
  syncToUrl?: boolean;
}

export function useUrlQueryState<TQuery extends { page: number; pageSize: number }>(
  config: UrlQueryStateConfig<TQuery>,
) {
  const { buildQuery, initialQuery, resetPageKeys, syncToUrl = true } = config;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState<TQuery>(initialQuery);

  const resetPageSignature = useMemo(
    () =>
      JSON.stringify(
        resetPageKeys.map((key) => ({
          key,
          value: query[key],
        })),
      ),
    [query, resetPageKeys],
  );

  useEffect(() => {
    if (!syncToUrl) {
      return;
    }

    const search = buildQuery(query);
    navigate(search ? `${pathname}?${search}` : pathname, { replace: true });
  }, [buildQuery, navigate, pathname, query, syncToUrl]);

  useEffect(() => {
    setQuery((current) => (current.page === 1 ? current : { ...current, page: 1 }));
  }, [resetPageSignature]);

  return {
    query,
    setPage: (updater: number | ((value: number) => number)) =>
      setQuery((current) => ({
        ...current,
        page: typeof updater === 'function' ? updater(current.page) : updater,
      })),
    setPageSize: (updater: number | ((value: number) => number)) =>
      setQuery((current) => ({
        ...current,
        pageSize: typeof updater === 'function' ? updater(current.pageSize) : updater,
      })),
    setQuery,
  };
}
