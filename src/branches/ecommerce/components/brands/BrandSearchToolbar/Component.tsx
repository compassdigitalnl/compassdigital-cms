'use client'

import React from 'react'
import { Search } from 'lucide-react'
import type { BrandSearchToolbarProps } from './types'

export const BrandSearchToolbar: React.FC<BrandSearchToolbarProps> = ({
  totalCount,
  searchQuery,
  onSearchChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Search input */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-theme-grey-mid" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Zoek een merk…"
          className="h-11 w-full rounded-xl border-2 border-[var(--grey,#E8ECF1)] bg-white pl-12 pr-4 text-sm text-theme-navy outline-none transition-all duration-200 placeholder:text-theme-grey-mid focus:border-theme-teal focus:shadow-[0_0_0_4px_rgba(0,137,123,0.12)]"
          aria-label="Zoek een merk"
        />
      </div>

      {/* Count */}
      <span className="shrink-0 text-sm text-theme-grey-mid">
        <span className="font-bold text-theme-navy">{totalCount}</span> merken gevonden
      </span>
    </div>
  )
}
