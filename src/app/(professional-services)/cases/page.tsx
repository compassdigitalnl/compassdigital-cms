/**
 * Professional Cases Overview Page
 * Route: /cases
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import { CasesArchiveTemplate } from '@/branches/professional-services/templates'

const siteName = process.env.SITE_NAME || 'Dienstverlening'

export const metadata: Metadata = {
  title: `Onze Cases - ${siteName}`,
  description:
    'Bekijk onze succesvolle cases en samenwerkingen. Ontdek wat wij voor uw bedrijf kunnen betekenen.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/cases`,
  },
}

interface CasesPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function CasesPage({ searchParams }: CasesPageProps) {
  if (!isFeatureEnabled('professional_services')) notFound()

  const params = await searchParams
  const payload = await getPayload({ config })
  const currentPage = parseInt(params.page || '1')

  const { docs: categories } = await payload.find({
    collection: 'professional-services',
    where: { status: { equals: 'published' } },
    depth: 0,
    limit: 100,
  })

  let featuredCase: any = null
  try {
    const { docs: featuredDocs } = await payload.find({
      collection: 'professional-cases',
      where: {
        status: { equals: 'published' },
        featured: { equals: true },
      },
      depth: 2,
      limit: 1,
      sort: '-createdAt',
    })
    featuredCase = featuredDocs[0] || null
  } catch {
    /* fail silently */
  }

  const where: any = { status: { equals: 'published' } }
  if (featuredCase) {
    where.id = { not_equals: featuredCase.id }
  }

  const { docs: cases, totalPages } = await payload.find({
    collection: 'professional-cases',
    where,
    depth: 2,
    limit: 24,
    page: currentPage,
    sort: '-createdAt',
  })

  return (
    <CasesArchiveTemplate
      cases={cases}
      categories={categories}
      totalPages={totalPages}
      currentPage={currentPage}
      featuredCase={featuredCase}
    />
  )
}
