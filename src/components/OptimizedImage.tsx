/**
 * OPTIMIZED IMAGE COMPONENT
 *
 * Next.js Image component wrapper with best practices:
 * - Automatic AVIF/WebP format
 * - Lazy loading by default
 * - Blur placeholder
 * - Responsive sizes
 * - Priority for above-the-fold images
 */

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
  priority?: boolean;
  quality?: number;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '3/2' | '2/3';
}

export function OptimizedImage({
  src,
  alt,
  priority = false,
  quality = 85,
  aspectRatio,
  className = '',
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Aspect ratio to Tailwind class mapping
  const aspectRatioClasses = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-4/3',
    '1/1': 'aspect-square',
    '3/2': 'aspect-3/2',
    '2/3': 'aspect-2/3',
  };

  const containerClass = aspectRatio
    ? `relative ${aspectRatioClasses[aspectRatio]} ${className}`
    : className;

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 ${containerClass}`}
      >
        <span className='text-gray-500 text-sm'>Görsel yüklenemedi</span>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <Image
        src={src}
        alt={alt}
        fill={aspectRatio ? true : false}
        quality={quality}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        placeholder='blur'
        blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
        sizes={
          aspectRatio
            ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
            : undefined
        }
        className={`${isLoading ? 'scale-105 blur-sm' : 'scale-100 blur-0'} transition-all duration-300 ${aspectRatio ? 'object-cover' : ''}`}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        {...props}
      />
    </div>
  );
}

/**
 * Optimized Image for cards - specific sizes and optimization
 */
export function OptimizedCardImage({
  src,
  alt,
  priority = false,
  isReversed = false,
  className = '',
}: {
  src: string;
  alt: string;
  priority?: boolean;
  isReversed?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={300}
      height={450}
      quality={90}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      placeholder='blur'
      blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
      sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px'
      className={`transition-transform duration-500 ${isReversed ? 'rotate-180' : ''} ${className}`}
    />
  );
}

/**
 * Optimized Background Image
 */
export function OptimizedBackgroundImage({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      quality={75}
      priority={false}
      loading='lazy'
      placeholder='blur'
      blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
      sizes='100vw'
      className={`object-cover object-center ${className}`}
    />
  );
}
