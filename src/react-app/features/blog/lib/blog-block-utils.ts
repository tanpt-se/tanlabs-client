export type BlockAlign = 'left' | 'center' | 'right';
export type BlockGap = 'sm' | 'md' | 'lg';
export type TextSize = 'body' | 'lead';
export type ImageWidth = 'full' | 'large' | 'medium';
export type ImageFit = 'cover' | 'contain';
export type AspectRatio = 'auto' | '1:1' | '4:3' | '16:9';
export type GalleryCaptionPosition = 'below' | 'overlay' | 'none';
export type DividerWidth = 'full' | 'medium' | 'short';
export type LayoutDirection = 'row' | 'col';
export type LayoutValign = 'start' | 'center' | 'end' | 'stretch';
export type LayoutHalign = 'start' | 'center' | 'end';

export interface GalleryItem {
  id: string;
  src: string;
  alt?: string;
  caption?: string;
}

export interface NestedBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'image' | 'video' | 'button';
  label?: string;
  props: Record<string, unknown>;
}

export interface LayoutColumn {
  id: string;
  span: number;
  blocks: NestedBlock[];
}

export const GAP_PX: Record<BlockGap, number> = {
  sm: 8,
  md: 16,
  lg: 24,
};

export const IMAGE_WIDTH_PERCENT: Record<ImageWidth, string> = {
  full: '100%',
  large: '85%',
  medium: '65%',
};

export const DIVIDER_WIDTH_PERCENT: Record<DividerWidth, string> = {
  full: '100%',
  medium: '65%',
  short: '40%',
};

export const BLOCK_SPACING_PX: Record<BlockGap, number> = {
  sm: 8,
  md: 16,
  lg: 24,
};

export function aspectRatioStyle(ratio: AspectRatio): string | undefined {
  switch (ratio) {
    case '1:1':
      return '1 / 1';
    case '4:3':
      return '4 / 3';
    case '16:9':
      return '16 / 9';
    default:
      return undefined;
  }
}

export function parseGalleryItems(value: unknown): GalleryItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (typeof item !== 'object' || item === null) return null;
      const record = item as Record<string, unknown>;
      const src = typeof record.src === 'string' ? record.src : '';
      if (!src) return null;
      return {
        id: typeof record.id === 'string' ? record.id : `gallery-${index}`,
        src,
        alt: typeof record.alt === 'string' ? record.alt : '',
        caption: typeof record.caption === 'string' ? record.caption : '',
      };
    })
    .filter((item): item is GalleryItem => item !== null);
}

export function parseLayoutColumns(value: unknown): LayoutColumn[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (typeof item !== 'object' || item === null) return null;
      const record = item as Record<string, unknown>;
      const blocks = Array.isArray(record.blocks) ? (record.blocks as NestedBlock[]) : [];
      return {
        id: typeof record.id === 'string' ? record.id : `col-${index}`,
        span: typeof record.span === 'number' ? Math.min(12, Math.max(1, record.span)) : 6,
        blocks,
      };
    })
    .filter((col): col is LayoutColumn => col !== null);
}

export function getVideoEmbed(
  url: string,
): { kind: 'iframe'; src: string } | { kind: 'video'; src: string } | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const youtubeMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/i);
  if (youtubeMatch?.[1]) {
    return { kind: 'iframe', src: `https://www.youtube.com/embed/${youtubeMatch[1]}` };
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(\d+)/i);
  if (vimeoMatch?.[1]) {
    return { kind: 'iframe', src: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  }

  return { kind: 'video', src: trimmed };
}

export function headingLevel(level: unknown): 1 | 2 | 3 | 4 | 5 {
  const parsed = Number(level);
  if (parsed >= 1 && parsed <= 5) return parsed as 1 | 2 | 3 | 4 | 5;
  return 2;
}

export function alignStyle(align: unknown): 'left' | 'center' | 'right' {
  if (align === 'center' || align === 'right') return align;
  return 'left';
}

export function layoutAlignItems(valign: unknown): string {
  switch (valign) {
    case 'center':
      return 'center';
    case 'end':
      return 'flex-end';
    case 'start':
      return 'flex-start';
    default:
      return 'stretch';
  }
}

export function layoutJustifyContent(halign: unknown): string {
  switch (halign) {
    case 'center':
      return 'center';
    case 'end':
      return 'flex-end';
    default:
      return 'flex-start';
  }
}

export function blockSpacingPx(spacing: unknown): number {
  if (spacing === 'sm') return BLOCK_SPACING_PX.sm;
  if (spacing === 'lg') return BLOCK_SPACING_PX.lg;
  return BLOCK_SPACING_PX.md;
}

export function dividerWidthPercent(width: unknown): string {
  if (width === 'medium') return DIVIDER_WIDTH_PERCENT.medium;
  if (width === 'short') return DIVIDER_WIDTH_PERCENT.short;
  return DIVIDER_WIDTH_PERCENT.full;
}
