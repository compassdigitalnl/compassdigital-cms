/**
 * Professional Service Detail Page
 * Route: /dienstverlening/[slug]
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { ServiceDetailTemplate } from '@/branches/professional-services/templates'
import {
  buildProfessionalServiceSchema,
  buildLocalBusinessSchema,
} from '@/features/seo/lib/schema-builders'

interface ServiceDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'professional-services',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
  })

  const service = docs[0]

  if (!service) {
    return { title: 'Dienst niet gevonden' }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const imageUrl =
    typeof service.heroImage === 'object' && service.heroImage !== null
      ? service.heroImage.url
      : null

  return {
    title: service.meta?.title || `${service.title} - Onze Diensten`,
    description: service.meta?.description || service.shortDescription,
    alternates: {
      canonical: `${siteUrl}/dienstverlening/${slug}`,
    },
    openGraph: {
      title: service.meta?.title || service.title,
      description: service.meta?.description || service.shortDescription,
      url: `${siteUrl}/dienstverlening/${slug}`,
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
  }
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  if (!isFeatureEnabled('professional_services')) notFound()

  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'professional-services',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    depth: 2,
    limit: 1,
  })

  const service = docs[0]

  if (!service) {
    notFound()
  }

  // JSON-LD structured data
  let jsonLdSchemas: object[] = []
  try {
    const settings = await payload.findGlobal({ slug: 'settings' })
    if (settings.enableJSONLD) {
      const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
      jsonLdSchemas.push(buildLocalBusinessSchema(settings, siteUrl))
      jsonLdSchemas.push(buildProfessionalServiceSchema(service, settings, siteUrl))
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
      <ServiceDetailTemplate service={service} />
    </>
  )
}
