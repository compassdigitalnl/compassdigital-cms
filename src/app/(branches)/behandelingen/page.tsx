import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Behandelingen',
    description: 'Bekijk ons volledige aanbod aan behandelingen',
  }
}

/**
 * Shared /behandelingen route — resolves to beauty or zorg template
 */
export default async function BehandelingenPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const payload = await getPayload({ config })

  if (isFeatureEnabled('beauty')) {
    const { default: Template } = await import('@/branches/beauty/templates/TreatmentsArchive')
    const { docs: treatments, totalPages } = await payload.find({
      collection: 'content-services',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { branch: { equals: 'beauty' } },
        ],
      },
      limit: 24,
      page: currentPage,
      sort: 'title',
      depth: 1,
    })
    return (
      <Template
        treatments={treatments}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    )
  }

  if (isFeatureEnabled('zorg')) {
    const { default: Template } = await import('@/branches/zorg/templates/TreatmentsArchive')
    const { docs: items, totalPages } = await payload.find({
      collection: 'content-services',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { branch: { equals: 'zorg' } },
        ],
      },
      limit: 24,
      page: currentPage,
      sort: 'title',
      depth: 1,
    })
    return (
      <Template
        items={items}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    )
  }

  notFound()
}
