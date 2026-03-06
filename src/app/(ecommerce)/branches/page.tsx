import { getPayload } from 'payload'
import config from '@payload-config'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import BrancheArchiveTemplate1 from '@/branches/shared/templates/branches/BrancheArchiveTemplate1'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'settings' }) as any
    const archiveSeo = settings?.archiveSeo

    return {
      title: archiveSeo?.branchesTitle || 'Branches - Producten per branche',
      description: archiveSeo?.branchesDescription || 'Ontdek producten speciaal samengesteld voor uw branche. Van huisarts tot thuiszorg.',
    }
  } catch {
    return {
      title: 'Branches - Producten per branche',
      description: 'Ontdek producten speciaal samengesteld voor uw branche. Van huisarts tot thuiszorg.',
    }
  }
}

export default async function BranchesPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const payload = await getPayload({ config })

  const { docs: branches } = await payload.find({
    collection: 'branches',
    where: {
      visible: { equals: true },
    },
    sort: 'order',
    limit: 100,
    depth: 1,
  })

  // Get product counts per branch
  const branchesWithCounts = await Promise.all(
    branches.map(async (branch: any) => {
      try {
        const { totalDocs } = await payload.count({
          collection: 'products',
          where: {
            branches: { equals: branch.id },
          },
        })
        return { ...branch, productCount: totalDocs }
      } catch {
        return { ...branch, productCount: 0 }
      }
    }),
  )

  const totalProductCount = branchesWithCounts.reduce((sum, b) => sum + (b.productCount || 0), 0)

  return (
    <BrancheArchiveTemplate1
      branches={branchesWithCounts}
      totalProductCount={totalProductCount}
    />
  )
}
