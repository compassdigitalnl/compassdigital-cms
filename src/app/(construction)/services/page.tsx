/**
 * Construction Services Overview Page
 *
 * Displays all active construction services.
 * Route: /diensten
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import { ServicesArchiveTemplate } from '@/branches/construction/templates'

const siteName = process.env.SITE_NAME || 'Bouwbedrijf'

export const metadata: Metadata = {
  title: `Onze Diensten - ${siteName}`,
  description: 'Ontdek ons complete aanbod van bouwdiensten. Van nieuwbouw tot renovatie en aanbouw.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/diensten`,
  },
}

interface DienstenPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function DienstenPage({ searchParams }: DienstenPageProps) {
  if (!isFeatureEnabled('construction')) notFound()

  const params = await searchParams
  const payload = await getPayload({ config })
  const currentPage = parseInt(params.page || '1')

  // Fetch services
  const { docs: services, totalPages } = await payload.find({
    collection: 'construction-services',
    where: { status: { equals: 'published' } },
    depth: 1,
    limit: 24,
    page: currentPage,
    sort: 'title',
  })

  return (
    <ServicesArchiveTemplate
      services={services}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  )
}
