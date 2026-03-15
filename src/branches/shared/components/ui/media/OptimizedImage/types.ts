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

export interface OptimizedBackgroundImageProps {
  media: Media | string | number
  alt?: string
  overlay?: 'none' | 'light' | 'dark' | 'gradient'
  className?: string
  children?: React.ReactNode
}

export interface ResponsiveImageProps {
  media: Media | string | number
  alt?: string
  breakpoints?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
  className?: string
  priority?: boolean
}
