import type { CSSProperties } from 'react';

export const blogCardThumbnailWrapperStyle: CSSProperties = {
  position: 'relative',
  aspectRatio: '16/9',
  overflow: 'clip',
  flexShrink: 0,
};

export const blogCardThumbnailImageStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};
