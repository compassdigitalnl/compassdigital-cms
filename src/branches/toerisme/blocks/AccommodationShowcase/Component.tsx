import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { AccommodationCard } from '../../components/AccommodationCard'
import type { AccommodationShowcaseProps } from './types'

export async function AccommodationShowcaseComponent(props: AccommodationShowcaseProps) {
  const {
    heading,
    limit = 4,
    destinationFilter,
    showStars = true,
    showFacilities = true,
  } = props

  const payload = await getPayload({ config })

  const whereConditions: any[] = [
    { status: { equals: 'published' } },
    { featured: { equals: true } },
  ]

  if (destinationFilter) {
    const destId = typeof destinationFilter === 'object' ? (destinationFilter as any).id : destinationFilter
    whereConditions.push({ destination: { equals: destId } })
  }

  const result = await payload.find({
    collection: 'accommodations',
    where: { and: whereConditions },
    limit: limit || 4,
    sort: '-createdAt',
  })

  const accommodations = result.docs

  if (accommodations.length === 0) return null

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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {accommodations.map((acc: any) => {
            const coverUrl = acc.coverImage && typeof acc.coverImage === 'object' ? acc.coverImage.url : undefined
            const coverAlt = acc.coverImage && typeof acc.coverImage === 'object' ? acc.coverImage.alt : undefined
            const city = acc.city
            const region = acc.region

            return (
              <AccommodationCard
                key={acc.id}
                name={acc.name}
                slug={acc.slug}
                coverImage={coverUrl}
                coverAlt={coverAlt}
                stars={showStars ? acc.stars : undefined}
                type={acc.type}
                city={city}
                region={region}
                facilities={showFacilities ? acc.facilities : undefined}
                priceFrom={acc.priceFrom}
                mealPlan={acc.mealPlan}
                rating={acc.rating}
                reviewCount={acc.reviewCount}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
