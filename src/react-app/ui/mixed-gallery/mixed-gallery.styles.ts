import type { CSSProperties } from 'react';

export const mixedGalleryContainerStyle: CSSProperties = {
  containerType: 'inline-size',
  containerName: 'gallery',
};

export const mixedGalleryImageStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

export const mixedGalleryClipStyle: CSSProperties = {
  borderRadius: 'var(--radius-element)',
};

export const MIXED_GALLERY_CSS = `
.mixed-gallery-grid {
  display: grid;
  gap: var(--spacing-3);
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.mixed-gallery-hero {
  grid-column: span 2;
}
@container gallery (max-width: 720px) {
  .mixed-gallery-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .mixed-gallery-hero {
    grid-column: 1 / -1;
  }
}
`;
