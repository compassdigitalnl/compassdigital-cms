import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import EventsArchiveTemplate from '@/branches/horeca/templates/EventsArchive'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Evenementen',
    description: 'Bekijk onze aankomende evenementen',
  }
}

export default async function EvenementenPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  if (!isFeatureEnabled('horeca')) notFound()

  const params = await searchParams
  const currentPage = Number(params.page) || 1

  const payload = await getPayload({ config })
  const { docs: events, totalPages } = await payload.find({
    collection: 'content-activities',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { branch: { equals: 'horeca' } },
      ],
    },
    limit: 12,
    page: currentPage,
    sort: 'startDate',
    depth: 1,
  })

  return (
    <EventsArchiveTemplate
      events={events}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  )
}
