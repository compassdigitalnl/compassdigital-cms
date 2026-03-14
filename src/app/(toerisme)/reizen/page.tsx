import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { ToursArchiveTemplate } from '@/branches/toerisme/templates'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Reizen',
    description: 'Bekijk ons aanbod reizen en vakanties naar de mooiste bestemmingen',
  }
}

export default async function ReizenPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    continent?: string
    category?: string
    priceMin?: string
    priceMax?: string
    durationMin?: string
    durationMax?: string
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

  if (params.continent) {
    // Look up destinations by continent, then filter tours by destination
    try {
      const destinationResult = await payload.find({
        collection: 'destinations',
        where: { continent: { equals: params.continent } },
        limit: 100,
      })
      const destinationIds = destinationResult.docs.map((d: any) => d.id)
      if (destinationIds.length > 0) {
        whereConditions.push({ destination: { in: destinationIds } })
      }
    } catch {}
  }

  if (params.category) {
    whereConditions.push({ category: { equals: params.category } })
  }

  if (params.priceMin) {
    whereConditions.push({ price: { greater_than_equal: Number(params.priceMin) } })
  }

  if (params.priceMax) {
    whereConditions.push({ price: { less_than_equal: Number(params.priceMax) } })
  }

  if (params.durationMin) {
    whereConditions.push({ duration: { greater_than_equal: Number(params.durationMin) } })
  }

  if (params.durationMax) {
    whereConditions.push({ duration: { less_than_equal: Number(params.durationMax) } })
  }

  // Fetch tours
  const { docs: tours, totalPages, totalDocs } = await payload.find({
    collection: 'tours',
    where: { and: whereConditions },
    limit: 24,
    page: currentPage,
    sort: '-createdAt',
    depth: 1,
  })

  // Fetch all destinations for filter
  let destinations: Array<{ id: number; name: string; continent: string }> = []
  try {
    const destResult = await payload.find({
      collection: 'destinations',
      limit: 100,
      sort: 'name',
    })
    destinations = destResult.docs.map((d: any) => ({
      id: d.id,
      name: d.name,
      continent: d.continent,
    }))
  } catch {}

  return (
    <ToursArchiveTemplate
      tours={tours}
      destinations={destinations}
      totalPages={totalPages}
      currentPage={currentPage}
      totalDocs={totalDocs}
      filters={{
        continent: params.continent,
        category: params.category,
        priceMin: params.priceMin ? Number(params.priceMin) : undefined,
        priceMax: params.priceMax ? Number(params.priceMax) : undefined,
        durationMin: params.durationMin ? Number(params.durationMin) : undefined,
        durationMax: params.durationMax ? Number(params.durationMax) : undefined,
      }}
    />
  )
}
