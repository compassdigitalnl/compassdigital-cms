import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { EventCard } from '@/branches/horeca/components/EventCard'
import type { EventsGridProps } from './types'

export async function EventsGridComponent(props: EventsGridProps) {
  const {
    heading,
    source = 'auto',
    events: manualEvents,
    limit = 6,
    columns = '3',
  } = props

  let events: any[] = []

  if (source === 'auto') {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'content-activities',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { branch: { equals: 'horeca' } },
        ],
      },
      limit: limit || 6,
      sort: '-startDate',
    })
    events = result.docs
  } else if (source === 'manual' && manualEvents) {
    if (Array.isArray(manualEvents)) {
      events = manualEvents.filter(
        (e): e is any => typeof e === 'object' && e !== null,
      )

      if (events.length === 0 && manualEvents.length > 0) {
        const payload = await getPayload({ config })
        const ids = manualEvents.filter((id): id is number => typeof id === 'number')
        if (ids.length > 0) {
          const result = await payload.find({
            collection: 'content-activities',
            where: { id: { in: ids } },
          })
          events = result.docs
        }
      }
    }
  }

  if (events.length === 0) return null

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
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  )
}
