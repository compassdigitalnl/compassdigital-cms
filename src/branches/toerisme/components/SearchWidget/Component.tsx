'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SearchWidgetProps } from './types'

export const SearchWidget: React.FC<SearchWidgetProps> = ({
  onSearch,
  className = '',
}) => {
  const router = useRouter()
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [travelers, setTravelers] = useState(2)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (onSearch) {
      onSearch({ destination, date, travelers })
      return
    }

    // Default: navigate to search results
    const params = new URLSearchParams()
    if (destination) params.set('bestemming', destination)
    if (date) params.set('datum', date)
    if (travelers) params.set('reizigers', String(travelers))
    router.push(`/reizen?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-4 shadow-lg md:p-6 ${className}`}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-4">
        {/* Destination */}
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-base-500)]">
            Bestemming
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-base-400)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Waar wil je naartoe?"
              className="w-full rounded-lg border border-[var(--color-base-200)] py-3 pl-10 pr-3 text-sm text-[var(--color-base-1000)] placeholder-[var(--color-base-400)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        {/* Date */}
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-base-500)]">
            Vertrekdatum
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-base-400)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-base-200)] py-3 pl-10 pr-3 text-sm text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        {/* Travelers */}
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-base-500)]">
            Reizigers
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-base-400)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            <select
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              className="w-full appearance-none rounded-lg border border-[var(--color-base-200)] py-3 pl-10 pr-8 text-sm text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'reiziger' : 'reizigers'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search button */}
        <div className="flex flex-col justify-end">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            Zoek reizen
          </button>
        </div>
      </div>
    </form>
  )
}
