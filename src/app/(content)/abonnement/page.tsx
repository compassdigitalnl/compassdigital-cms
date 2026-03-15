import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import SubscriptionPricingTemplate1 from '@/branches/publishing/templates/subscription/SubscriptionPricingTemplate1'
import type { PricingPlan } from '@/branches/shared/components/ui/ecommerce/pricing/PricingPlanCard/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Abonnement',
  description:
    'Bekijk onze abonnementen en kies het plan dat bij je past. Flexibel opzegbaar, direct toegang.',
}

export default async function AbonnementPage() {
  if (!isFeatureEnabled('publishing')) notFound()

  const payload = await getPayload({ config })

  // Fetch active subscription plans
  const { docs: rawPlans } = await payload.find({
    collection: 'subscription-plans',
    where: {
      active: { equals: true },
    },
    depth: 0,
    limit: 20,
    sort: 'price',
  })

  // Map plans to the shape expected by the pricing template
  const plans: PricingPlan[] = rawPlans.map((plan: any) => {
    const billingLabel =
      plan.billingInterval === 'monthly'
        ? '/ maand'
        : plan.billingInterval === 'yearly'
          ? '/ jaar'
          : ''

    return {
      id: plan.id,
      name: plan.name,
      description: plan.description || undefined,
      price: `${Number(plan.price).toFixed(2).replace('.', ',')}`,
      priceSuffix: billingLabel,
      highlighted: plan.featured || false,
      highlightLabel: plan.featured ? 'Populair' : undefined,
      features: Array.isArray(plan.features)
        ? plan.features.map((f: any) => ({
            text: f.feature,
            included: f.included !== false,
          }))
        : [],
      buttonLabel: plan.featured ? 'Kies dit plan' : 'Selecteer',
      buttonHref: `/abonnement/checkout?plan=${plan.slug}`,
      buttonVariant: plan.featured ? ('fill' as const) : ('outline' as const),
    }
  })

  // Trust items
  const trustItems = [
    { icon: 'check', text: 'Altijd opzegbaar' },
    { icon: 'check', text: 'Geen verborgen kosten' },
    { icon: 'check', text: 'Veilig betalen met iDEAL' },
    { icon: 'check', text: '30 dagen geld-terug-garantie' },
  ]

  return (
    <SubscriptionPricingTemplate1
      badge="Abonnementen"
      title="Kies het abonnement dat bij je past"
      subtitle="Flexibel opzegbaar, geen verborgen kosten. Start vandaag en krijg direct toegang."
      plans={plans}
      showToggle={false}
      trustItems={trustItems}
    />
  )
}
