import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { ViewingRequestTemplate } from '@/branches/vastgoed/templates/ViewingRequest'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Bezichtiging Plannen',
    description: 'Plan een fysieke of online bezichtiging. Onze makelaar neemt contact met u op om de afspraak te bevestigen.',
  }
}

export default async function BezichtigingPage({
  searchParams,
}: {
  searchParams: Promise<{
    propertyId?: string
  }>
}) {
  if (!isFeatureEnabled('real_estate')) notFound()

  const params = await searchParams
  const payload = await getPayload({ config })

  // Fetch team members with branch: 'vastgoed'
  let teamMembers: any[] = []
  try {
    const result = await payload.find({
      collection: 'content-team',
      where: {
        branch: { equals: 'vastgoed' },
      },
      limit: 20,
      sort: 'name',
      depth: 1,
    })
    teamMembers = result.docs
  } catch {}

  return (
    <ViewingRequestTemplate
      teamMembers={teamMembers}
      preselectedPropertyId={params.propertyId}
    />
  )
}
