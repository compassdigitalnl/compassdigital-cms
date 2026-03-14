'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { ContinentPillsProps } from './types'

const CONTINENTS = [
  { label: 'Alles', value: null },
  { label: 'Europa', value: 'europa' },
  { label: 'Azië', value: 'azie' },
  { label: 'Afrika', value: 'afrika' },
  { label: 'Amerika', value: 'amerika' },
  { label: 'Oceanië', value: 'oceanie' },
]

export const ContinentPills: React.FC<ContinentPillsProps> = ({
  selected: selectedProp,
  onChange,
  className = '',
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Use prop if provided, otherwise read from URL
  const selected = selectedProp !== undefined ? selectedProp : searchParams.get('continent')

  const handleClick = (value: string | null) => {
    if (onChange) {
      onChange(value)
      return
    }

    // Default: update URL params
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('continent', value)
    } else {
      params.delete('continent')
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`} role="tablist" aria-label="Filter op continent">
      {CONTINENTS.map((continent) => {
        const isActive = continent.value === selected || (continent.value === null && !selected)
        return (
          <button
            key={continent.label}
            role="tab"
            aria-selected={isActive}
            onClick={() => handleClick(continent.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              isActive
                ? 'text-white shadow-md'
                : 'border border-[var(--color-base-200)] bg-[var(--color-base-0)] text-[var(--color-base-700)] hover:border-[var(--color-primary)]/50 hover:text-[var(--color-primary)]'
            }`}
            style={isActive ? { backgroundColor: 'var(--color-primary)' } : undefined}
          >
            {continent.label}
          </button>
        )
      })}
    </div>
  )
}
