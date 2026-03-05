import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import BrancheDetailTemplate1 from '@/branches/ecommerce/templates/branches/BrancheDetailTemplate1'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// TODO: Replace with CMS data when branches collection exists
const branchesData: Record<string, any> = {
  huisartsen: {
    name: 'Huisartsen',
    slug: 'huisartsen',
    badge: 'Branche',
    title: 'Alles voor de huisartsenpraktijk',
    description: 'Van diagnostiek tot verbruiksmateriaal — speciaal samengesteld voor de huisarts. Profiteer van B2B-prijzen, snelle levering en persoonlijk advies.',
    icon: 'Stethoscope',
    stats: [
      { value: '1.240', label: 'Producten' },
      { value: '48', label: 'Merken' },
      { value: '96%', label: 'Op voorraad' },
    ],
    uspCards: [
      { icon: 'Tag', iconColor: '#00897B', iconBg: 'rgba(0,137,123,0.12)', title: 'B2B prijzen', description: 'Exclusieve kortingen voor zorgprofessionals' },
      { icon: 'Truck', iconColor: '#00C853', iconBg: '#E8F5E9', title: 'Volgende dag geleverd', description: 'Besteld voor 16:00, morgen in de praktijk' },
      { icon: 'ClipboardList', iconColor: '#2196F3', iconBg: '#E3F2FD', title: 'Bestellijsten', description: 'Sla vaste bestellingen op voor snel herbestellen' },
      { icon: 'Headphones', iconColor: '#F59E0B', iconBg: '#FFF8E1', title: 'Persoonlijk advies', description: 'Productspecialisten die uw praktijk kennen' },
    ],
    testimonial: {
      initials: 'JV',
      quote: 'Sinds we met Plastimed werken, zijn onze bestellingen een stuk eenvoudiger. De bestellijsten-functie bespaart ons elke maand minstens een uur. En de levering is altijd op tijd.',
      authorName: 'Dr. Jan de Vries',
      authorRole: 'Huisarts — Huisartsenpraktijk De Vries, Beverwijk',
      rating: 5,
    },
    ctaTitle: 'Klaar om te bestellen?',
    ctaDescription: 'Word klant en profiteer direct van exclusieve B2B-prijzen en gratis verzending vanaf \u20AC150.',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = branchesData[slug]

  if (!data) return { title: 'Branche niet gevonden' }

  return {
    title: `${data.name} - Branches`,
    description: data.description,
  }
}

export default async function BrancheDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  if (!isFeatureEnabled('shop')) notFound()

  const { slug } = await params
  const data = branchesData[slug]

  if (!data) notFound()

  return (
    <BrancheDetailTemplate1
      name={data.name}
      slug={data.slug}
      badge={data.badge}
      title={data.title}
      description={data.description}
      icon={data.icon}
      stats={data.stats}
      uspCards={data.uspCards}
      testimonial={data.testimonial}
      ctaTitle={data.ctaTitle}
      ctaDescription={data.ctaDescription}
    />
  )
}
