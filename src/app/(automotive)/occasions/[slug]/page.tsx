import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { VehicleDetailTemplate } from '@/branches/automotive/templates'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  try {
    const { docs } = await payload.find({
      collection: 'vehicles',
      where: {
        and: [
          { slug: { equals: slug } },
        ],
      },
      limit: 1,
      depth: 1,
    })

    if (docs[0]) {
      const vehicle = docs[0] as any
      const brandName = typeof vehicle.brand === 'object' ? vehicle.brand?.name : ''
      const title = brandName ? `${brandName} ${vehicle.title}` : vehicle.title
      return {
        title,
        description: vehicle.shortDescription || `Bekijk de ${title} in ons aanbod`,
      }
    }
  } catch {}

  return { title: 'Voertuig' }
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!isFeatureEnabled('automotive')) notFound()

  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'vehicles',
    where: {
      and: [
        { slug: { equals: slug } },
        { _status: { equals: 'published' } },
      ],
    },
    limit: 1,
    depth: 2,
  })

  const vehicle = docs[0]
  if (!vehicle) notFound()

  return <VehicleDetailTemplate vehicle={vehicle} />
}
