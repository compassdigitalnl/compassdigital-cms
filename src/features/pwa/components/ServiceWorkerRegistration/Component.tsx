'use client'

/**
 * ServiceWorkerRegistration — Client Component
 *
 * Registers the service worker on mount and listens for controller changes
 * (new SW version activated) to notify the user about updates.
 * Renders nothing — invisible infrastructure component.
 */

import { useEffect } from 'react'
import { registerServiceWorker } from '../../lib/sw-registration'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Only register in production to avoid caching issues during development
    if (process.env.NODE_ENV !== 'production') return

    registerServiceWorker()

    // Listen for a new service worker taking control (update available)
    const handleControllerChange = () => {
      // A new SW has taken over — the page will use updated resources on next navigation.
      // We could show a toast here, but for now we let it happen silently.
      console.info('[PWA] Nieuwe versie beschikbaar. Vernieuw de pagina voor updates.')
    }

    navigator.serviceWorker?.addEventListener('controllerchange', handleControllerChange)

    return () => {
      navigator.serviceWorker?.removeEventListener('controllerchange', handleControllerChange)
    }
  }, [])

  return null
}
