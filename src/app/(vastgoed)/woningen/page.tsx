import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { PropertiesArchiveTemplate } from '@/branches/vastgoed/templates/PropertiesArchive'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Woningen',
    description: 'Bekijk ons actuele woningaanbod. Van appartementen tot vrijstaande woningen.',
  }
}

export default async function WoningenPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    city?: string
    minPrice?: string
    maxPrice?: string
    propertyType?: string
    minBedrooms?: string
    minArea?: string
    maxArea?: string
    energyLabel?: string
    status?: string
    sort?: string
  }>
}) {
  if (!isFeatureEnabled('real_estate')) notFound()

  const params = await searchParams
  const currentPage = Number(params.page) || 1

  const payload = await getPayload({ config })

  // Build where clause from filters
  const whereConditions: any[] = [
    { _status: { equals: 'published' } },
  ]

  if (params.city) {
    whereConditions.push({ city: { like: params.city } })
  }

  if (params.minPrice) {
    whereConditions.push({ askingPrice: { greater_than_equal: Number(params.minPrice) } })
  }

  if (params.maxPrice) {
    whereConditions.push({ askingPrice: { less_than_equal: Number(params.maxPrice) } })
  }

  if (params.propertyType) {
    whereConditions.push({ propertyType: { equals: params.propertyType } })
  }

  if (params.minBedrooms) {
    whereConditions.push({ bedrooms: { greater_than_equal: Number(params.minBedrooms) } })
  }

  if (params.minArea) {
    whereConditions.push({ livingArea: { greater_than_equal: Number(params.minArea) } })
  }

  if (params.maxArea) {
    whereConditions.push({ livingArea: { less_than_equal: Number(params.maxArea) } })
  }

  if (params.energyLabel) {
    whereConditions.push({ energyLabel: { equals: params.energyLabel } })
  }

  if (params.status) {
    whereConditions.push({ listingStatus: { equals: params.status } })
  }

  // Determine sort
  let sort: string = '-createdAt'
  switch (params.sort) {
    case 'prijs-oplopend':
      sort = 'askingPrice'
      break
    case 'prijs-aflopend':
      sort = '-askingPrice'
      break
    case 'oppervlakte':
      sort = '-livingArea'
      break
    case 'nieuwste':
    default:
      sort = '-createdAt'
      break
  }

  // Fetch properties
  const { docs: properties, totalPages, totalDocs } = await payload.find({
    collection: 'properties',
    where: { and: whereConditions },
    limit: 24,
    page: currentPage,
    sort,
    depth: 1,
  })

  return (
    <PropertiesArchiveTemplate
      properties={properties}
      totalPages={totalPages}
      currentPage={currentPage}
      totalDocs={totalDocs}
      filters={{
        city: params.city,
        minPrice: params.minPrice ? Number(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
        propertyType: params.propertyType,
        minBedrooms: params.minBedrooms ? Number(params.minBedrooms) : undefined,
        minArea: params.minArea ? Number(params.minArea) : undefined,
        maxArea: params.maxArea ? Number(params.maxArea) : undefined,
        energyLabel: params.energyLabel,
        status: params.status,
        sort: params.sort,
      }}
    />
  )
}
