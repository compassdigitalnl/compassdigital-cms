import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { AccommodationsArchiveTemplate } from '@/branches/toerisme/templates'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Accommodaties',
    description: 'Bekijk ons aanbod hotels, resorts, villa\'s en andere accommodaties',
  }
}

export default async function AccommodatiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    type?: string
    stars?: string
    facilities?: string
    mealPlan?: string
    priceMin?: string
    priceMax?: string
  }>
}) {
  if (!isFeatureEnabled('tourism')) notFound()

  const params = await searchParams
  const currentPage = Number(params.page) || 1

  const payload = await getPayload({ config })

  // Build where clause from filters
  const whereConditions: any[] = [
    { _status: { equals: 'published' } },
  ]

  if (params.type) {
    whereConditions.push({ type: { equals: params.type } })
  }

  if (params.stars) {
    whereConditions.push({ stars: { equals: Number(params.stars) } })
  }

  if (params.mealPlan) {
    whereConditions.push({ mealPlan: { equals: params.mealPlan } })
  }

  if (params.priceMin) {
    whereConditions.push({ priceFrom: { greater_than_equal: Number(params.priceMin) } })
  }

  if (params.priceMax) {
    whereConditions.push({ priceFrom: { less_than_equal: Number(params.priceMax) } })
  }

  // Fetch accommodations
  const { docs: accommodations, totalPages, totalDocs } = await payload.find({
    collection: 'accommodations',
    where: { and: whereConditions },
    limit: 24,
    page: currentPage,
    sort: '-createdAt',
    depth: 1,
  })

  return (
    <AccommodationsArchiveTemplate
      accommodations={accommodations}
      totalPages={totalPages}
      currentPage={currentPage}
      totalDocs={totalDocs}
      filters={{
        type: params.type,
        stars: params.stars ? Number(params.stars) : undefined,
        mealPlan: params.mealPlan,
        priceMin: params.priceMin ? Number(params.priceMin) : undefined,
        priceMax: params.priceMax ? Number(params.priceMax) : undefined,
      }}
    />
  )
}
