import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { PropertyDetailTemplate } from '@/branches/vastgoed/templates/PropertyDetail'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  try {
    const { docs } = await payload.find({
      collection: 'properties',
      where: {
        and: [
          { slug: { equals: slug } },
        ],
      },
      limit: 1,
      depth: 1,
    })

    if (docs[0]) {
      const property = docs[0] as any
      const price = property.askingPrice
        ? new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(property.askingPrice)
        : ''
      const title = price ? `${property.title} — ${price}` : property.title
      return {
        title,
        description: property.shortDescription || `Bekijk woning ${property.title}`,
      }
    }
  } catch {}

  return { title: 'Woning' }
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!isFeatureEnabled('real_estate')) notFound()

  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'properties',
    where: {
      and: [
        { slug: { equals: slug } },
        { _status: { equals: 'published' } },
      ],
    },
    limit: 1,
    depth: 2,
  })

  const property = docs[0]
  if (!property) notFound()

  return <PropertyDetailTemplate property={property} />
}
