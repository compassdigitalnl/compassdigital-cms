export interface GalleryImage {
  id: string
  url: string // Full-size image URL
  alt: string // Alt text for accessibility
  thumbnail?: string // Optional smaller thumbnail URL (100×100px)
}

export type BadgeType = 'new' | 'sale' | 'pro' | 'config'
export type BadgePosition = 'top-left' | 'top-right'

export interface GalleryBadge {
  type: BadgeType
  label?: string // Custom label (e.g., "-25% Sale", "6 opties configureerbaar")
  position?: BadgePosition // Default: 'top-left' for new/sale/pro, 'top-right' for config
}

export type GalleryLayout = 'horizontal' | 'vertical'

export interface ProductGalleryProps {
  /**
   * Array of product images (min 1, max 10 recommended)
   */
  images: GalleryImage[]

  /**
   * Optional badge overlays (New, Sale, Pro, Config)
   */
  badges?: GalleryBadge[]

  /**
   * Thumbnail layout
   * @default 'horizontal'
   */
  layout?: GalleryLayout

  /**
   * Enable zoom on hover (desktop only)
   * @default true
   */
  enableZoom?: boolean

  /**
   * Enable lightbox modal on click
   * @default true
   */
  enableLightbox?: boolean

  /**
   * Initial image index to display
   * @default 0
   */
  initialImageIndex?: number

  /**
   * Show image counter in lightbox (e.g., "1 / 5")
   * @default true
   */
  showImageCounter?: boolean

  /**
   * Main image aspect ratio (1 = square, 1.5 = portrait, 0.75 = landscape)
   * @default 1
   */
  aspectRatio?: number

  /**
   * Main image border radius in pixels
   * @default 20
   */
  borderRadius?: number

  /**
   * Maximum number of thumbnails to show
   * @default 5
   */
  thumbnailCount?: number

  /**
   * Enable sticky positioning on desktop
   * @default true
   */
  enableSticky?: boolean

  /**
   * Top offset for sticky positioning (accounts for fixed header)
   * @default 100
   */
  stickyOffset?: number

  /**
   * Callback when active image changes
   */
  onImageChange?: (index: number) => void

  /**
   * Callback when lightbox opens
   */
  onLightboxOpen?: (index: number) => void

  /**
   * Callback when lightbox closes
   */
  onLightboxClose?: () => void

  /**
   * Custom CSS classes
   */
  className?: string
}
