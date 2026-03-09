/**
 * Service Worker Registration Utility
 *
 * Client-side helpers for registering and unregistering the PWA service worker.
 * Must only be called in the browser (not during SSR).
 */

/**
 * Register the service worker at /sw.js.
 *
 * @returns The ServiceWorkerRegistration if successful, null otherwise.
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined') return null
  if (!('serviceWorker' in navigator)) return null

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })

    // Check for updates periodically (every 60 minutes)
    setInterval(
      () => {
        registration.update().catch(() => {
          // Silent fail — network may be unavailable
        })
      },
      60 * 60 * 1000,
    )

    return registration
  } catch (error) {
    console.error('[PWA] Service Worker registratie mislukt:', error)
    return null
  }
}

/**
 * Unregister all service workers for this origin.
 *
 * Useful for debugging or when disabling PWA features.
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  if (!('serviceWorker' in navigator)) return false

  try {
    const registrations = await navigator.serviceWorker.getRegistrations()
    const results = await Promise.all(registrations.map((reg) => reg.unregister()))
    return results.every(Boolean)
  } catch (error) {
    console.error('[PWA] Service Worker deregistratie mislukt:', error)
    return false
  }
}
