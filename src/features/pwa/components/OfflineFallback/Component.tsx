'use client'

/**
 * OfflineFallback — Client Component
 *
 * Shows a fixed bottom banner when the user goes offline.
 * Auto-hides when connectivity is restored.
 * All text in Dutch.
 */

import { useState, useEffect } from 'react'
import { isOnline, onOffline, onOnline } from '../../lib/offline-handler'

export function OfflineFallback() {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    // Set initial state
    setOffline(!isOnline())

    const cleanupOffline = onOffline(() => setOffline(true))
    const cleanupOnline = onOnline(() => setOffline(false))

    return () => {
      cleanupOffline()
      cleanupOnline()
    }
  }, [])

  if (!offline) return null

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
        backgroundColor: '#92400e',
        color: '#ffffff',
        fontSize: '0.875rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        lineHeight: 1.5,
        textAlign: 'center',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.15)',
      }}
    >
      {/* Warning icon (SVG inline — no external dependencies) */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <path
          d="M10 2L1 18h18L10 2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="none"
        />
        <path d="M10 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="14.5" r="0.75" fill="currentColor" />
      </svg>
      <span>Je bent offline. Sommige functies zijn mogelijk niet beschikbaar.</span>
    </div>
  )
}
