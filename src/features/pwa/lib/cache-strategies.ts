/**
 * PWA Cache Strategy Configuration
 *
 * Defines cache names and strategy configs for different resource types.
 * These are NOT actual service worker code — they are config constants
 * referenced by both the service worker (public/sw.js) and server-side code.
 */

import type { CacheStrategyConfig } from './types'

// ─── Cache Names ─────────────────────────────────────────────────

export const CACHE_NAME = 'compassdigital-v1'
export const STATIC_CACHE = 'static-v1'
export const IMAGE_CACHE = 'images-v1'
export const API_CACHE = 'api-v1'

// ─── Strategy Configs ────────────────────────────────────────────

/** Static assets (_next/static, fonts, CSS, JS bundles) — cache-first */
export const STATIC_STRATEGY: CacheStrategyConfig = {
  cacheName: STATIC_CACHE,
  strategy: 'cache-first',
  urlPatterns: ['/_next/static/', '/fonts/', '/favicon'],
  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year (immutable hashed assets)
  maxEntries: 200,
}

/** Images (media, product images, logos) — cache-first with limit */
export const IMAGE_STRATEGY: CacheStrategyConfig = {
  cacheName: IMAGE_CACHE,
  strategy: 'cache-first',
  urlPatterns: ['/api/media/', '/media/', '/_next/image'],
  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
  maxEntries: 150,
}

/** Navigation requests (HTML pages) — network-first with offline fallback */
export const NAVIGATION_STRATEGY: CacheStrategyConfig = {
  cacheName: CACHE_NAME,
  strategy: 'network-first',
  urlPatterns: [],  // Matched via request.mode === 'navigate'
  maxAgeSeconds: 60 * 60 * 24, // 1 day
}

/** API routes — network-only, never cache */
export const API_STRATEGY: CacheStrategyConfig = {
  cacheName: API_CACHE,
  strategy: 'network-only',
  urlPatterns: ['/api/'],
}

/** All strategy configs for reference */
export const CACHE_STRATEGIES: readonly CacheStrategyConfig[] = [
  STATIC_STRATEGY,
  IMAGE_STRATEGY,
  NAVIGATION_STRATEGY,
  API_STRATEGY,
] as const

/** Pre-cache shell: URLs to cache during SW install */
export const PRECACHE_URLS: readonly string[] = [
  '/offline',
] as const
