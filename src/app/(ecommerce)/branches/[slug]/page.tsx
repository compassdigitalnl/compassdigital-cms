import { getPayload } from 'payload'
import config from '@payload-config'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import BrancheDetailTemplate1 from '@/branches/shared/templates/branches/BrancheDetailTemplate1'
import { RenderBlocks } from '@/branches/shared/blocks/RenderBlocks'
import { JsonLdSchema } from '@/features/seo/components/JsonLdSchema'
import { generateMeta } from '@/features/seo/lib/generateMeta'
import type { Metadata } from 'next'
import type { Page } from '@/payload-types'

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

    // Try branches collection first (ecommerce)
    if (isFeatureEnabled('shop')) {
      const { docs } = await payload.find({
        collection: 'branches',
        where: { slug: { equals: slug } },
        limit: 1,
      })
      const branch = docs[0] as any
      if (branch) {
        return {
          title: branch.meta?.title || `${branch.name} - Branches`,
          description: branch.meta?.description || branch.description,
        }
      }
    }

    // Fallback: CMS page by slug
    const { docs: pages } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      select: { title: true, meta: true },
    })
    if (pages[0]) {
      return generateMeta({ doc: pages[0] as any })
    }

    return { title: 'Niet gevonden' }
  } catch {
    return { title: 'Niet gevonden' }
  }
}

export default async function BrancheDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config })

  // Strategy 1: Ecommerce branches collection
  if (isFeatureEnabled('shop')) {
    const { docs } = await payload.find({
      collection: 'branches',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    })

    const branch = docs[0] as any
    if (branch) {
      let popularProducts: any[] = []
      try {
        const { docs: products } = await payload.find({
          collection: 'products',
          where: { branches: { equals: branch.id } },
          limit: 4,
          depth: 1,
        })
        popularProducts = products
      } catch {}

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
  }

  // Strategy 2: CMS page by slug (landing page mode)
  const { docs: pageDocs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })

  const cmsPage = pageDocs[0] as Page | undefined

  if (cmsPage) {
    return (
      <article className="pt-16 pb-24">
        <JsonLdSchema page={cmsPage} />
        <RenderBlocks blocks={cmsPage.layout || []} />
      </article>
    )
  }

  notFound()
}
