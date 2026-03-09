import { getPayload } from 'payload'
import config from '@payload-config'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import BrancheDetailTemplate1 from '@/branches/shared/templates/branches/BrancheDetailTemplate1'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'branches',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    const branch = docs[0] as any
    if (!branch) return { title: 'Branche niet gevonden' }

    return {
      title: branch.meta?.title || `${branch.name} - Branches`,
      description: branch.meta?.description || branch.description,
    }
  } catch {
    return { title: 'Branche niet gevonden' }
  }
}

export default async function BrancheDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  if (!isFeatureEnabled('shop')) notFound()

  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'branches',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })

  const branch = docs[0] as any
  if (!branch) notFound()

  // Fetch popular products for this branch
  let popularProducts: any[] = []
  try {
    const { docs: products } = await payload.find({
      collection: 'products',
      where: {
        branches: { equals: branch.id },
      },
      limit: 4,
      depth: 1,
    })
    popularProducts = products
  } catch {
    // Products fetch is optional
  }

  return (
    <BrancheDetailTemplate1
      name={branch.name}
      slug={branch.slug}
      badge={branch.badge || 'Branche'}
      title={branch.title || branch.name}
      description={branch.description}
      icon={branch.icon}
      stats={branch.stats}
      uspCards={branch.uspCards}
      testimonial={branch.testimonial}
      popularProducts={popularProducts}
      ctaTitle={branch.ctaTitle}
      ctaDescription={branch.ctaDescription}
    />
  )
}
