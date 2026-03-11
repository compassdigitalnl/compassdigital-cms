/**
 * Consultation Request Page
 * Route: /adviesgesprek-aanvragen
 */

import type { Metadata } from 'next'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import { ConsultationRequestTemplate } from '@/branches/professional-services/templates'

const siteName = process.env.SITE_NAME || 'Dienstverlening'

export const metadata: Metadata = {
  title: `Adviesgesprek Aanvragen - ${siteName}`,
  description: 'Vraag vrijblijvend een adviesgesprek aan. Wij reageren binnen 24 uur.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/adviesgesprek-aanvragen`,
  },
}

export default function AdviesgesprekAanvragenPage() {
  if (!isFeatureEnabled('professional_services')) notFound()

  const phone = process.env.CONTACT_PHONE || '020 123 4567'

  return <ConsultationRequestTemplate phone={phone} />
}
