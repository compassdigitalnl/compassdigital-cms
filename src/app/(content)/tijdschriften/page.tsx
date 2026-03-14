import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import MagazineArchiveTemplate1 from '@/branches/publishing/templates/magazines/MagazineArchiveTemplate1'
import type { MagazineWithMeta } from '@/branches/publishing/templates/magazines/MagazineArchiveTemplate1/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tijdschriften',
  description:
    'Ontdek ons aanbod aan tijdschriften. Van vakbladen tot lifestylemagazines — er is altijd iets dat bij je past.',
}

export default async function TijdschriftenPage() {
  if (!isFeatureEnabled('publishing')) notFound()

  const payload = await getPayload({ config })

  // Fetch all visible magazines
  const { docs: rawMagazines } = await payload.find({
    collection: 'magazines',
    where: {
      visible: { equals: true },
    },
    depth: 1,
    limit: 100,
    sort: 'order',
  })

  // Map to the shape expected by the template
  const magazines: MagazineWithMeta[] = rawMagazines.map((mag: any) => ({
    id: mag.id,
    name: mag.name,
    slug: mag.slug,
    tagline: mag.tagline || null,
    logo: mag.logo || null,
    image: mag.cover || null,
    issueCount: Array.isArray(mag.editions) ? mag.editions.length : 0,
  }))

  // Featured magazines
  const featuredMagazines = magazines.filter((m) => {
    const raw = rawMagazines.find((r: any) => r.id === m.id)
    return raw && (raw as any).featured === true
  })

  // Total issue count across all magazines
  const totalIssueCount = rawMagazines.reduce((sum: number, mag: any) => {
    return sum + (Array.isArray(mag.editions) ? mag.editions.length : 0)
  }, 0)

  return (
    <MagazineArchiveTemplate1
      magazines={magazines}
      featuredMagazines={featuredMagazines}
      totalIssueCount={totalIssueCount}
    />
  )
}
