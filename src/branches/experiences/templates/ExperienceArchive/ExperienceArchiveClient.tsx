'use client'

import { useState } from 'react'
import { ExperienceCard } from '@/branches/experiences/components/archive/ExperienceCard'
import { ExperienceFilterSidebar } from '@/branches/experiences/components/archive/ExperienceFilterSidebar'
import type { ExperienceFilters } from '@/branches/experiences/components/archive/ExperienceFilterSidebar/types'

interface ExperienceArchiveClientProps {
  initialExperiences: any[]
  categories: { label: string; value: string; count?: number }[]
  locations: { label: string; value: string; count?: number }[]
}

export function ExperienceArchiveClient({
  initialExperiences,
  categories,
  locations,
}: ExperienceArchiveClientProps) {
  const [filters, setFilters] = useState<ExperienceFilters>({})

  // Client-side filtering
  let filtered = initialExperiences

  if (filters.category) {
    filtered = filtered.filter((exp) => {
      const cat = typeof exp.category === 'object' ? exp.category?.slug : exp.category
      return cat === filters.category
    })
  }

  if (filters.priceRange) {
    filtered = filtered.filter(
      (exp) => exp.pricePerPerson >= (filters.priceRange![0]) && exp.pricePerPerson <= (filters.priceRange![1])
    )
  }

  if (filters.location) {
    filtered = filtered.filter((exp) => exp.location === filters.location)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filter Sidebar */}
      <div className="lg:w-[280px] flex-shrink-0">
        <ExperienceFilterSidebar
          categories={categories}
          locations={locations}
          durations={[
            { label: '1-2 uur', value: '1-2' },
            { label: '2-4 uur', value: '2-4' },
            { label: '4+ uur', value: '4+' },
            { label: 'Hele dag', value: 'full-day' },
          ]}
          groupSizes={[
            { label: '2-10 personen', value: '2-10' },
            { label: '10-25 personen', value: '10-25' },
            { label: '25-50 personen', value: '25-50' },
            { label: '50+ personen', value: '50+' },
          ]}
          filters={filters}
          onFilterChange={setFilters}
          resultCount={filtered.length}
        />
      </div>

      {/* Experience Grid */}
      <div className="flex-1">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Geen ervaringen gevonden</p>
            <button
              onClick={() => setFilters({})}
              className="mt-4 text-sm font-medium"
              style={{ color: 'var(--color-teal, #00a39b)' }}
            >
              Filters wissen
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((exp: any) => {
              const categoryObj = typeof exp.category === 'object' ? exp.category : null
              const thumbnail = typeof exp.featuredImage === 'object' ? exp.featuredImage?.url : undefined

              return (
                <ExperienceCard
                  key={exp.id}
                  title={exp.title}
                  slug={exp.slug}
                  category={categoryObj?.name}
                  thumbnail={thumbnail}
                  duration={exp.duration}
                  minPersons={exp.minPersons}
                  maxPersons={exp.maxPersons}
                  rating={0}
                  reviewCount={0}
                  pricePerPerson={exp.pricePerPerson || 0}
                  priceType={exp.priceType}
                  popular={exp.popular}
                  featured={exp.featured}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
