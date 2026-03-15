import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import PortfolioArchiveTemplate from '@/branches/beauty/templates/PortfolioArchive'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Portfolio',
    description: 'Bekijk ons portfolio met voor- en na-resultaten',
  }
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  if (!isFeatureEnabled('beauty')) notFound()

  const params = await searchParams
  const currentPage = Number(params.page) || 1

  const payload = await getPayload({ config })
  const { docs: items, totalPages } = await payload.find({
    collection: 'content-cases',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { branch: { equals: 'beauty' } },
      ],
    },
    limit: 12,
    page: currentPage,
    sort: '-createdAt',
    depth: 1,
  })

  return (
    <PortfolioArchiveTemplate
      items={items}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  )
}
