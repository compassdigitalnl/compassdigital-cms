import { getPayload } from 'payload'
import config from '@payload-config'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/globals/site/breadcrumbs/components/Breadcrumbs'
import SubscriptionPricingTemplate1 from '@/branches/publishing/templates/subscription/SubscriptionPricingTemplate1'
import SubscriptionCheckoutTemplate1 from '@/branches/publishing/templates/subscription/SubscriptionCheckoutTemplate1'
import type { PricingPlan } from '@/branches/shared/components/ui/pricing/PricingPlanCard/types'
import type { Metadata } from 'next'

interface TrustItem {
  icon: string
  text: string
}

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
    href: p.externalUrl || `/abonneren/${magazineSlug}?plan=${p.id}`,
  }))
}

function mapTrustItems(rawItems: any[]): TrustItem[] {
  return rawItems.map((t: any) => ({
    icon: t.icon,
    text: t.text,
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
      title: `Abonneren op ${magazine.name}`,
      description: `Kies je ${magazine.name} abonnement en ontvang het magazine thuis.`,
    }
  } catch {
    return { title: 'Abonnement niet gevonden' }
  }
}

export default async function SubscribePage({
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
  const trustItems = mapTrustItems(magazine.trustItems || [])

  const isCheckout = !!selectedPlanParam
  const selectedPlan = selectedPlanParam
    ? plans.find((p) => String(p.id) === selectedPlanParam) || plans[0]
    : undefined

  return (
    <div className="min-h-screen bg-[var(--color-background,#F5F7FA)]">
      <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width, 1200px)' }}>
        <Breadcrumbs
          items={[
            { label: 'Magazines', href: '/magazines' },
            { label: magazine.name, href: `/magazines/${slug}` },
          ]}
          currentPage="Abonneren"
        />
      </div>

      {isCheckout && selectedPlan ? (
        /* Template 2: Checkout layout (1fr 380px) */
        <SubscriptionCheckoutTemplate1
          steps={[
            { label: 'Plan kiezen', status: 'done' },
            { label: 'Gegevens', status: 'active' },
            { label: 'Betalen', status: 'pending' },
            { label: 'Bevestiging', status: 'pending' },
          ]}
          plans={plans}
          selectedPlanId={selectedPlan.id}
          summarySections={[
            {
              label: 'Abonnement',
              rows: [
                {
                  label: `${magazine.name} — ${selectedPlan.name}`,
                  value: `€${selectedPlan.price?.toFixed(2).replace('.', ',')}`,
                },
              ],
            },
          ]}
          totalLabel="Totaal"
          totalValue={`€${selectedPlan.price?.toFixed(2).replace('.', ',')}`}
          totalSubtext={selectedPlan.priceSuffix || ''}
          confirmLabel={`Bestelling plaatsen — €${selectedPlan.price?.toFixed(2).replace('.', ',')}`}
          confirmNote="Door te bestellen ga je akkoord met de voorwaarden."
          trustItems={trustItems.length > 0 ? trustItems : [
            { icon: 'Zap', text: 'Direct actief na betaling' },
            { icon: 'RotateCcw', text: '30 dagen geld-terug-garantie' },
            { icon: 'ShieldCheck', text: 'Veilig betalen' },
            { icon: 'Lock', text: 'Beveiligde verbinding (SSL)' },
          ]}
          summarySubtitle={`${magazine.name} abonnement`}
        />
      ) : (
        /* Template 1: Pricing page (plans naast elkaar) */
        <SubscriptionPricingTemplate1
          badge={magazine.badge || 'Abonnementen'}
          title={`Word ${magazine.name} abonnee`}
          subtitle={`Kies het abonnement dat bij je past en ontvang ${magazine.name} thuis.`}
          plans={plans}
          trustItems={trustItems.length > 0 ? trustItems : [
            { icon: 'Zap', text: 'Direct actief na betaling' },
            { icon: 'RotateCcw', text: '14 dagen bedenktijd' },
            { icon: 'ShieldCheck', text: 'Veilig betalen' },
            { icon: 'Lock', text: 'Op elk moment opzegbaar' },
          ]}
          faqItems={[
            { question: 'Hoe snel ontvang ik mijn eerste editie?', answer: 'Na je bestelling ontvang je de eerstvolgende editie zodra deze verschijnt. Bij een lopende editie sturen we deze binnen een week op.' },
            { question: 'Kan ik mijn abonnement opzeggen?', answer: 'Ja, je kunt op elk moment opzeggen. Je ontvangt dan alle edities tot het einde van je lopende abonnementsperiode.' },
            { question: 'Welke betaalmethoden worden geaccepteerd?', answer: 'We accepteren iDEAL, creditcard, SEPA-incasso en bankoverschrijving.' },
            { question: 'Is er een geld-terug-garantie?', answer: 'Ja, als je niet tevreden bent kun je binnen 14 dagen je geld terugkrijgen.' },
          ]}
        />
      )}
    </div>
  )
}
