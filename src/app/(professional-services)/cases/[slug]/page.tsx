/**
 * Professional Case Detail Page
 * Route: /cases/[slug]
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { CaseDetailTemplate } from '@/branches/professional-services/templates'
import {
  buildProfessionalCaseSchema,
  buildLocalBusinessSchema,
} from '@/features/seo/lib/schema-builders'

interface CaseDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: CaseDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'professional-cases',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
  })

  const caseItem = docs[0]

  if (!caseItem) {
    return { title: 'Case niet gevonden' }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const imageUrl =
    typeof caseItem.featuredImage === 'object' && caseItem.featuredImage !== null
      ? caseItem.featuredImage.url
      : null

  return {
    title: caseItem.meta?.title || `${caseItem.title} - Onze Cases`,
    description: caseItem.meta?.description || caseItem.shortDescription,
    alternates: {
      canonical: `${siteUrl}/cases/${slug}`,
    },
    openGraph: {
      title: caseItem.meta?.title || caseItem.title,
      description: caseItem.meta?.description || caseItem.shortDescription,
      url: `${siteUrl}/cases/${slug}`,
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
  }
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  if (!isFeatureEnabled('professional_services')) notFound()

  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'professional-cases',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    depth: 3,
    limit: 1,
  })

  const caseItem = docs[0]

  if (!caseItem) {
    notFound()
  }

  // JSON-LD structured data
  let jsonLdSchemas: object[] = []
  try {
    const settings = await payload.findGlobal({ slug: 'settings' })
    if (settings.enableJSONLD) {
      const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
      jsonLdSchemas.push(buildLocalBusinessSchema(settings, siteUrl))
      jsonLdSchemas.push(buildProfessionalCaseSchema(caseItem, settings, siteUrl))
    }
  } catch {
    /* fail silently */
  }

  return (
    <>
      {jsonLdSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <CaseDetailTemplate case={caseItem} />
    </>
  )
}
