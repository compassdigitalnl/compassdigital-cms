'use client'

import React, { useState } from 'react'

interface BillingToggleProps {
  saveBadge?: string | null
  children: (isYearly: boolean) => React.ReactNode
}

/**
 * BillingToggle - Client component for monthly/yearly pricing switch
 *
 * Uses render prop pattern to pass billing state to children,
 * allowing server-rendered plan cards to react to toggle state.
 */
export const BillingToggle: React.FC<BillingToggleProps> = ({ saveBadge, children }) => {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <>
      {/* Toggle UI */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span
          className={`text-sm font-semibold transition-colors duration-200 ${
            !isYearly ? 'text-navy' : 'text-grey-mid'
          }`}
        >
          Maandelijks
        </span>

        <button
          type="button"
          onClick={() => setIsYearly(!isYearly)}
          className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal/50 ${
            isYearly ? 'bg-teal' : 'bg-grey-light'
          }`}
          aria-label={isYearly ? 'Schakel naar maandelijks' : 'Schakel naar jaarlijks'}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
              isYearly ? 'translate-x-7' : 'translate-x-0'
            }`}
          />
        </button>

        <span
          className={`text-sm font-semibold transition-colors duration-200 ${
            isYearly ? 'text-navy' : 'text-grey-mid'
          }`}
        >
          Jaarlijks
        </span>

        {isYearly && saveBadge && (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-teal/10 text-teal text-xs font-bold">
            {saveBadge}
          </span>
        )}
      </div>

      {/* Render children with billing state */}
      {children(isYearly)}
    </>
  )
}
