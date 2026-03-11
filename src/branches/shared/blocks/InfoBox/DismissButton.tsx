'use client'

import React, { useState } from 'react'

interface DismissButtonProps {
  variant: 'info' | 'success' | 'warning' | 'error'
}

const hoverColors: Record<string, string> = {
  info: 'hover:bg-blue-200',
  success: 'hover:bg-green-200',
  warning: 'hover:bg-amber-200',
  error: 'hover:bg-red-200',
}

/**
 * Client component for dismissing InfoBox notifications.
 * Hides the parent InfoBox when clicked.
 */
export function DismissButton({ variant }: DismissButtonProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) {
    // Hide the entire parent by returning a script-less signal
    // The parent InfoBox wraps this in a container that checks dismissed state
    return null
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDismissed(true)
        // Hide parent element
        const parent = document.querySelector('.info-box-block')
        if (parent instanceof HTMLElement) {
          parent.style.display = 'none'
        }
      }}
      className={`shrink-0 rounded p-1 transition-colors ${hoverColors[variant] || 'hover:bg-black/10'}`}
      aria-label="Sluiten"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  )
}
