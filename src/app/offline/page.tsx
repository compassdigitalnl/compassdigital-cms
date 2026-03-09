/**
 * Offline Fallback Page
 *
 * Shown by the service worker when a navigation request fails
 * and no cached version is available.
 *
 * Uses only inline styles — CSS files may not be cached when offline.
 * Works without JavaScript (basic HTML/CSS).
 * All text in Dutch.
 */

export const metadata = {
  title: 'Je bent offline',
}

export default function OfflinePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#f9fafb',
        color: '#1f2937',
      }}
    >
      <main
        style={{
          textAlign: 'center',
          padding: '2rem',
          maxWidth: '28rem',
        }}
      >
        {/* Offline icon */}
        <div style={{ marginBottom: '1.5rem' }}>
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ margin: '0 auto' }}
          >
            <circle cx="40" cy="40" r="38" stroke="#d1d5db" strokeWidth="2" fill="none" />
            <path
              d="M24 28c4.5-4 10-6.5 16-6.5s11.5 2.5 16 6.5"
              stroke="#9ca3af"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M30 36c2.8-2.5 6.2-4 10-4s7.2 1.5 10 4"
              stroke="#9ca3af"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M36 44c1.2-1 2.5-1.5 4-1.5s2.8.5 4 1.5"
              stroke="#9ca3af"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="40" cy="50" r="2.5" fill="#9ca3af" />
            <line
              x1="20"
              y1="58"
              x2="60"
              y2="22"
              stroke="#ef4444"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            color: '#111827',
          }}
        >
          Je bent offline
        </h1>

        <p
          style={{
            fontSize: '1rem',
            lineHeight: 1.6,
            color: '#6b7280',
            marginBottom: '2rem',
          }}
        >
          Controleer je internetverbinding en probeer het opnieuw.
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: '#ffffff',
            backgroundColor: '#0D4F4F',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M2 8a6 6 0 0 1 10.3-4.2L14 2v4h-4l1.7-1.7A4.5 4.5 0 1 0 12.5 8H14a6 6 0 0 1-12 0z"
              fill="currentColor"
            />
          </svg>
          Opnieuw proberen
        </button>
      </main>
    </div>
  )
}
