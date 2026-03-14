import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import MenuItemDetailTemplate from '@/branches/horeca/templates/MenuItemDetail'

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
          { branch: { equals: 'horeca' } },
        ],
      },
      limit: 1,
    })

    if (docs[0]) {
      return {
        title: docs[0].title,
        description: docs[0].shortDescription || `Meer over ${docs[0].title}`,
      }
    }
  } catch {}

  return { title: 'Gerecht' }
}

export default async function MenuItemDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!isFeatureEnabled('horeca')) notFound()

  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'content-services',
    where: {
      and: [
        { slug: { equals: slug } },
        { branch: { equals: 'horeca' } },
        { _status: { equals: 'published' } },
      ],
    },
    limit: 1,
    depth: 2,
  })

  const item = docs[0]
  if (!item) notFound()

  return <MenuItemDetailTemplate item={item} />
}
