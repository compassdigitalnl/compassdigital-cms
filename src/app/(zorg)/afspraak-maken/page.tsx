import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import AppointmentWizardTemplate from '@/branches/zorg/templates/AppointmentWizard'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Afspraak Maken',
    description: 'Plan eenvoudig online een afspraak in bij onze praktijk',
  }
}

export default async function AfspraakMakenPage() {
  if (!isFeatureEnabled('zorg')) notFound()

  return <AppointmentWizardTemplate />
}
