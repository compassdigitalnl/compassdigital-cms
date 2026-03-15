import React from 'react'
import type { LiveSiteButtonProps } from './types'

/**
 * LiveSiteButton — Prominent CTA to visit the live website.
 *
 * External link button with globe icon and arrow.
 * All colors use CSS theme variables.
 */

export const LiveSiteButton: React.FC<LiveSiteButtonProps> = ({
  url,
  label = 'Bekijk live website',
  variant = 'primary',
  className = '',
}) => {
  if (!url) return null

  const isPrimary = variant === 'primary'

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-2.5 font-semibold transition-all duration-200 hover:-translate-y-0.5 ${className}`}
      style={{
        padding: 'var(--sp-3) var(--sp-6)',
        borderRadius: 'var(--r-sm)',
        fontSize: '14px',
        ...(isPrimary
          ? {
              background: 'var(--gradient-primary)',
              color: 'white',
              boxShadow: 'var(--sh-md)',
            }
          : {
              border: '2px solid var(--teal)',
              color: 'var(--teal)',
              backgroundColor: 'transparent',
            }),
      }}
    >
      {/* Globe icon */}
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      {label}
      {/* External arrow */}
      <svg
        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
      </svg>
    </a>
  )
}

export default LiveSiteButton
