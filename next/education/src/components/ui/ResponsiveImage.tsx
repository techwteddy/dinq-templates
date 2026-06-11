import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { AspectRatioType } from '@/lib/image-optimizer';

interface ResponsiveImageProps extends Omit<ImageProps, 'alt'> {
  /** The alternative text for the image. Required for accessibility. */
  alt: string;
  /** Optional class name for the container div. */
  containerClassName?: string;
  /** Optional aspect ratio for the image container. */
  aspectRatio?: AspectRatioType;
}

/**
 * ResponsiveImage component
 *
 * A high-performance, accessible image component that wraps Next.js Image.
 * Enforces best practices such as mandatory alt text, lazy loading for below-fold
 * content, and aspect ratio maintenance to prevent CLS.
 *
 * @example
 * <ResponsiveImage
 *   src="/images/hero.webp"
 *   alt="Students in a classroom"
 *   aspectRatio="video"
 *   priority
 * />
 */
export function ResponsiveImage({
  src,
  alt,
  fill,
  width,
  height,
  priority = false,
  className,
  containerClassName,
  aspectRatio,
  sizes,
  ...props
}: ResponsiveImageProps) {
  // If fill is true or if neither width nor height is provided, default to fill mode
  const useFill = fill ?? (!width && !height);

  // Aspect ratio mapping to Tailwind classes
  const getAspectRatioClass = () => {
    if (!aspectRatio) return '';
    if (aspectRatio === 'video') return 'aspect-video';
    if (aspectRatio === 'square') return 'aspect-square';
    if (aspectRatio === 'portrait') return 'aspect-[3/4]';
    if (aspectRatio === 'wide') return 'aspect-[21/9]';
    return '';
  };

  // Custom style for numeric aspect ratios
  const containerStyle =
    typeof aspectRatio === 'number' ? { aspectRatio: `${aspectRatio}` } : {};

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        useFill && 'h-full w-full',
        getAspectRatioClass(),
        containerClassName
      )}
      style={containerStyle}
    >
      <Image
        src={src}
        alt={alt}
        fill={useFill}
        width={useFill ? undefined : width}
        height={useFill ? undefined : height}
        priority={priority}
        className={cn('object-cover transition-all duration-300', className)}
        sizes={
          sizes ?? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        }
        {...props}
      />
    </div>
  );
}
