import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { RenderBlocks } from '@/branches/shared/blocks/RenderBlocks'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Contact',
    description: 'Neem contact met ons op. We helpen u graag verder.',
  }
}

export default async function ContactPage() {
  const payload = await getPayload({ config })

  // 1. Try CMS page first (Pages collection with slug 'contact')
  try {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'contact' } },
      limit: 1,
      depth: 2,
    })
    if (docs?.[0]) {
      return <RenderBlocks blocks={(docs[0] as any).layout || []} />
    }
  } catch {}

  // 2. Fetch settings (used by most branch templates)
  let settings = null
  try {
    settings = await payload.findGlobal({ slug: 'settings' })
  } catch {}

  // 3. Branch-specific contact templates (priority order)
  if (isFeatureEnabled('real_estate')) {
    const { ContactTemplate } = await import('@/branches/vastgoed/templates/ContactTemplate')
    let teamMembers: any[] = []
    try {
      const result = await payload.find({
        collection: 'content-team',
        where: { branch: { equals: 'vastgoed' } },
        limit: 20,
        sort: 'name',
        depth: 1,
      })
      teamMembers = result.docs
    } catch {}
    return <ContactTemplate teamMembers={teamMembers} />
  }

  if (isFeatureEnabled('education')) {
    const { ContactTemplate } = await import('@/branches/onderwijs/templates/ContactTemplate')
    let team: any[] = []
    try {
      const result = await payload.find({
        collection: 'content-team',
        where: { branch: { equals: 'onderwijs' } },
        limit: 10,
        sort: 'name',
        depth: 1,
      })
      team = result.docs
    } catch {}
    return <ContactTemplate team={team} settings={settings} />
  }

  if (isFeatureEnabled('beauty')) {
    const { default: Template } = await import('@/branches/beauty/templates/ContactTemplate')
    return <Template settings={settings} />
  }

  if (isFeatureEnabled('zorg')) {
    const { default: Template } = await import('@/branches/zorg/templates/ContactTemplate')
    let team: any[] = []
    try {
      const result = await payload.find({
        collection: 'content-team',
        where: { branch: { equals: 'zorg' } },
        limit: 20,
        depth: 1,
      })
      team = result.docs
    } catch {}
    return <Template settings={settings} team={team} />
  }

  if (isFeatureEnabled('automotive')) {
    const { default: Template } = await import('@/branches/automotive/templates/Contact')
    let team: any[] = []
    try {
      const result = await payload.find({
        collection: 'content-team',
        where: { branch: { equals: 'automotive' } },
        limit: 20,
        depth: 1,
      })
      team = result.docs
    } catch {}
    return <Template settings={settings} team={team} />
  }

  if (isFeatureEnabled('tourism')) {
    const { default: Template } = await import('@/branches/toerisme/templates/Contact')
    let team: any[] = []
    try {
      const result = await payload.find({
        collection: 'content-team',
        where: { branch: { equals: 'toerisme' } },
        limit: 20,
        depth: 1,
      })
      team = result.docs
    } catch {}
    return <Template settings={settings} team={team} />
  }

  // 4. No branch enabled with contact template
  notFound()
}
