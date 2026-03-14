import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { WorkshopArchiveTemplate } from '@/branches/automotive/templates'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Werkplaats',
    description: 'Professioneel onderhoud en reparatie voor uw voertuig',
  }
}

export default async function WerkplaatsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>
}) {
  if (!isFeatureEnabled('automotive')) notFound()

  const params = await searchParams
  const activeCategory = params.categorie || undefined

  const payload = await getPayload({ config })

  // Build where clause
  const whereConditions: any[] = [
    { _status: { equals: 'published' } },
    { branch: { equals: 'automotive' } },
  ]

  if (activeCategory) {
    whereConditions.push({ serviceCategory: { equals: activeCategory } })
  }

  const { docs: services } = await payload.find({
    collection: 'content-services',
    where: { and: whereConditions },
    limit: 100,
    sort: 'title',
    depth: 1,
  })

  // Build categories from all services (not filtered)
  let categories: Array<{ value: string; label: string; count: number }> = []
  try {
    const allServices = await payload.find({
      collection: 'content-services',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { branch: { equals: 'automotive' } },
        ],
      },
      limit: 100,
    })

    const categoryMap: Record<string, { label: string; count: number }> = {}
    const categoryLabels: Record<string, string> = {
      apk: 'APK',
      onderhoud: 'Onderhoud',
      reparatie: 'Reparatie',
      banden: 'Banden',
      airco: 'Airco',
    }

    allServices.docs.forEach((s: any) => {
      const cat = s.serviceCategory || s.category
      if (cat) {
        if (!categoryMap[cat]) {
          categoryMap[cat] = { label: categoryLabels[cat] || cat, count: 0 }
        }
        categoryMap[cat].count++
      }
    })

    categories = Object.entries(categoryMap).map(([value, { label, count }]) => ({
      value,
      label,
      count,
    }))
  } catch {}

  return (
    <WorkshopArchiveTemplate
      services={services}
      categories={categories}
      activeCategory={activeCategory}
    />
  )
}
