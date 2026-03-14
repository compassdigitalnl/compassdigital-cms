import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const branch = isFeatureEnabled('beauty') ? 'beauty' : isFeatureEnabled('zorg') ? 'zorg' : null
  if (!branch) return { title: 'Behandeling' }

  try {
    const { docs } = await payload.find({
      collection: 'content-services',
      where: {
        and: [
          { slug: { equals: slug } },
          { branch: { equals: branch } },
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

/**
 * Shared /behandelingen/[slug] route — resolves to beauty or zorg template
 */
export default async function TreatmentDetailPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })

  if (isFeatureEnabled('beauty')) {
    const { default: Template } = await import('@/branches/beauty/templates/TreatmentDetail')
    const { docs } = await payload.find({
      collection: 'content-services',
      where: {
        and: [
          { slug: { equals: slug } },
          { branch: { equals: 'beauty' } },
          { _status: { equals: 'published' } },
        ],
      },
      limit: 1,
      depth: 2,
    })
    if (!docs[0]) notFound()
    return <Template treatment={docs[0]} />
  }

  if (isFeatureEnabled('zorg')) {
    const { default: Template } = await import('@/branches/zorg/templates/TreatmentDetail')
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
    if (!docs[0]) notFound()
    return <Template item={docs[0]} />
  }

  notFound()
}
