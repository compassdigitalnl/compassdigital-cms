import { getPayload } from 'payload'
import config from '@payload-config'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import MagazineArchiveTemplate1 from '@/branches/publishing/templates/magazines/MagazineArchiveTemplate1'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'settings' }) as any
    const archiveSeo = settings?.archiveSeo

    return {
      title: archiveSeo?.magazinesTitle || 'Magazines - Ontdek onze titels',
      description: archiveSeo?.magazinesDescription || 'Ontdek onze magazines. Van vakbladen tot lifestylemagazines.',
    }
  } catch {
    return {
      title: 'Magazines - Ontdek onze titels',
      description: 'Ontdek onze magazines. Van vakbladen tot lifestylemagazines.',
    }
  }
}

export default async function MagazinesPage() {
  if (!isFeatureEnabled('magazines')) notFound()

  const payload = await getPayload({ config })

  // Read template setting
  let _template = 'magazinearchivetemplate1'
  try {
    const settings = await payload.findGlobal({ slug: 'settings', depth: 0 }) as any
    _template = settings?.defaultMagazineArchiveTemplate || 'magazinearchivetemplate1'
  } catch {}

  const { docs: magazines } = await payload.find({
    collection: 'magazines',
    where: {
      visible: { equals: true },
    },
    sort: 'order',
    limit: 100,
    depth: 1,
  })

  const allMagazines = magazines.map((mag: any) => ({
    id: mag.id,
    name: mag.name,
    slug: mag.slug,
    tagline: mag.tagline,
    logo: mag.logo,
    image: mag.cover,
    issueCount: mag.editions?.length || 0,
  }))

  const featuredMagazines = allMagazines.filter((_: any, i: number) =>
    (magazines[i] as any).featured,
  )

  const totalIssueCount = allMagazines.reduce((sum: number, m: any) => sum + (m.issueCount || 0), 0)

  // Template switching (future: add more templates here)
  // const ArchiveComponent = template === 'magazinearchivetemplate2' ? ... : MagazineArchiveTemplate1

  return (
    <MagazineArchiveTemplate1
      magazines={allMagazines}
      featuredMagazines={featuredMagazines}
      totalIssueCount={totalIssueCount}
    />
  )
}
