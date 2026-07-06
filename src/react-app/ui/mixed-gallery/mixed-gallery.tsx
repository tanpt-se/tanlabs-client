'use client';

import { AspectRatio } from '@astryxdesign/core/AspectRatio';

import {
  MIXED_GALLERY_CSS,
  mixedGalleryClipStyle,
  mixedGalleryContainerStyle,
  mixedGalleryImageStyle,
} from './mixed-gallery.styles';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20preserveAspectRatio%3D%22xMidYMid%20slice%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23f5f6f8%22%2F%3E%3Cg%20transform%3D%22translate%28200%20150%29%22%20fill%3D%22none%22%20stroke%3D%22%23c2cad6%22%20stroke-width%3D%225%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20x%3D%22-44%22%20y%3D%22-44%22%20width%3D%2288%22%20height%3D%2288%22%20rx%3D%2216%22%2F%3E%3Ccircle%20cx%3D%2218%22%20cy%3D%22-18%22%20r%3D%222.5%22%20fill%3D%22%23c2cad6%22%20stroke%3D%22none%22%2F%3E%3Cpath%20d%3D%22M-34%2030%20L-8%200%20L10%2018%20L20%208%20L34%2024%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E';

export type MixedGalleryImage = {
  src: string;
  title: string;
};

const DEFAULT_IMAGES: MixedGalleryImage[] = [
  { src: PLACEHOLDER_IMAGE, title: 'Going places' },
  { src: PLACEHOLDER_IMAGE, title: 'Making memories' },
  { src: PLACEHOLDER_IMAGE, title: 'Being free' },
  { src: PLACEHOLDER_IMAGE, title: 'Getting it done' },
  { src: PLACEHOLDER_IMAGE, title: 'Finding calm' },
];

function GalleryCard({
  image,
  ratio,
  className,
}: {
  image: MixedGalleryImage;
  ratio: number;
  className?: string;
}) {
  return (
    <AspectRatio ratio={ratio} className={className} style={mixedGalleryClipStyle}>
      <img src={image.src} alt={image.title} style={mixedGalleryImageStyle} />
    </AspectRatio>
  );
}

export function MixedGallery({ images = DEFAULT_IMAGES }: { images?: MixedGalleryImage[] }) {
  return (
    <>
      <style>{MIXED_GALLERY_CSS}</style>
      <div className="mixed-gallery-grid" style={mixedGalleryContainerStyle}>
        <GalleryCard image={images[0]} ratio={3 / 1} className="mixed-gallery-hero" />
        <GalleryCard image={images[2]} ratio={3 / 2} />
        <GalleryCard image={images[3]} ratio={3 / 2} />
        <GalleryCard image={images[4]} ratio={3 / 2} />
        <GalleryCard image={images[1]} ratio={3 / 2} />
      </div>
    </>
  );
}
