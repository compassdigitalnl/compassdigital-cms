import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { ValuationWizardTemplate } from '@/branches/vastgoed/templates/ValuationWizard'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Gratis Waardebepaling',
    description: 'Vraag een gratis en vrijblijvende waardebepaling aan voor uw woning. Onze makelaars komen graag bij u langs.',
  }
}

export default async function WaardebepalingPage() {
  if (!isFeatureEnabled('real_estate')) notFound()

  return <ValuationWizardTemplate />
}
