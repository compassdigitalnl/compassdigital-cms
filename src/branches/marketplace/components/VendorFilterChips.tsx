'use client'

import { useState } from 'react'
import { Grid3x3, Award, ShieldCheck, Leaf, Truck, GraduationCap } from 'lucide-react'

interface FilterChip {
  id: string
  label: string
  icon: React.ReactNode
}

interface VendorFilterChipsProps {
  onFilterChange?: (activeFilter: string) => void
}

const filters: FilterChip[] = [
  { id: 'all', label: 'Alle', icon: <Grid3x3 className="w-3.5 h-3.5" /> },
  { id: 'premium', label: 'Premium partners', icon: <Award className="w-3.5 h-3.5" /> },
  { id: 'ce-certified', label: 'CE gecertificeerd', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  { id: 'sustainable', label: 'Duurzaam', icon: <Leaf className="w-3.5 h-3.5" /> },
  { id: 'direct-delivery', label: 'Direct leverbaar', icon: <Truck className="w-3.5 h-3.5" /> },
  { id: 'has-workshops', label: 'Met workshops', icon: <GraduationCap className="w-3.5 h-3.5" /> },
]

export function VendorFilterChips({ onFilterChange }: VendorFilterChipsProps) {
  const [active, setActive] = useState('all')

  const handleClick = (id: string) => {
    setActive(id)
    onFilterChange?.(id)
  }

  return (
    <div className="flex gap-1.5 mb-5 flex-wrap">
      {filters.map((filter) => {
        const isActive = active === filter.id
        return (
          <button
            key={filter.id}
            onClick={() => handleClick(filter.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all border-[1.5px]"
            style={{
              backgroundColor: isActive ? 'var(--color-primary)' : 'white',
              color: isActive ? 'white' : 'var(--color-text-primary)',
              borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
            }}
          >
            {filter.icon}
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}
