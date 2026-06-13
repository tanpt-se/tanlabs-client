'use client';

import { useCallback, useMemo, useState } from 'react';

export type UseTableSelectionOptions = {
  enabled?: boolean;
  onSelectedChange?: (selectedIds: string[]) => void;
};

export function useTableSelection(options: UseTableSelectionOptions = {}) {
  const enabled = options.enabled !== false;
  const onSelectedChange = options.onSelectedChange;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const onSelectedIdsChange = useCallback(
    (ids: string[]) => {
      if (!enabled) {
        return;
      }
      setSelectedIds(ids);
      onSelectedChange?.(ids);
    },
    [enabled, onSelectedChange],
  );

  const clearSelection = useCallback(() => {
    if (!enabled) {
      return;
    }
    setSelectedIds([]);
    onSelectedChange?.([]);
  }, [enabled, onSelectedChange]);

  const selection = useMemo(
    () =>
      enabled
        ? {
            selectedIds,
            onSelectedIdsChange,
          }
        : undefined,
    [enabled, onSelectedIdsChange, selectedIds],
  );

  return {
    selectedIds,
    selectedCount: enabled ? selectedIds.length : 0,
    clearSelection,
    onSelectedIdsChange,
    selection,
    getSelectedIds: () => selectedIds,
  };
}
