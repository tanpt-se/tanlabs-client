import type { CSSProperties, ReactNode } from 'react';

/** Single max-width for shop shell pages — keep in sync with `--app-content-max-width` in index.css. */
export const APP_CONTENT_MAX_WIDTH = 1280;

/** Horizontal inset shared by top nav and page content. */
export const APP_CONTAINER_PADDING_INLINE = 'var(--spacing-6)';

/** Vertical gap between top nav and page content (~1.5rem). */
export const APP_CONTAINER_CONTENT_PADDING_TOP = 'var(--spacing-6)';

type AppContainerProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Clip horizontal overflow — disable for top nav so mega menus are not cut off. */
  clipOverflow?: boolean;
  /** Apply shared shell horizontal padding (`--spacing-6`). */
  padded?: boolean;
  /** Extra top spacing below the header (shop page content only). */
  contentArea?: boolean;
};

export function AppContainer({
  children,
  className,
  style,
  clipOverflow = true,
  padded = true,
  contentArea = false,
}: AppContainerProps) {
  return (
    <div
      className={[
        'app-container',
        clipOverflow ? 'app-container--clip' : null,
        padded ? 'app-container--padded' : null,
        contentArea ? 'app-container--content' : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {children}
    </div>
  );
}
