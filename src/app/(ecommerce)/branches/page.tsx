import { getPayload } from 'payload'
import config from '@payload-config'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import BrancheArchiveTemplate1 from '@/branches/shared/templates/branches/BrancheArchiveTemplate1'
import { RenderBlocks } from '@/branches/shared/blocks/RenderBlocks'
import { JsonLdSchema } from '@/features/seo/components/JsonLdSchema'
import type { Metadata } from 'next'
import type { Page } from '@/payload-types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'settings' }) as any
    const archiveSeo = settings?.archiveSeo

    // Try CMS page first
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'branches' } },
      limit: 1,
      depth: 0,
      select: { title: true, meta: true },
    })
    if (docs[0]) {
      const page = docs[0] as any
      return {
        title: page.meta?.title || page.title || 'Branches',
        description: page.meta?.description || archiveSeo?.branchesDescription || 'Ontdek onze oplossingen per branche.',
      }
    }

    return {
      title: archiveSeo?.branchesTitle || 'Branches',
      description: archiveSeo?.branchesDescription || 'Ontdek onze oplossingen per branche.',
    }
  } catch {
    return { title: 'Branches' }
  }
}

export default async function BranchesPage() {
  const payload = await getPayload({ config })

  // Strategy 1: If shop is enabled, use branches collection (ecommerce product branches)
  if (isFeatureEnabled('shop')) {
    const { docs: branches } = await payload.find({
      collection: 'branches',
      where: { visible: { equals: true } },
      sort: 'order',
      limit: 100,
      depth: 1,
    })

    if (branches.length > 0) {
      const branchesWithCounts = await Promise.all(
        branches.map(async (branch: any) => {
          try {
            const { totalDocs } = await payload.count({
              collection: 'products',
              where: { branches: { equals: branch.id } },
            })
            return { ...branch, productCount: totalDocs }
          } catch {
            return { ...branch, productCount: 0 }
          }
        }),
      )
      const totalProductCount = branchesWithCounts.reduce((sum, b) => sum + (b.productCount || 0), 0)
      return <BrancheArchiveTemplate1 branches={branchesWithCounts} totalProductCount={totalProductCount} />
    }
  }

  // Strategy 2: Render CMS page with slug "branches" (landing page mode)
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'branches' } },
    limit: 1,
    depth: 2,
  })

  const page = docs[0] as Page | undefined
  if (page) {
    return (
      <article className="pt-16 pb-24">
        <JsonLdSchema page={page} />
        <RenderBlocks blocks={page.layout || []} />
      </article>
    )
  }

  notFound()
}
