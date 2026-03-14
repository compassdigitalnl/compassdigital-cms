import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ChefCard } from '@/branches/horeca/components/ChefCard'
import type { HorecaTeamShowcaseProps } from './types'

export async function HorecaTeamShowcaseComponent(props: HorecaTeamShowcaseProps) {
  const { heading, source = 'auto', members: manualMembers, limit = 6, columns = '3' } = props

  let members: any[] = []

  if (source === 'auto') {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'content-team',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { branch: { equals: 'horeca' } },
        ],
      },
      limit: limit || 6,
      sort: 'name',
    })
    members = result.docs
  } else if (source === 'manual' && manualMembers) {
    members = Array.isArray(manualMembers) ? manualMembers.filter((m): m is any => typeof m === 'object' && m !== null) : []
  }

  if (members.length === 0) return null

  const gridColsClasses: Record<string, string> = {
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

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
              <h2 className="mb-4 text-3xl font-extrabold text-[var(--color-base-1000)] md:text-4xl">
                {heading.title}
              </h2>
            )}
            {heading.description && (
              <p className="mx-auto max-w-3xl text-lg text-[var(--color-base-600)]">{heading.description}</p>
            )}
          </div>
        )}

        <div className={`grid ${gridColsClasses[columns || '3']} gap-6`}>
          {members.map((member) => (
            <ChefCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  )
}
