'use client';

import { ProgressBar } from '@astryxdesign/core/ProgressBar';

const styles = {
  root: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: 3,
  },
};

export function RouteNavigationBar() {
  return (
    <div style={styles.root} aria-hidden="true">
      <ProgressBar isIndeterminate variant="accent" label="" />
    </div>
  );
}
