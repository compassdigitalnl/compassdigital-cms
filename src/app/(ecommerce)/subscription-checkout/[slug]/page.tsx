import { getPayload } from 'payload'
import config from '@payload-config'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound, redirect } from 'next/navigation'
import SubscriptionCheckoutClient from './SubscriptionCheckoutClient'
import type { PricingPlan } from '@/branches/shared/components/ui/pricing/PricingPlanCard/types'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const PERIOD_LABELS: Record<string, string> = {
  monthly: '/maand',
  quarterly: '/kwartaal',
  biannual: '/halfjaar',
  yearly: '/jaar',
  once: ' eenmalig',
}

const PERIOD_BILLED: Record<string, string> = {
  monthly: 'Maandelijks gefactureerd',
  quarterly: 'Per kwartaal gefactureerd',
  biannual: 'Halfjaarlijks gefactureerd',
  yearly: 'Jaarlijks gefactureerd',
  once: 'Eenmalige betaling',
}

function mapPlans(rawPlans: any[], magazineSlug: string): PricingPlan[] {
  return rawPlans.map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    highlighted: p.highlighted || false,
    highlightLabel: p.highlighted ? 'Populairste keuze' : undefined,
    price: p.price,
    priceSuffix: PERIOD_LABELS[p.period] || '',
    billedLabel: PERIOD_BILLED[p.period] || '',
    buttonLabel: `${p.name} bestellen`,
    buttonVariant: p.highlighted ? 'fill' : 'outline',
    features: (p.features || []).map((f: any) => ({
      text: f.text,
      included: f.included ?? true,
    })),
    href: p.externalUrl || undefined,
  }))
}


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
      title: `Checkout — ${magazine.name} abonnement`,
      description: `Rond je ${magazine.name} abonnement af.`,
    }
  } catch {
    return { title: 'Abonnement niet gevonden' }
  }
}

export default async function SubscriptionCheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ plan?: string }>
}) {
  if (!isFeatureEnabled('magazines')) notFound()

  const { slug } = await params
  const { plan: selectedPlanParam } = await searchParams
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'magazines',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })

  const magazine = docs[0] as any
  if (!magazine) notFound()

  const plans = mapPlans(magazine.plans || [], slug)
  if (plans.length === 0) redirect(`/magazines/${slug}`)

  // Pre-select plan if ?plan= param provided, otherwise highlighted or first
  const selectedPlan = selectedPlanParam
    ? plans.find((p) => String(p.id) === selectedPlanParam) || plans[0]
    : plans.find((p) => p.highlighted) || plans[0]

  return (
    <SubscriptionCheckoutClient
      magazineName={magazine.name}
      magazineSlug={slug}
      plans={plans}
      selectedPlanId={selectedPlan.id}
    />
  )
}
