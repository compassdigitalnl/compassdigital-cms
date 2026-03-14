import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import ReservationWizardTemplate from '@/branches/horeca/templates/ReservationWizard'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Reserveren',
    description: 'Reserveer online een tafel',
  }
}

export default async function ReserverenPage() {
  if (!isFeatureEnabled('horeca')) notFound()

  return <ReservationWizardTemplate />
}
