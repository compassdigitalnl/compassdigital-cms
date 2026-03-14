import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import TreatmentsArchiveTemplate from '@/branches/zorg/templates/TreatmentsArchive'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Behandelingen',
    description: 'Bekijk ons volledige aanbod aan behandelingen',
  }
}

export default async function BehandelingenPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  if (!isFeatureEnabled('zorg')) notFound()

  const params = await searchParams
  const currentPage = Number(params.page) || 1

  const payload = await getPayload({ config })
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
    <TreatmentsArchiveTemplate
      items={items}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  )
}
