import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { AccommodationDetailTemplate } from '@/branches/toerisme/templates'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  try {
    const { docs } = await payload.find({
      collection: 'accommodations',
      where: {
        and: [
          { slug: { equals: slug } },
        ],
      },
      limit: 1,
      depth: 1,
    })

    if (docs[0]) {
      const accommodation = docs[0] as any
      const city = accommodation.city || ''
      const title = city ? `${accommodation.name} — ${city}` : accommodation.name
      return {
        title,
        description: accommodation.shortDescription || `Bekijk ${accommodation.name}`,
      }
    }
  } catch {}

  return { title: 'Accommodatie' }
}

export default async function AccommodationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!isFeatureEnabled('tourism')) notFound()

  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'accommodations',
    where: {
      and: [
        { slug: { equals: slug } },
        { _status: { equals: 'published' } },
      ],
    },
    limit: 1,
    depth: 2,
  })

  const accommodation = docs[0]
  if (!accommodation) notFound()

  return <AccommodationDetailTemplate accommodation={accommodation} />
}
