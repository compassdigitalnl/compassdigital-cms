import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { isFeatureEnabled } from '@/lib/tenant/features'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  if (!isFeatureEnabled('experiences')) return { title: 'Niet gevonden' }

  const { slug } = await params
  const payload = await getPayload({ config })

  const settings = await payload.findGlobal({ slug: 'settings', depth: 0 }) as any
  if (settings?.experiencesRouteSlug !== 'workshops') return { title: 'Niet gevonden' }

  const experiences = await payload.find({
    collection: 'experiences',
    limit: 1,
    where: { slug: { equals: slug } },
    depth: 0,
    select: { title: true, shortDescription: true, meta: true },
  })

  if (experiences.docs[0]) {
    const exp = experiences.docs[0] as any
    const meta = typeof exp.meta === 'object' ? exp.meta : null
    const label = settings?.experiencesRouteLabel || 'Workshops'
    return {
      title: meta?.title || `${exp.title} | ${label}`,
      description: meta?.description || exp.shortDescription || exp.title,
    }
  }

  return { title: 'Niet gevonden' }
}

export default async function WorkshopDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  if (!isFeatureEnabled('experiences')) notFound()

  const { slug } = await params
  const payload = await getPayload({ config })

  const settings = await payload.findGlobal({ slug: 'settings', depth: 0 }) as any
  if (settings?.experiencesRouteSlug !== 'workshops') notFound()

  const experiences = await payload.find({
    collection: 'experiences',
    limit: 1,
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    depth: 2,
  })

  const experience = experiences.docs[0]
  if (!experience) notFound()

  const { ExperienceDetailTemplate } = await import(
    '@/branches/experiences/templates/ExperienceDetail'
  )

  return (
    <ExperienceDetailTemplate
      experience={experience}
      routeSlug="workshops"
      routeLabel={settings?.experiencesRouteLabel || 'Workshops'}
    />
  )
}
