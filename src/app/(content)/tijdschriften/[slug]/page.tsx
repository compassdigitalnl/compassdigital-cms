import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import MagazineDetailTemplate1 from '@/branches/publishing/templates/magazines/MagazineDetailTemplate1'
import type { Media } from '@/payload-types'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'magazines',
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
  })

  const magazine = docs[0] as any

  if (!magazine) {
    return { title: 'Magazine niet gevonden' }
  }

  return {
    title: magazine.meta?.title || `${magazine.name} | Tijdschriften`,
    description:
      magazine.meta?.description ||
      magazine.tagline ||
      `Lees meer over ${magazine.name} en bekijk alle edities.`,
  }
}

export default async function MagazineDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  if (!isFeatureEnabled('publishing')) notFound()

  const { slug } = await params
  const payload = await getPayload({ config })

  // Fetch magazine with media resolved
  const { docs } = await payload.find({
    collection: 'magazines',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })

  const magazine = docs[0] as any

  if (!magazine) {
    notFound()
  }

  // Resolve logo URL
  const logoMedia = magazine.logo as Media | null
  const logoUrl = logoMedia?.url || null

  // Map editions to the template's issue shape
  const recentIssues = Array.isArray(magazine.editions)
    ? magazine.editions
        .sort((a: any, b: any) => {
          // Sort by publishDate descending, then by year
          const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0
          const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0
          return dateB - dateA
        })
        .slice(0, 8)
        .map((edition: any) => {
          const coverMedia = edition.cover as Media | null
          return {
            id: edition.id,
            title: edition.title,
            issueNumber: edition.issueNumber || undefined,
            coverUrl: coverMedia?.url || undefined,
            publishDate: edition.publishDate || undefined,
            price: edition.price ? `${edition.price.toFixed(2).replace('.', ',')}` : undefined,
            soldOut: edition.soldOut || false,
            shopUrl: edition.shopUrl || undefined,
          }
        })
    : []

  // Build subscription CTA from magazine data
  const subscriptionCTA =
    magazine.ctaTitle || magazine.plans?.length > 0
      ? {
          title: magazine.ctaTitle || 'Word abonnee',
          description: magazine.ctaDescription || undefined,
          price: magazine.plans?.[0]?.price
            ? `${Number(magazine.plans[0].price).toFixed(2).replace('.', ',')}`
            : undefined,
          priceSuffix: magazine.plans?.[0]?.period === 'yearly' ? '/ jaar' : '/ maand',
          buttonLabel: 'Abonneren',
          buttonHref: `/abonnement?magazine=${slug}`,
        }
      : undefined

  // Build service links
  const serviceLinks = [
    { icon: 'BookOpen', label: 'Alle edities', href: `#edities` },
    { icon: 'CreditCard', label: 'Abonneren', href: `/abonnement?magazine=${slug}` },
    { icon: 'Mail', label: 'Contact', href: '/contact' },
  ]

  return (
    <MagazineDetailTemplate1
      name={magazine.name}
      slug={magazine.slug}
      badge={magazine.badge || 'Magazine'}
      title={magazine.heroTitle || magazine.name}
      description={magazine.tagline || undefined}
      richDescription={magazine.description || null}
      logoUrl={logoUrl}
      stats={magazine.stats || undefined}
      uspCards={magazine.uspCards || undefined}
      recentIssues={recentIssues}
      testimonial={
        magazine.testimonial?.quote
          ? {
              initials: magazine.testimonial.initials || '',
              quote: magazine.testimonial.quote,
              authorName: magazine.testimonial.authorName || '',
              authorRole: magazine.testimonial.authorRole || '',
              rating: magazine.testimonial.rating || undefined,
            }
          : undefined
      }
      subscriptionCTA={subscriptionCTA}
      serviceLinks={serviceLinks}
    />
  )
}
