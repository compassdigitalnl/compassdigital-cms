import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { ZorgTreatmentGridProps } from './types'

export async function ZorgTreatmentGridComponent(props: ZorgTreatmentGridProps) {
  const {
    heading,
    source = 'auto',
    treatments: manualTreatments,
    limit = 6,
    columns = '3',
    showInsurance = true,
  } = props

  let treatments: any[] = []

  if (source === 'auto') {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'content-services',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { branch: { equals: 'zorg' } },
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
            <div
              key={treatment.id}
              className="group overflow-hidden rounded-2xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] shadow-sm transition-all duration-300 hover:shadow-lg hover:border-[var(--color-primary)]/30"
            >
              <div className="p-6">
                <h3 className="mb-2 text-lg font-bold text-[var(--color-base-1000)]">
                  {treatment.title}
                </h3>
                {treatment.shortDescription && (
                  <p className="mb-4 text-sm text-[var(--color-base-600)] line-clamp-2">
                    {treatment.shortDescription}
                  </p>
                )}

                <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-[var(--color-base-500)]">
                  {treatment.duration && (
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      {treatment.duration} min
                    </span>
                  )}
                  {treatment.price != null && (
                    <span className="font-semibold text-[var(--color-base-1000)]">
                      &euro; {Number(treatment.price).toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </div>

                {showInsurance && treatment.insurance && (
                  <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                    Vergoed door verzekering
                  </div>
                )}

                <a
                  href={treatment.slug ? `/behandelingen/${treatment.slug}` : '#'}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover,var(--color-primary))]"
                >
                  Afspraak maken
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
