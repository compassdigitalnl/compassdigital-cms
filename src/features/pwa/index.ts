/**
 * PWA Feature — barrel export
 *
 * Components and utilities for Progressive Web App support.
 */

// ─── Components ──────────────────────────────────────────────────
export { PWAHead } from './components/PWAHead'
export { ServiceWorkerRegistration } from './components/ServiceWorkerRegistration'
export { OfflineFallback } from './components/OfflineFallback'
export { InstallPrompt } from './components/InstallPrompt'
export { PushPermissionBanner } from './components/PushPermissionBanner'

// ─── Utilities ───────────────────────────────────────────────────
export { generateManifest } from './lib/manifest-generator'
export { generateIcon, generateFallbackIcon } from './lib/icon-generator'
export { registerServiceWorker, unregisterServiceWorker } from './lib/sw-registration'
export { isOnline, onOffline, onOnline } from './lib/offline-handler'

// ─── Cache config ────────────────────────────────────────────────
export {
  CACHE_NAME,
  STATIC_CACHE,
  IMAGE_CACHE,
  API_CACHE,
  CACHE_STRATEGIES,
  PRECACHE_URLS,
} from './lib/cache-strategies'

// ─── Push Notifications ─────────────────────────────────────────
export { sendPushNotification, sendPushToUser, sendPushToAll } from './lib/push-service'

// ─── Collections ────────────────────────────────────────────────
export { PushSubscriptions } from './collections/PushSubscriptions'

// ─── Types ───────────────────────────────────────────────────────
export type {
  WebAppManifest,
  ManifestIcon,
  IconPurpose,
  IconSize,
  CacheStrategy,
  CacheStrategyConfig,
  PWASettings,
} from './lib/types'

export type {
  PushSubscriptionData,
  NotificationPayload,
} from './lib/push-types'

export { PWA_ICON_SIZES, MANIFEST_ICON_SIZES, DEFAULT_THEME_COLOR, DEFAULT_BACKGROUND_COLOR } from './lib/types'
