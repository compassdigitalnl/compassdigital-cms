import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { VehiclesArchiveTemplate } from '@/branches/automotive/templates'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Occasions',
    description: 'Bekijk ons aanbod occasions en nieuwe voertuigen',
  }
}

export default async function OccasionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    brand?: string
    fuelType?: string
    bodyType?: string
    priceMin?: string
    priceMax?: string
    yearMin?: string
    yearMax?: string
  }>
}) {
  if (!isFeatureEnabled('automotive')) notFound()

  const params = await searchParams
  const currentPage = Number(params.page) || 1

  const payload = await getPayload({ config })

  // Build where clause from filters
  const whereConditions: any[] = [
    { _status: { equals: 'published' } },
    { status: { not_equals: 'verkocht' } },
  ]

  if (params.brand) {
    // Look up brand by slug
    try {
      const brandResult = await payload.find({
        collection: 'vehicle-brands',
        where: { slug: { equals: params.brand } },
        limit: 1,
      })
      if (brandResult.docs[0]) {
        whereConditions.push({ brand: { equals: brandResult.docs[0].id } })
      }
    } catch {}
  }

  if (params.fuelType) {
    whereConditions.push({ fuelType: { equals: params.fuelType } })
  }

  if (params.bodyType) {
    whereConditions.push({ bodyType: { equals: params.bodyType } })
  }

  if (params.priceMin) {
    whereConditions.push({ price: { greater_than_equal: Number(params.priceMin) } })
  }

  if (params.priceMax) {
    whereConditions.push({ price: { less_than_equal: Number(params.priceMax) } })
  }

  if (params.yearMin) {
    whereConditions.push({ year: { greater_than_equal: Number(params.yearMin) } })
  }

  if (params.yearMax) {
    whereConditions.push({ year: { less_than_equal: Number(params.yearMax) } })
  }

  // Fetch vehicles
  const { docs: vehicles, totalPages, totalDocs } = await payload.find({
    collection: 'vehicles',
    where: { and: whereConditions },
    limit: 24,
    page: currentPage,
    sort: '-createdAt',
    depth: 1,
  })

  // Fetch all brands for filter
  let brands: Array<{ id: number; name: string; slug: string }> = []
  try {
    const brandResult = await payload.find({
      collection: 'vehicle-brands',
      limit: 100,
      sort: 'order',
    })
    brands = brandResult.docs.map((b: any) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
    }))
  } catch {}

  return (
    <VehiclesArchiveTemplate
      vehicles={vehicles}
      brands={brands}
      totalPages={totalPages}
      currentPage={currentPage}
      totalDocs={totalDocs}
      filters={{
        brand: params.brand,
        fuelType: params.fuelType,
        bodyType: params.bodyType,
        priceMin: params.priceMin ? Number(params.priceMin) : undefined,
        priceMax: params.priceMax ? Number(params.priceMax) : undefined,
        yearMin: params.yearMin ? Number(params.yearMin) : undefined,
        yearMax: params.yearMax ? Number(params.yearMax) : undefined,
      }}
    />
  )
}
