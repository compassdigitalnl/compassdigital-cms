'use client'
import React from 'react'

/**
 * Custom Admin Logo — Contyzr branding for dark sidebar
 */
export const AdminLogo: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.25rem 0',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '2rem',
          height: '2rem',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </div>

      {/* Text */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
        <span
          style={{
            fontSize: '0.9375rem',
            fontWeight: 800,
            color: '#f1f5f9',
            letterSpacing: '-0.02em',
          }}
        >
          Contyzr
        </span>
        <span
          style={{
            fontSize: '0.5625rem',
            fontWeight: 500,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Content Management
        </span>
      </div>
    </div>
  )
}
