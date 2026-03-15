'use client'

import { Search } from 'lucide-react'

interface VendorSearchToolbarProps {
  totalCount: number
  onSearch?: (query: string) => void
  onSortChange?: (sort: string) => void
}

export function VendorSearchToolbar({ totalCount, onSearch, onSortChange }: VendorSearchToolbarProps) {
  return (
    <div className="flex gap-3 mb-5 flex-wrap items-center">
      <div className="relative flex-1 min-w-[200px] max-w-[360px]">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: 'var(--color-text-muted)' }}
        />
        <input
          type="text"
          placeholder="Zoek leverancier op naam…"
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-full h-11 pl-11 pr-4 rounded-xl text-sm border-2 transition-all focus:outline-none"
          style={{
            borderColor: 'var(--color-border)',
            backgroundColor: 'white',
            color: 'var(--color-text-primary)',
          }}
        />
      </div>
      <select
        onChange={(e) => onSortChange?.(e.target.value)}
        className="h-11 px-3.5 pr-9 rounded-xl text-sm font-semibold border-2 appearance-none bg-white cursor-pointer"
        style={{
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-primary)',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2394A3B8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
        }}
      >
        <option value="recommended">Sorteren: Aanbevolen</option>
        <option value="name">Naam A-Z</option>
        <option value="products">Meeste producten</option>
        <option value="rating">Hoogste beoordeling</option>
      </select>
      <div className="ml-auto text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>
        {totalCount} leveranciers
      </div>
    </div>
  )
}
