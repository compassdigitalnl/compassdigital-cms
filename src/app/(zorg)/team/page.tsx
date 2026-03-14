import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import TeamArchiveTemplate from '@/branches/zorg/templates/TeamArchive'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Ons Team',
    description: 'Maak kennis met onze ervaren behandelaars',
  }
}

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  if (!isFeatureEnabled('zorg')) notFound()

  const params = await searchParams
  const currentPage = Number(params.page) || 1

  const payload = await getPayload({ config })
  const { docs: members, totalPages } = await payload.find({
    collection: 'content-team',
    where: {
      and: [
        { status: { equals: 'published' } },
        { branch: { equals: 'zorg' } },
      ],
    },
    limit: 24,
    page: currentPage,
    sort: 'name',
    depth: 1,
  })

  return (
    <TeamArchiveTemplate
      members={members}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  )
}
