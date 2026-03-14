'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SearchHeroProps } from './types'

export const SearchHero: React.FC<SearchHeroProps> = ({
  heading = 'Leer nieuwe vaardigheden, bereik je doelen',
  subheading = 'Ontdek duizenden cursussen van topexperts. Van programmeren tot marketing, van design tot persoonlijke ontwikkeling.',
  categories,
  stats,
  backgroundStyle = 'dark',
  showSearch = true,
  showStats = true,
  className = '',
}) => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCategory) params.set('category', selectedCategory)
    router.push(`/cursussen?${params.toString()}`)
  }

  const isDark = backgroundStyle === 'dark'

  const defaultStats = {
    courses: stats?.courses ?? '1.200+',
    students: stats?.students ?? '45.000+',
    experts: stats?.experts ?? '250+',
  }

  return (
    <section
      className={`relative overflow-hidden px-6 py-16 md:py-20 lg:py-24 ${
        isDark ? 'bg-[#0c1844]' : 'bg-[var(--color-base-50)]'
      } ${className}`}
    >
      {/* Background decorations */}
      {isDark && (
        <>
          <div className="pointer-events-none absolute -right-[150px] -top-[150px] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.15),transparent_60%)]" />
          <div className="pointer-events-none absolute -bottom-[100px] -left-[100px] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.12),transparent_60%)]" />
        </>
      )}

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text column */}
          <div>
            <h1
              className={`mb-5 text-3xl font-extrabold leading-tight md:text-4xl lg:text-5xl ${
                isDark ? 'text-white' : 'text-[var(--color-base-1000)]'
              }`}
            >
              {heading}
            </h1>
            <p
              className={`mb-8 text-base leading-relaxed md:text-lg ${
                isDark ? 'text-white/80' : 'text-[var(--color-base-600)]'
              }`}
            >
              {subheading}
            </p>

            {/* Stats */}
            {showStats && (
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: defaultStats.courses, label: 'Cursussen' },
                  { value: defaultStats.students, label: 'Studenten' },
                  { value: defaultStats.experts, label: 'Experts' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="mb-1 text-2xl font-extrabold text-sky-400 md:text-3xl">
                      {stat.value}
                    </div>
                    <div
                      className={`text-xs ${
                        isDark ? 'text-white/70' : 'text-[var(--color-base-500)]'
                      }`}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search widget */}
          {showSearch && (
            <div>
              <form
                onSubmit={handleSearch}
                className="flex flex-col gap-2 rounded-xl bg-white p-2 shadow-xl md:flex-row"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Zoek cursussen..."
                  className="flex-1 rounded-lg border-0 px-4 py-3 text-sm text-[var(--color-base-1000)] placeholder:text-[var(--color-base-400)] focus:outline-none"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="min-w-[150px] cursor-pointer rounded-lg border-0 bg-[var(--color-base-50)] px-4 py-3 text-sm text-[var(--color-base-1000)] focus:outline-none"
                >
                  <option value="">Alle categorieën</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" x2="16.65" y1="21" y2="16.65" />
                  </svg>
                  Zoeken
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
