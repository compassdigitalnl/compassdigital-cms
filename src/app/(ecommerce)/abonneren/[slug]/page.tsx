import { getPayload } from 'payload'
import config from '@payload-config'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/globals/site/breadcrumbs/components/Breadcrumbs'
import { MagazinePricingPlans } from '@/branches/ecommerce/components/magazines/MagazinePricingPlans/Component'
import type { SubscriptionPlan, TrustItem } from '@/branches/ecommerce/components/magazines/MagazinePricingPlans/types'
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
    if (!magazine) return { title: 'Abonnement niet gevonden' }

    return {
      title: magazine.meta?.title || `Abonneren op ${magazine.name}`,
      description: magazine.meta?.description || `Kies je ${magazine.name} abonnement en ontvang het magazine thuis.`,
    }
  } catch {
    return { title: 'Abonnement niet gevonden' }
  }
}

export default async function SubscribePage({
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

  const plans: SubscriptionPlan[] = (magazine.plans || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    highlighted: p.highlighted || false,
    price: p.price,
    period: p.period || 'yearly',
    editions: p.editions,
    features: (p.features || []).map((f: any) => ({
      text: f.text,
      included: f.included ?? true,
    })),
    externalUrl: p.externalUrl,
  }))

  const trustItems: TrustItem[] = (magazine.trustItems || []).map((t: any) => ({
    icon: t.icon,
    text: t.text,
  }))

  return (
    <div className="min-h-screen bg-theme-bg">
      <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width, 1792px)' }}>
        <Breadcrumbs
          items={[
            { label: 'Magazines', href: '/magazines' },
            { label: magazine.name, href: `/magazines/${slug}` },
          ]}
          currentPage="Abonneren"
        />
      </div>

      <div className="mx-auto px-6 pb-16" style={{ maxWidth: 'var(--container-width, 1792px)' }}>
        <MagazinePricingPlans
          magazineName={magazine.name}
          magazineSlug={slug}
          plans={plans}
          trustItems={trustItems}
          className="py-10"
        />
      </div>
    </div>
  )
}
