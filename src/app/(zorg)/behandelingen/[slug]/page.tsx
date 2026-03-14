import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import TreatmentDetailTemplate from '@/branches/zorg/templates/TreatmentDetail'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  try {
    const { docs } = await payload.find({
      collection: 'content-services',
      where: {
        and: [
          { slug: { equals: slug } },
          { branch: { equals: 'zorg' } },
        ],
      },
      limit: 1,
    })

    if (docs[0]) {
      return {
        title: docs[0].title,
        description: (docs[0] as any).shortDescription || `Meer informatie over ${docs[0].title}`,
      }
    }
  } catch {}

  return { title: 'Behandeling' }
}

export default async function TreatmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!isFeatureEnabled('zorg')) notFound()

  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'content-services',
    where: {
      and: [
        { slug: { equals: slug } },
        { branch: { equals: 'zorg' } },
        { _status: { equals: 'published' } },
      ],
    },
    limit: 1,
    depth: 2,
  })

  const item = docs[0]
  if (!item) notFound()

  return <TreatmentDetailTemplate item={item} />
}
