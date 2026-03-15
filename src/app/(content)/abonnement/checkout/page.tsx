import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import SubscriptionCheckoutTemplate1 from '@/branches/publishing/templates/subscription/SubscriptionCheckoutTemplate1'
import type { PricingPlan } from '@/branches/shared/components/ui/ecommerce/pricing/PricingPlanCard/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Checkout — Abonnement',
  description: 'Rond je abonnement af. Veilig betalen en direct toegang.',
}

export default async function AbonnementCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>
}) {
  if (!isFeatureEnabled('publishing')) notFound()

  const params = await searchParams
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

  if (rawPlans.length === 0) {
    notFound()
  }

  // Map plans to the shape expected by the checkout template
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
      buttonLabel: 'Selecteer',
      buttonVariant: 'outline' as const,
    }
  })

  // Determine which plan is pre-selected from query param
  const selectedPlan = params.plan
    ? rawPlans.find((p: any) => p.slug === params.plan)
    : rawPlans.find((p: any) => p.featured) || rawPlans[0]

  const selectedPlanId = selectedPlan?.id || plans[0]?.id

  // Checkout steps
  const steps = [
    { label: 'Kies plan', status: 'done' as const },
    { label: 'Gegevens', status: 'active' as const },
    { label: 'Betaling', status: 'pending' as const },
  ]

  // Summary sections based on selected plan
  const selectedPlanData = selectedPlan as any
  const planPrice = selectedPlanData
    ? `${Number(selectedPlanData.price).toFixed(2).replace('.', ',')}`
    : '0,00'
  const billingLabel =
    selectedPlanData?.billingInterval === 'monthly'
      ? 'per maand'
      : selectedPlanData?.billingInterval === 'yearly'
        ? 'per jaar'
        : ''

  const summarySections = [
    {
      label: 'Abonnement',
      rows: [
        { label: selectedPlanData?.name || 'Plan', value: `EUR ${planPrice}` },
        { label: 'Facturatie', value: billingLabel || 'Eenmalig' },
      ],
    },
  ]

  // Trust items
  const trustItems = [
    { icon: 'check', text: 'Veilig betalen' },
    { icon: 'check', text: 'Direct toegang' },
    { icon: 'check', text: 'Altijd opzegbaar' },
  ]

  return (
    <SubscriptionCheckoutTemplate1
      steps={steps}
      plans={plans}
      selectedPlanId={selectedPlanId}
      summarySections={summarySections}
      totalLabel="Totaal"
      totalValue={`EUR ${planPrice}`}
      totalSubtext={billingLabel}
      confirmLabel="Afrekenen"
      confirmNote="Je wordt doorgestuurd naar onze beveiligde betaalpagina."
      trustItems={trustItems}
    />
  )
}
