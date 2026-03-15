import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { CoursesArchiveTemplate } from '@/branches/onderwijs/templates/CoursesArchive'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Cursussen | Compass Academy',
    description: 'Ontdek ons cursusaanbod en ontwikkel je vaardigheden met expert-begeleiding.',
  }
}

export default async function CursussenPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    category?: string
    level?: string
    minPrice?: string
    maxPrice?: string
    minRating?: string
    sort?: string
    q?: string
  }>
}) {
  if (!isFeatureEnabled('education')) notFound()

  const params = await searchParams
  const currentPage = Number(params.page) || 1

  const payload = await getPayload({ config })

  // Fetch categories for filter sidebar
  let categories: any[] = []
  try {
    const catResult = await payload.find({
      collection: 'course-categories',
      limit: 50,
      sort: 'name',
    })
    categories = catResult.docs
  } catch {}

  // Build where clause from filters
  const whereConditions: any[] = [
    { status: { equals: 'published' } },
  ]

  if (params.q) {
    whereConditions.push({
      or: [
        { title: { like: params.q } },
        { shortDescription: { like: params.q } },
      ],
    })
  }

  if (params.category) {
    // Find category by slug to get its ID
    const matchedCat = categories.find((c: any) => c.slug === params.category)
    if (matchedCat) {
      whereConditions.push({ category: { equals: matchedCat.id } })
    }
  }

  if (params.level) {
    whereConditions.push({ level: { equals: params.level } })
  }

  if (params.minPrice) {
    whereConditions.push({ price: { greater_than_equal: Number(params.minPrice) } })
  }

  if (params.maxPrice) {
    whereConditions.push({ price: { less_than_equal: Number(params.maxPrice) } })
  }

  if (params.minRating) {
    whereConditions.push({ rating: { greater_than_equal: Number(params.minRating) } })
  }

  // Determine sort
  let sort: string = '-studentCount'
  switch (params.sort) {
    case 'populair':
      sort = '-studentCount'
      break
    case 'nieuwste':
      sort = '-createdAt'
      break
    case 'prijs-laag':
      sort = 'price'
      break
    case 'prijs-hoog':
      sort = '-price'
      break
    case 'beoordeling':
      sort = '-rating'
      break
    default:
      sort = '-studentCount'
      break
  }

  // Fetch courses
  const { docs: courses, totalPages, totalDocs } = await payload.find({
    collection: 'courses',
    where: { and: whereConditions },
    limit: 24,
    page: currentPage,
    sort,
    depth: 1,
  })

  return (
    <CoursesArchiveTemplate
      courses={courses}
      categories={categories}
      totalPages={totalPages}
      currentPage={currentPage}
      totalDocs={totalDocs}
      filters={{
        q: params.q,
        category: params.category,
        level: params.level,
        minPrice: params.minPrice ? Number(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
        minRating: params.minRating ? Number(params.minRating) : undefined,
        sort: params.sort,
      }}
    />
  )
}
