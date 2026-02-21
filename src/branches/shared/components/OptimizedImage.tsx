import Image from 'next/image'
import type { Media } from '@/payload-types'

export interface OptimizedImageProps {
  media: Media | string | number
  alt?: string
  sizes?: string
  priority?: boolean
  fill?: boolean
  className?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  width?: number
  height?: number
  quality?: number
}

/**
 * OptimizedImage - Automatic image optimization wrapper
 *
 * Features:
 * - Next.js Image optimization (WebP/AVIF)
 * - Lazy loading by default
 * - Responsive sizes
 * - Blur placeholder
 * - Alt text validation
 * - SEO-friendly
 *
 * @example
 * ```tsx
 * <OptimizedImage
 *   media={page.heroImage}
 *   alt="Hero image"
 *   sizes="(max-width: 768px) 100vw, 50vw"
 *   priority // For above-the-fold images
 * />
 * ```
 */
export function OptimizedImage({
  media,
  alt,
  sizes = '100vw',
  priority = false,
  fill = false,
  className = '',
  objectFit = 'cover',
  width,
  height,
  quality = 85,
}: OptimizedImageProps) {
  // ─── Resolve Media Object ────────────────────────────────
  let mediaObj: Media | null = null

  if (typeof media === 'object' && media !== null) {
    mediaObj = media as Media
  } else if (typeof media === 'string' || typeof media === 'number') {
    // If media is an ID or URL string, we can't optimize it without fetching
    // For now, return a basic img tag
    const src = typeof media === 'string' ? media : `/api/media/${media}`
    return (
      <img
        src={src}
        alt={alt || 'Image'}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        style={{ objectFit }}
      />
    )
  }

  if (!mediaObj?.url) {
    // Fallback: No image available
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center text-gray-400 ${className}`}
        style={{ width: width || '100%', height: height || '100%' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      </div>
    )
  }

  // ─── Alt Text (SEO Critical!) ─────────────────────────────
  const imageAlt = alt || mediaObj.alt || mediaObj.filename || 'Image'

  // Warn in development if no alt text provided
  if (process.env.NODE_ENV === 'development' && !alt && !mediaObj.alt) {
    console.warn(
      `[OptimizedImage] Missing alt text for image: ${mediaObj.url}. This is bad for SEO and accessibility!`
    )
  }

  // ─── Image Dimensions ─────────────────────────────────────
  const imgWidth = width || mediaObj.width || 1200
  const imgHeight = height || mediaObj.height || 800

  // ─── Blur Placeholder (if available) ──────────────────────
  const blurDataURL = mediaObj.sizes?.thumbnail?.url || mediaObj.url

  // ─── Render Next.js Image ─────────────────────────────────
  if (fill) {
    // Fill mode (for hero images, backgrounds)
    return (
      <Image
        src={mediaObj.url}
        alt={imageAlt}
        fill
        sizes={sizes}
        quality={quality}
        priority={priority}
        className={className}
        style={{ objectFit }}
        placeholder="blur"
        blurDataURL={blurDataURL}
      />
    )
  }

  // Fixed dimensions mode
  return (
    <Image
      src={mediaObj.url}
      alt={imageAlt}
      width={imgWidth}
      height={imgHeight}
      sizes={sizes}
      quality={quality}
      priority={priority}
      className={className}
      style={{ objectFit }}
      placeholder="blur"
      blurDataURL={blurDataURL}
    />
  )
}

/**
 * OptimizedBackgroundImage - Background image with overlay support
 *
 * @example
 * ```tsx
 * <OptimizedBackgroundImage
 *   media={heroImage}
 *   overlay="dark"
 *   className="min-h-[500px]"
 * >
 *   <h1>Hero Content</h1>
 * </OptimizedBackgroundImage>
 * ```
 */
export function OptimizedBackgroundImage({
  media,
  alt = '',
  overlay = 'none',
  className = '',
  children,
}: {
  media: Media | string | number
  alt?: string
  overlay?: 'none' | 'light' | 'dark' | 'gradient'
  className?: string
  children?: React.ReactNode
}) {
  const overlayStyles: Record<string, string> = {
    none: '',
    light: 'bg-white/30',
    dark: 'bg-black/50',
    gradient: 'bg-gradient-to-b from-black/40 to-black/70',
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background Image */}
      <OptimizedImage
        media={media}
        alt={alt}
        fill
        className="z-0"
        objectFit="cover"
        sizes="100vw"
      />

      {/* Overlay */}
      {overlay !== 'none' && (
        <div className={`absolute inset-0 z-10 ${overlayStyles[overlay]}`} />
      )}

      {/* Content */}
      {children && <div className="relative z-20">{children}</div>}
    </div>
  )
}

/**
 * ResponsiveImage - Auto-responsive with breakpoint sizes
 *
 * @example
 * ```tsx
 * <ResponsiveImage
 *   media={productImage}
 *   alt="Product"
 *   breakpoints={{
 *     mobile: 400,
 *     tablet: 768,
 *     desktop: 1200
 *   }}
 * />
 * ```
 */
export function ResponsiveImage({
  media,
  alt,
  breakpoints = {
    mobile: 640,
    tablet: 1024,
    desktop: 1536,
  },
  className = '',
  priority = false,
}: {
  media: Media | string | number
  alt?: string
  breakpoints?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
  className?: string
  priority?: boolean
}) {
  // Generate sizes string
  const sizes = `
    (max-width: 640px) ${breakpoints.mobile || 640}px,
    (max-width: 1024px) ${breakpoints.tablet || 1024}px,
    ${breakpoints.desktop || 1536}px
  `

  return (
    <OptimizedImage
      media={media}
      alt={alt}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  )
}
