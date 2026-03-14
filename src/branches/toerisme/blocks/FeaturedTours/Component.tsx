import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { TourCard } from '../../components/TourCard'
import type { FeaturedToursProps } from './types'

export async function FeaturedToursComponent(props: FeaturedToursProps) {
  const {
    heading,
    limit = 4,
    columns = '4',
    continentFilter,
    showPrice = true,
    showRating = true,
  } = props

  const payload = await getPayload({ config })

  const whereConditions: any[] = [
    { featured: { equals: true } },
    { status: { equals: 'published' } },
  ]

  // Filter by continent via destination relationship
  if (continentFilter) {
    // First find destinations with this continent
    const destinations = await payload.find({
      collection: 'destinations',
      where: { continent: { equals: continentFilter } },
      limit: 100,
    })
    const destIds = destinations.docs.map((d: any) => d.id)
    if (destIds.length > 0) {
      whereConditions.push({ destination: { in: destIds } })
    }
  }

  const result = await payload.find({
    collection: 'tours',
    where: { and: whereConditions },
    limit: limit || 4,
    sort: '-createdAt',
  })

  const tours = result.docs

  if (tours.length === 0) return null

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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
              Uitgelicht
            </div>
            <h2 className="text-3xl font-extrabold text-[var(--color-base-1000)] md:text-4xl lg:text-5xl">
              {heading}
            </h2>
          </div>
        )}

        <div className={`grid gap-6 ${gridCols[columns] || gridCols['4']}`}>
          {tours.map((tour: any) => {
            const coverUrl = tour.coverImage && typeof tour.coverImage === 'object' ? tour.coverImage.url : undefined
            const coverAlt = tour.coverImage && typeof tour.coverImage === 'object' ? tour.coverImage.alt : undefined
            const destName = tour.destination && typeof tour.destination === 'object' ? tour.destination.name : undefined
            const highlights = tour.highlights?.map((h: any) => h.text).filter(Boolean) || []

            return (
              <TourCard
                key={tour.id}
                title={tour.title}
                slug={tour.slug}
                coverImage={coverUrl}
                coverAlt={coverAlt}
                duration={tour.duration}
                nights={tour.nights}
                rating={showRating ? tour.rating : undefined}
                reviewCount={showRating ? tour.reviewCount : undefined}
                price={showPrice ? tour.price : undefined}
                originalPrice={showPrice ? tour.originalPrice : undefined}
                category={tour.category}
                highlights={highlights}
                availability={tour.availability}
                destination={destName}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
