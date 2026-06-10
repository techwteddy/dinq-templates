"use client";

import Image, { ImageProps, StaticImageData } from "next/image";
import { useState } from "react";

interface OptimizedImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: string | StaticImageData;
  alt: string;
  belowFold?: boolean;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  width?: number;
  height?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

/**
 * OptimizedImage Component
 * 
 * A Next.js Image component wrapper that provides:
 * - Automatic WebP/AVIF format conversion (handled by Next.js)
 * - Lazy loading for below-fold images
 * - Responsive srcset and sizes attributes
 * - Placeholder backgrounds to prevent layout shift
 * 
 * @param {OptimizedImageProps} props - Component props
 * @param {string | StaticImageData} props.src - Image source URL or imported image
 * @param {string} props.alt - Alternative text for accessibility
 * @param {boolean} [props.belowFold=false] - Whether image is below the fold (enables lazy loading)
 * @param {boolean} [props.priority=false] - Whether to prioritize loading (disables lazy loading)
 * @param {string} [props.sizes] - Responsive sizes attribute
 * @param {number} [props.quality=85] - Image quality (1-100)
 * @param {string} [props.className] - Additional CSS classes
 * 
 * @example
 * // Basic usage
 * <OptimizedImage 
 *   src="/images/hero.jpg" 
 *   alt="Hero image" 
 *   width={800} 
 *   height={600} 
 * />
 * 
 * @example
 * // Below-fold image with lazy loading
 * <OptimizedImage 
 *   src="/images/project.jpg" 
 *   alt="Project screenshot" 
 *   width={600} 
 *   height={400}
 *   belowFold={true}
 * />
 * 
 * @example
 * // Responsive image with custom sizes
 * <OptimizedImage 
 *   src="/images/banner.jpg" 
 *   alt="Banner" 
 *   fill={true}
 *   sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
 * />
 */
export default function OptimizedImage({
  src,
  alt,
  belowFold = false,
  className = "",
  priority = false,
  fill = false,
  sizes,
  quality = 85,
  width,
  height,
  placeholder = "empty",
  blurDataURL,
  ...rest
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Determine loading strategy
  // Priority images (above fold) should load immediately
  // Below-fold images should lazy load
  const loading = priority ? "eager" : belowFold ? "lazy" : "lazy";

  // Default sizes for responsive images if not provided
  const defaultSizes = fill
    ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    : undefined;

  const imageSizes = sizes || defaultSizes;

  // Placeholder background to prevent layout shift
  const placeholderClassName = isLoading
    ? "bg-gray-200 dark:bg-gray-700 animate-pulse"
    : "";

  // Error fallback styling
  const errorClassName = hasError
    ? "bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
    : "";

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // If there's an error, show alt text
  if (hasError) {
    return (
      <div
        className={`${errorClassName} ${className}`}
        style={
          fill
            ? { position: "absolute", inset: 0 }
            : { width: width || "100%", height: height || "auto" }
        }
      >
        <span className="text-sm text-gray-500 dark:text-gray-400 p-4 text-center">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative ${placeholderClassName} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={imageSizes}
        quality={quality}
        loading={loading}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoadingComplete}
        onError={handleError}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        {...rest}
      />
    </div>
  );
}
