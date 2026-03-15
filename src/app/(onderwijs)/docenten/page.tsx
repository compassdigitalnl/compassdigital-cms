import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { DocentenArchiveTemplate } from '@/branches/onderwijs/templates/DocentenArchive'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Onze Docenten',
    description: 'Leer van ervaren professionals. Onze docenten zijn experts in hun vakgebied en delen hun kennis met passie.',
  }
}

export default async function DocentenPage() {
  if (!isFeatureEnabled('education')) notFound()

  const payload = await getPayload({ config })

  // Fetch team members where branch is 'onderwijs'
  const { docs: team } = await payload.find({
    collection: 'content-team',
    where: {
      branch: { equals: 'onderwijs' },
    },
    limit: 50,
    sort: 'name',
    depth: 1,
  })

  return <DocentenArchiveTemplate team={team} />
}
