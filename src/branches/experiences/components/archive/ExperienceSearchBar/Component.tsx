'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import type { ExperienceSearchBarProps } from './types'

export function ExperienceSearchBar({
  categories = [],
  onSearch,
  className = '',
}: ExperienceSearchBarProps) {
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [groupSize, setGroupSize] = useState('')

  const handleSearch = () => {
    onSearch?.({
      category: category || undefined,
      date: date || undefined,
      groupSize: groupSize || undefined,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl shadow-lg p-3 ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3">
        {/* Type uitje */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            Type uitje
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-[var(--color-navy)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)] focus:border-[var(--color-teal)]"
          >
            <option value="">Alle categorieën</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Wanneer? */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            Wanneer?
          </label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Kies een datum"
            onFocus={(e) => {
              e.currentTarget.type = 'date'
            }}
            onBlur={(e) => {
              if (!e.currentTarget.value) e.currentTarget.type = 'text'
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-[var(--color-navy)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)] focus:border-[var(--color-teal)]"
          />
        </div>

        {/* Groepsgrootte */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            Groepsgrootte
          </label>
          <select
            value={groupSize}
            onChange={(e) => setGroupSize(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-[var(--color-navy)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)] focus:border-[var(--color-teal)]"
          >
            <option value="">Aantal personen</option>
            <option value="2-10">2 - 10 personen</option>
            <option value="10-20">10 - 20 personen</option>
            <option value="20-50">20 - 50 personen</option>
            <option value="50+">50+ personen</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--color-teal)] text-white font-bold text-sm hover:opacity-90 transition-opacity h-[42px]"
          >
            <Search className="w-4 h-4" />
            Zoeken
          </button>
        </div>
      </div>
    </div>
  )
}
