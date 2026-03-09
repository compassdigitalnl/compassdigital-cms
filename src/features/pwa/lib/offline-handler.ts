/**
 * Offline Detection Utility
 *
 * Provides helpers for detecting online/offline state and subscribing
 * to connectivity changes. Browser-only — returns safe defaults on server.
 */

/**
 * Check if the browser is currently online.
 *
 * @returns true if online (or if running on server), false if offline
 */
export function isOnline(): boolean {
  if (typeof window === 'undefined') return true
  return navigator.onLine
}

/**
 * Subscribe to offline events.
 *
 * @param callback - Called when the browser goes offline
 * @returns Cleanup function to remove the listener
 */
export function onOffline(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {}

  window.addEventListener('offline', callback)
  return () => window.removeEventListener('offline', callback)
}

/**
 * Subscribe to online events.
 *
 * @param callback - Called when the browser comes back online
 * @returns Cleanup function to remove the listener
 */
export function onOnline(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {}

  window.addEventListener('online', callback)
  return () => window.removeEventListener('online', callback)
}
