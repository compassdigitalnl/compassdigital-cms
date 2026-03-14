import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { RenderBlocks } from '@/branches/shared/blocks/RenderBlocks'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const payload = await getPayload({ config })
  try {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'contact' } },
      limit: 1,
    })
    if (docs[0]) {
      return {
        title: docs[0].meta?.title || docs[0].title || 'Contact',
        description: docs[0].meta?.description || 'Neem contact met ons op',
      }
    }
  } catch {}
  return { title: 'Contact', description: 'Neem contact met ons op' }
}

/**
 * Shared /contact route — resolves to the correct branch template
 * based on which feature flag is active.
 *
 * Priority: CMS Page → branch-specific template → 404
 */
export default async function ContactPage() {
  const payload = await getPayload({ config })

  // 1. Always try CMS page first — allows each site to define its own contact page
  try {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'contact' } },
      limit: 1,
      depth: 2,
    })
    if (docs?.[0]) {
      return <RenderBlocks blocks={docs[0].layout || []} />
    }
  } catch {}

  // 2. Branch-specific contact templates
  let settings = null
  try {
    settings = await payload.findGlobal({ slug: 'settings' })
  } catch {}

  if (isFeatureEnabled('beauty')) {
    const { default: Template } = await import('@/branches/beauty/templates/ContactTemplate')
    return <Template settings={settings} />
  }

  if (isFeatureEnabled('zorg')) {
    const { default: Template } = await import('@/branches/zorg/templates/ContactTemplate')
    const team = await payload.find({
      collection: 'content-team',
      where: { branch: { equals: 'zorg' } },
      limit: 20,
      depth: 1,
    })
    return <Template settings={settings} team={team.docs} />
  }

  if (isFeatureEnabled('automotive')) {
    const { default: Template } = await import('@/branches/automotive/templates/Contact')
    const team = await payload.find({
      collection: 'content-team',
      where: { branch: { equals: 'automotive' } },
      limit: 20,
      depth: 1,
    })
    return <Template settings={settings} team={team.docs} />
  }

  if (isFeatureEnabled('tourism')) {
    const { default: Template } = await import('@/branches/toerisme/templates/Contact')
    const team = await payload.find({
      collection: 'content-team',
      where: { branch: { equals: 'toerisme' } },
      limit: 20,
      depth: 1,
    })
    return <Template settings={settings} team={team.docs} />
  }

  if (isFeatureEnabled('hospitality')) {
    // Hospitality uses the CMS page approach — if no page found, show fallback
    const { default: HospitalityFallback } = await import(
      '@/app/(hospitality)/contact/HospitalityContactFallback'
    ).catch(() => ({ default: null }))
    if (HospitalityFallback) return <HospitalityFallback />
  }

  notFound()
}
