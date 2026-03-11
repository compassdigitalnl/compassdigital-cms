/**
 * CasesGridComponent - Cases grid block (SERVER COMPONENT)
 */

import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CaseCard } from '@/branches/professional-services/components/CaseCard'
import type { CasesGridProps, ProfessionalCase } from './types'

export async function CasesGridComponent(props: CasesGridProps) {
  const {
    heading,
    casesSource = 'auto',
    cases: manualCases,
    service,
    limit = 6,
    columns = '3',
    ctaButton,
  } = props

  let cases: ProfessionalCase[] = []
  const payload = await getPayload({ config })

  if (casesSource === 'auto') {
    const result = await payload.find({
      collection: 'professional-cases',
      where: { status: { equals: 'published' } },
      limit: limit || 6,
      sort: '-createdAt',
    })
    cases = result.docs
  } else if (casesSource === 'featured') {
    const result = await payload.find({
      collection: 'professional-cases',
      where: {
        and: [
          { status: { equals: 'published' } },
          { featured: { equals: true } },
        ],
      },
      limit: limit || 6,
      sort: '-createdAt',
    })
    cases = result.docs
  } else if (casesSource === 'service' && service) {
    const serviceId = typeof service === 'object' ? service.id : service
    const result = await payload.find({
      collection: 'professional-cases',
      where: {
        and: [
          { status: { equals: 'published' } },
          { category: { equals: serviceId } },
        ],
      },
      limit: limit || 6,
      sort: '-createdAt',
    })
    cases = result.docs
  } else if (casesSource === 'manual' && manualCases) {
    if (Array.isArray(manualCases)) {
      cases = manualCases.filter(
        (c): c is ProfessionalCase => typeof c === 'object' && c !== null,
      )

      if (cases.length === 0 && manualCases.length > 0) {
        const ids = manualCases.filter((id): id is number => typeof id === 'number')
        if (ids.length > 0) {
          const result = await payload.find({
            collection: 'professional-cases',
            where: { id: { in: ids } },
          })
          cases = result.docs
        }
      }
    }
  }

  if (cases.length === 0) {
    return (
      <section className="py-12 md:py-16 lg:py-20 px-4">
        <div className="container mx-auto text-center">
          <p className="text-grey-mid">Geen cases beschikbaar.</p>
        </div>
      </section>
    )
  }

  const gridColsClasses = {
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }
  const gridClass = gridColsClasses[columns || '3'] || gridColsClasses['3']

  return (
    <section className="py-12 md:py-16 lg:py-20 px-4">
      <div className="container mx-auto">
        {heading && (
          <div className="text-center mb-12">
            {heading.badge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-glow border border-primary/20 rounded-full text-sm text-primary font-semibold mb-4">
                <span>{heading.badge}</span>
              </div>
            )}

            {heading.title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-secondary-color mb-4">
                {heading.title}
              </h2>
            )}

            {heading.description && (
              <p className="text-lg text-grey-mid max-w-3xl mx-auto">{heading.description}</p>
            )}
          </div>
        )}

        <div className={`grid ${gridClass} gap-6`}>
          {cases.map((caseItem) => (
            <CaseCard key={caseItem.id} case={caseItem} variant="default" />
          ))}
        </div>

        {ctaButton?.enabled && (
          <div className="text-center mt-12">
            <Link
              href={ctaButton.link || '/cases'}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              {ctaButton.text || 'Bekijk alle cases'}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
