import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { TreatmentCard } from '@/branches/beauty/components/TreatmentCard'
import type { TreatmentGridProps } from './types'

export async function TreatmentGridComponent(props: TreatmentGridProps) {
  const {
    heading,
    source = 'auto',
    treatments: manualTreatments,
    limit = 6,
    columns = '3',
  } = props

  let treatments: any[] = []

  if (source === 'auto') {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'content-services',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { branch: { equals: 'beauty' } },
        ],
      },
      limit: limit || 6,
      sort: 'title',
    })
    treatments = result.docs
  } else if (source === 'manual' && manualTreatments) {
    if (Array.isArray(manualTreatments)) {
      treatments = manualTreatments.filter(
        (t): t is any => typeof t === 'object' && t !== null,
      )

      if (treatments.length === 0 && manualTreatments.length > 0) {
        const payload = await getPayload({ config })
        const ids = manualTreatments.filter((id): id is number => typeof id === 'number')
        if (ids.length > 0) {
          const result = await payload.find({
            collection: 'content-services',
            where: { id: { in: ids } },
          })
          treatments = result.docs
        }
      }
    }
  }

  if (treatments.length === 0) return null

  const gridColsClasses: Record<string, string> = {
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }
  const gridClass = gridColsClasses[columns || '3']

  return (
    <section className="px-4 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto">
        {heading && (
          <div className="mb-12 text-center">
            {heading.badge && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
                {heading.badge}
              </div>
            )}
            {heading.title && (
              <h2 className="mb-4 text-3xl font-extrabold text-[var(--color-base-1000)] md:text-4xl lg:text-5xl">
                {heading.title}
              </h2>
            )}
            {heading.description && (
              <p className="mx-auto max-w-3xl text-lg text-[var(--color-base-600)]">{heading.description}</p>
            )}
          </div>
        )}

        <div className={`grid ${gridClass} gap-6`}>
          {treatments.map((treatment) => (
            <TreatmentCard key={treatment.id} treatment={treatment} showCTA />
          ))}
        </div>
      </div>
    </section>
  )
}
