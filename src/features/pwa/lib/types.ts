/**
 * PWA Types
 *
 * Type definitions for Web App Manifest, icon generation,
 * cache strategies and PWA settings.
 */

// ─── Web App Manifest ────────────────────────────────────────────

export interface WebAppManifest {
  name: string
  short_name: string
  description: string
  start_url: string
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser'
  background_color: string
  theme_color: string
  icons: ManifestIcon[]
  orientation: 'portrait-primary' | 'landscape-primary' | 'any'
  lang: string
  categories: string[]
  scope?: string
  id?: string
}

export interface ManifestIcon {
  src: string
  sizes: string
  type: string
  purpose?: 'any' | 'maskable' | 'any maskable'
}

// ─── Icon Generation ─────────────────────────────────────────────

export type IconPurpose = 'any' | 'maskable'

export interface IconSize {
  size: number
  purpose: IconPurpose
}

/** All PWA icon sizes to generate */
export const PWA_ICON_SIZES: readonly number[] = [72, 96, 128, 144, 152, 192, 384, 512] as const

/** Sizes included in the manifest icons array (regular + maskable) */
export const MANIFEST_ICON_SIZES: readonly IconSize[] = [
  { size: 192, purpose: 'any' },
  { size: 384, purpose: 'any' },
  { size: 512, purpose: 'any' },
  { size: 192, purpose: 'maskable' },
  { size: 384, purpose: 'maskable' },
  { size: 512, purpose: 'maskable' },
] as const

// ─── Cache Strategies ────────────────────────────────────────────

export type CacheStrategy = 'cache-first' | 'network-first' | 'network-only' | 'stale-while-revalidate'

export interface CacheStrategyConfig {
  /** Cache name to use for this resource type */
  cacheName: string
  /** Caching strategy to apply */
  strategy: CacheStrategy
  /** URL patterns this strategy applies to (for service worker routing) */
  urlPatterns: string[]
  /** Max age in seconds before cache entry is considered stale */
  maxAgeSeconds?: number
  /** Max number of entries to keep in this cache */
  maxEntries?: number
}

// ─── PWA Settings ────────────────────────────────────────────────

export interface PWASettings {
  /** App name from tenant settings (companyName) */
  appName: string
  /** Short name for home screen (max 12 chars) */
  shortName: string
  /** Description from tenant settings */
  description: string
  /** Theme color (from branding or fallback) */
  themeColor: string
  /** Background color for splash screen */
  backgroundColor: string
}

/** Default theme color when not configured in tenant settings */
export const DEFAULT_THEME_COLOR = '#0D4F4F'

/** Default background color for splash screens */
export const DEFAULT_BACKGROUND_COLOR = '#FFFFFF'
