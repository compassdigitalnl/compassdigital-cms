/**
 * Quote Request Page
 *
 * Multi-step form for requesting construction quotes.
 * Route: /offerte-aanvragen
 */

import type { Metadata } from 'next'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import { QuoteRequestTemplate } from '@/branches/construction/templates'

const siteName = process.env.SITE_NAME || 'Bouwbedrijf'

export const metadata: Metadata = {
  title: `Offerte Aanvragen - ${siteName}`,
  description: 'Vraag vrijblijvend een offerte aan voor uw bouwproject. Wij reageren binnen 24 uur.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/offerte-aanvragen`,
  },
}

export default function OfferteAanvragenPage() {
  if (!isFeatureEnabled('construction')) notFound()

  const phone = process.env.CONTACT_PHONE || '0251-247233'

  return <QuoteRequestTemplate phone={phone} />
}
