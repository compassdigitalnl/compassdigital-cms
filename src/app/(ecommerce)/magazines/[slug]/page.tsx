import { getPayload } from 'payload'
import config from '@payload-config'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import MagazineDetailTemplate1 from '@/branches/ecommerce/templates/magazines/MagazineDetailTemplate1'
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
      collection: 'magazines',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    const magazine = docs[0] as any
    if (!magazine) return { title: 'Magazine niet gevonden' }

    return {
      title: magazine.meta?.title || `${magazine.name} - Magazines`,
      description: magazine.meta?.description || magazine.tagline,
    }
  } catch {
    return { title: 'Magazine niet gevonden' }
  }
}

export default async function MagazineDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  if (!isFeatureEnabled('magazines')) notFound()

  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'magazines',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })

  const magazine = docs[0] as any
  if (!magazine) notFound()

  // Map logo URL
  const logoUrl = magazine.logo?.url || null

  // Map editions to MagazineIssue format
  const recentIssues = (magazine.editions || [])
    .slice(0, 6)
    .map((edition: any) => ({
      id: edition.id,
      title: edition.title,
      issueNumber: edition.issueNumber,
      coverUrl: edition.cover?.url || null,
      price: edition.price,
      soldOut: edition.soldOut || false,
      shopUrl: edition.shopUrl,
    }))

  const PERIOD_LABELS: Record<string, string> = {
    monthly: '/maand', quarterly: '/kwartaal', biannual: '/halfjaar', yearly: '/jaar', once: ' eenmalig',
  }

  // Map plans to shared PricingPlan format
  const mappedPlans = (magazine.plans || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    highlighted: p.highlighted || false,
    highlightLabel: p.highlighted ? 'Populairste keuze' : undefined,
    price: p.price,
    priceSuffix: PERIOD_LABELS[p.period] || '',
    buttonLabel: `${p.name} bestellen`,
    buttonVariant: p.highlighted ? 'fill' as const : 'outline' as const,
    features: (p.features || []).map((f: any) => ({
      text: f.text,
      included: f.included ?? true,
    })),
    href: p.externalUrl || `/abonneren/${slug}`,
  }))

  const trustItems = (magazine.trustItems || []).map((t: any) => ({
    icon: t.icon,
    text: t.text,
  }))

  // Build subscription CTA from the highlighted plan (or first plan)
  const highlightedPlan = (magazine.plans || []).find((p: any) => p.highlighted) || (magazine.plans || [])[0]
  const subscriptionCTA = highlightedPlan
    ? {
        title: magazine.ctaTitle || 'Word abonnee',
        description: magazine.ctaDescription,
        price: `€${highlightedPlan.price?.toFixed(2).replace('.', ',')}`,
        priceSuffix: highlightedPlan.period === 'yearly'
          ? 'per jaar'
          : highlightedPlan.period === 'quarterly'
            ? 'per kwartaal'
            : highlightedPlan.period === 'monthly'
              ? 'per maand'
              : highlightedPlan.period === 'once'
                ? 'eenmalig'
                : '',
        buttonLabel: `${highlightedPlan.name} bestellen`,
        buttonHref: `/abonneren/${slug}`,
      }
    : undefined

  return (
    <MagazineDetailTemplate1
      name={magazine.name}
      slug={magazine.slug}
      badge={magazine.badge || 'Magazine'}
      title={magazine.heroTitle || magazine.name}
      description={magazine.tagline}
      richDescription={magazine.description}
      logoUrl={logoUrl}
      stats={magazine.stats}
      uspCards={magazine.uspCards}
      recentIssues={recentIssues}
      plans={mappedPlans}
      trustItems={trustItems}
      testimonial={
        magazine.testimonial?.quote
          ? {
              initials: magazine.testimonial.initials,
              quote: magazine.testimonial.quote,
              authorName: magazine.testimonial.authorName,
              authorRole: magazine.testimonial.authorRole,
              rating: magazine.testimonial.rating,
            }
          : undefined
      }
      subscriptionCTA={subscriptionCTA}
    />
  )
}
