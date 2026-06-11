/**
 * Image optimization utilities for the education platform.
 */

export const ASPECT_RATIOS = {
  video: 16 / 9,
  square: 1,
  portrait: 3 / 4,
  wide: 21 / 9,
} as const;

export type AspectRatioType = keyof typeof ASPECT_RATIOS | number;

/**
 * Calculates the height based on width and aspect ratio.
 */
export function calculateHeight(
  width: number,
  aspectRatio: AspectRatioType
): number {
  const ratio =
    typeof aspectRatio === 'number' ? aspectRatio : ASPECT_RATIOS[aspectRatio];
  return Math.round(width / ratio);
}

/**
 * Generates a srcset string from a record of image sizes and URLs.
 */
export function generateSrcSet(images: Record<string, string>): string {
  const widthMap: Record<string, number> = {
    thumbnail: 400,
    small: 800,
    medium: 1200,
    large: 1920,
  };

  return Object.entries(images)
    .filter(([key]) => widthMap[key])
    .map(([key, url]) => {
      const width = widthMap[key];
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Returns the default sizes attribute for responsive images.
 */
export function getDefaultSizes(
  variant: 'full' | 'half' | 'third' | 'thumbnail' = 'full'
): string {
  switch (variant) {
    case 'half':
      return '(max-width: 768px) 100vw, 50vw';
    case 'third':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
    case 'thumbnail':
      return '200px';
    default:
      return '100vw';
  }
}

/**
 * Determines if an image should be loaded eagerly (for hero sections).
 */
export function isHeroImage(src: string): boolean {
  return src.includes('hero');
}

/**
 * Returns the WebP version of a given image path if it's a JPEG or PNG.
 */
export function getWebPPath(src: string): string {
  return src.replace(/\.(jpe?g|png)$/i, '.webp');
}
