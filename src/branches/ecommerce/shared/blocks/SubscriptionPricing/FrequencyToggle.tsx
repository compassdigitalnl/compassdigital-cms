'use client'

import React from 'react'

interface FrequencyToggleProps {
  frequency: 'monthly' | 'yearly'
  onChange: (frequency: 'monthly' | 'yearly') => void
}

/**
 * FrequencyToggle - Client component for monthly/yearly pricing switch
 *
 * Renders a toggle pill with monthly/yearly options and a savings badge.
 */
export const FrequencyToggle: React.FC<FrequencyToggleProps> = ({ frequency, onChange }) => {
  return (
    <div className="flex items-center justify-center gap-3 mb-10">
      <div className="inline-flex bg-white border border-grey rounded-full p-1 shadow-sm">
        <button
          type="button"
          onClick={() => onChange('monthly')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            frequency === 'monthly'
              ? 'bg-primary text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Maandelijks
        </button>
        <button
          type="button"
          onClick={() => onChange('yearly')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            frequency === 'yearly'
              ? 'bg-primary text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Jaarlijks
        </button>
      </div>
      {frequency === 'yearly' && (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold">
          Bespaar tot 20%
        </span>
      )}
    </div>
  )
}
