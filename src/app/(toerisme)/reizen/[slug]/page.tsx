import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { TourDetailTemplate } from '@/branches/toerisme/templates'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  try {
    const { docs } = await payload.find({
      collection: 'tours',
      where: {
        and: [
          { slug: { equals: slug } },
        ],
      },
      limit: 1,
      depth: 1,
    })

    if (docs[0]) {
      const tour = docs[0] as any
      const destinationName = typeof tour.destination === 'object' ? tour.destination?.name : ''
      const title = destinationName ? `${tour.title} — ${destinationName}` : tour.title
      return {
        title,
        description: tour.shortDescription || `Bekijk de reis ${tour.title}`,
      }
    }
  } catch {}

  return { title: 'Reis' }
}

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!isFeatureEnabled('tourism')) notFound()

  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'tours',
    where: {
      and: [
        { slug: { equals: slug } },
        { _status: { equals: 'published' } },
      ],
    },
    limit: 1,
    depth: 2,
  })

  const tour = docs[0]
  if (!tour) notFound()

  return <TourDetailTemplate tour={tour} />
}
