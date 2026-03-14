import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { DestinationCard } from '../../components/DestinationCard'
import type { DestinationGridProps } from './types'

export async function DestinationGridComponent(props: DestinationGridProps) {
  const {
    heading,
    limit = 6,
    columns = '3',
    showTourCount = true,
  } = props

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'destinations',
    limit: limit || 6,
    sort: '-createdAt',
  })

  const destinations = result.docs

  if (destinations.length === 0) return null

  // Count tours per destination
  const tourCounts: Record<string, number> = {}
  if (showTourCount) {
    for (const dest of destinations) {
      const count = await payload.count({
        collection: 'tours',
        where: {
          and: [
            { destination: { equals: dest.id } },
            { status: { equals: 'published' } },
          ],
        },
      })
      tourCounts[String(dest.id)] = count.totalDocs
    }
  }

  const gridCols: Record<string, string> = {
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section className="px-4 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto">
        {heading && (
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-[var(--color-base-1000)] md:text-4xl lg:text-5xl">
              {heading}
            </h2>
          </div>
        )}

        <div className={`grid gap-6 ${gridCols[columns] || gridCols['3']}`}>
          {destinations.map((dest: any) => {
            const coverUrl = dest.coverImage && typeof dest.coverImage === 'object' ? dest.coverImage.url : undefined
            const coverAlt = dest.coverImage && typeof dest.coverImage === 'object' ? dest.coverImage.alt : undefined

            return (
              <DestinationCard
                key={dest.id}
                name={dest.name}
                slug={dest.slug}
                country={dest.country}
                coverImage={coverUrl}
                coverAlt={coverAlt}
                icon={dest.icon}
                tourCount={showTourCount ? tourCounts[String(dest.id)] : undefined}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
