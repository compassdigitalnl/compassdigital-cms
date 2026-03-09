/**
 * Service Worker — CompassDigital PWA
 *
 * Caching strategies:
 *   - Navigation requests: network-first, fall back to /offline
 *   - Static assets (_next/static): cache-first
 *   - Images: cache-first with network fallback
 *   - API routes: network-only (never cache)
 *
 * Also handles push notifications and notification clicks.
 */

const CACHE_VERSION = 1
const CACHE_NAME = `compassdigital-v${CACHE_VERSION}`
const STATIC_CACHE = `static-v${CACHE_VERSION}`
const IMAGE_CACHE = `images-v${CACHE_VERSION}`

/** URLs to pre-cache during install */
const PRECACHE_URLS = ['/offline']

// ─── Install ─────────────────────────────────────────────────────

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  )
})

// ─── Activate ────────────────────────────────────────────────────

self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, STATIC_CACHE, IMAGE_CACHE]

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => !currentCaches.includes(name))
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

// ─── Fetch ───────────────────────────────────────────────────────

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) return

  // ── API routes: network-only ──────────────────────────────
  if (url.pathname.startsWith('/api/')) {
    return
  }

  // ── Admin panel: network-only ─────────────────────────────
  if (url.pathname.startsWith('/admin')) {
    return
  }

  // ── Navigation requests: network-first with offline fallback ─
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful navigation responses
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() =>
          // Try cache first, then offline fallback
          caches.match(request).then((cached) => cached || caches.match('/offline')),
        ),
    )
    return
  }

  // ── Static assets (_next/static): cache-first ─────────────
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const responseClone = response.clone()
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(request, responseClone)
              })
            }
            return response
          }),
      ),
    )
    return
  }

  // ── Images: cache-first with network fallback ─────────────
  if (
    url.pathname.startsWith('/media/') ||
    url.pathname.startsWith('/_next/image') ||
    url.pathname.match(/\.(png|jpg|jpeg|gif|webp|avif|svg|ico)$/)
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const responseClone = response.clone()
              caches.open(IMAGE_CACHE).then((cache) => {
                cache.put(request, responseClone)
              })
            }
            return response
          }),
      ),
    )
    return
  }

  // ── Everything else: network-first ────────────────────────
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone)
          })
        }
        return response
      })
      .catch(() => caches.match(request)),
  )
})

// ─── Push Notifications ──────────────────────────────────────────

self.addEventListener('push', (event) => {
  if (!event.data) return

  let data
  try {
    data = event.data.json()
  } catch {
    data = {
      title: 'Nieuw bericht',
      body: event.data.text(),
    }
  }

  const options = {
    body: data.body || '',
    icon: data.icon || '/api/pwa/icons?size=192',
    badge: data.badge || '/api/pwa/icons?size=72',
    data: {
      url: data.url || '/',
      ...(data.data || {}),
    },
    tag: data.tag || 'default',
    renotify: Boolean(data.tag),
    vibrate: [200, 100, 200],
  }

  event.waitUntil(self.registration.showNotification(data.title || 'Melding', options))
})

// ─── Notification Click ──────────────────────────────────────────

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const targetUrl = event.notification.data?.url || '/'

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If an existing window is open at this URL, focus it
        for (const client of clientList) {
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus()
          }
        }
        // If any window is open on same origin, navigate + focus
        for (const client of clientList) {
          if (client.url.startsWith(self.location.origin) && 'focus' in client) {
            client.navigate(targetUrl)
            return client.focus()
          }
        }
        // Otherwise open a new window
        return self.clients.openWindow(targetUrl)
      }),
  )
})

// ─── Push Subscription Change ────────────────────────────────────
// Fired when the push subscription is invalidated by the push service.
// Automatically re-subscribes and sends the new subscription to the server.

self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    self.registration.pushManager
      .subscribe(event.oldSubscription?.options || { userVisibleOnly: true })
      .then((subscription) => {
        const subscriptionJSON = subscription.toJSON()
        return fetch('/api/pwa/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            endpoint: subscriptionJSON.endpoint,
            keys: {
              p256dh: subscriptionJSON.keys?.p256dh || '',
              auth: subscriptionJSON.keys?.auth || '',
            },
          }),
        })
      })
      .catch((err) => {
        console.error('[sw] Push subscription change failed:', err)
      }),
  )
})
