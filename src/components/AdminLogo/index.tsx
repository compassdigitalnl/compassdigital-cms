'use client'
import React from 'react'

/**
 * Custom Admin Logo Component - Contyzr Branding
 * Modern, professional logo for the CMS admin panel
 */
export const AdminLogo: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.5rem 0',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
            fill="white"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Text */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          lineHeight: '1.2',
        }}
      >
        <span
          style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: 'var(--theme-text)',
            letterSpacing: '-0.02em',
          }}
        >
          Contyzr
        </span>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: '500',
            color: 'var(--theme-text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          CMS
        </span>
      </div>
    </div>
  )
}
