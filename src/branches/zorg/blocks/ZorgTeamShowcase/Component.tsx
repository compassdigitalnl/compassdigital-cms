import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { ZorgTeamShowcaseProps } from './types'

export async function ZorgTeamShowcaseComponent(props: ZorgTeamShowcaseProps) {
  const { heading, source = 'auto', members: manualMembers, limit = 6, columns = '3', showSpecialties = true } = props

  let members: any[] = []

  if (source === 'auto') {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'content-team',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { branch: { equals: 'zorg' } },
        ],
      },
      limit: limit || 6,
      sort: 'name',
    })
    members = result.docs
  } else if (source === 'manual' && manualMembers) {
    members = Array.isArray(manualMembers) ? manualMembers.filter((m): m is any => typeof m === 'object' && m !== null) : []

    if (members.length === 0 && Array.isArray(manualMembers) && manualMembers.length > 0) {
      const payload = await getPayload({ config })
      const ids = manualMembers.filter((id): id is number => typeof id === 'number')
      if (ids.length > 0) {
        const result = await payload.find({
          collection: 'content-team',
          where: { id: { in: ids } },
        })
        members = result.docs
      }
    }
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
          {members.map((member) => {
            const photo = typeof member.photo === 'object' && member.photo?.url ? member.photo : null

            return (
              <div
                key={member.id}
                className="group overflow-hidden rounded-2xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] shadow-sm transition-all duration-300 hover:shadow-lg hover:border-[var(--color-primary)]/30"
              >
                {photo && (
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={photo.url}
                      alt={member.name || ''}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[var(--color-base-1000)]">
                    {member.name}
                  </h3>
                  {member.role && (
                    <p className="mt-1 text-sm font-medium text-[var(--color-primary)]">
                      {member.role}
                    </p>
                  )}
                  {member.experience && (
                    <p className="mt-2 text-sm text-[var(--color-base-500)]">
                      {member.experience}
                    </p>
                  )}

                  {showSpecialties && member.specialties && Array.isArray(member.specialties) && member.specialties.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {member.specialties.map((specialty: any, index: number) => {
                        const label = typeof specialty === 'string' ? specialty : specialty?.label || specialty?.name || ''
                        if (!label) return null
                        return (
                          <span
                            key={index}
                            className="inline-flex rounded-full bg-[var(--color-primary)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--color-primary)]"
                          >
                            {label}
                          </span>
                        )
                      })}
                    </div>
                  )}

                  {member.bookable && (
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-green-600">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                      </svg>
                      Direct online inplanbaar
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
