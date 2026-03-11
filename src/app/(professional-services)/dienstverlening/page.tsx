/**
 * Professional Services Overview Page
 * Route: /dienstverlening
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import { ServicesArchiveTemplate } from '@/branches/professional-services/templates'

const siteName = process.env.SITE_NAME || 'Dienstverlening'

export const metadata: Metadata = {
  title: `Onze Diensten - ${siteName}`,
  description:
    'Ontdek ons complete aanbod van zakelijke diensten. Van accountancy tot IT-consultancy.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/dienstverlening`,
  },
}

interface DienstverleningPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function DienstverleningPage({ searchParams }: DienstverleningPageProps) {
  if (!isFeatureEnabled('professional_services')) notFound()

  const params = await searchParams
  const payload = await getPayload({ config })
  const currentPage = parseInt(params.page || '1')

  const { docs: services, totalPages } = await payload.find({
    collection: 'professional-services',
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
