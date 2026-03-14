import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { PropertyCard } from '../../components/PropertyCard'
import type { FeaturedPropertiesProps } from './types'

export async function FeaturedPropertiesComponent(props: FeaturedPropertiesProps) {
  const {
    heading,
    limit = 6,
    columns = '3',
    showMap = false,
    statusFilter,
  } = props

  const payload = await getPayload({ config })

  const whereConditions: any[] = [
    { featured: { equals: true } },
    { status: { equals: 'published' } },
  ]

  if (statusFilter && statusFilter !== 'alle') {
    whereConditions.push({ listingStatus: { equals: statusFilter } })
  }

  const result = await payload.find({
    collection: 'properties',
    where: { and: whereConditions },
    limit: limit || 6,
    sort: '-createdAt',
  })

  const properties = result.docs

  if (properties.length === 0) return null

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

        <div className={`grid gap-6 ${gridCols[columns] || gridCols['3']}`}>
          {properties.map((property: any) => {
            const coverUrl =
              property.coverImage && typeof property.coverImage === 'object'
                ? property.coverImage.url
                : undefined
            const coverAlt =
              property.coverImage && typeof property.coverImage === 'object'
                ? property.coverImage.alt
                : undefined

            return (
              <PropertyCard
                key={property.id}
                title={property.title}
                slug={property.slug}
                coverImage={coverUrl}
                coverAlt={coverAlt}
                askingPrice={property.askingPrice}
                priceCondition={property.priceCondition}
                originalPrice={property.originalPrice}
                city={property.city}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                livingArea={property.livingArea}
                energyLabel={property.energyLabel}
                listingStatus={property.listingStatus}
                listingDate={property.listingDate}
                featured={property.featured}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
