import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import MenuArchiveTemplate from '@/branches/horeca/templates/MenuArchive'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Menukaart',
    description: 'Bekijk onze menukaart',
  }
}

export default async function MenukaartPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  if (!isFeatureEnabled('horeca')) notFound()

  const params = await searchParams
  const currentPage = Number(params.page) || 1

  const payload = await getPayload({ config })
  const { docs: items, totalPages } = await payload.find({
    collection: 'content-services',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { branch: { equals: 'horeca' } },
      ],
    },
    limit: 50,
    page: currentPage,
    sort: 'title',
    depth: 1,
  })

  return (
    <MenuArchiveTemplate
      items={items}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  )
}
