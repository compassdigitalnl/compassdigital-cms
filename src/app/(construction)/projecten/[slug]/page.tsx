/**
 * Construction Project Detail Page
 *
 * Displays detailed information about a specific project with before/after images.
 * Route: /projecten/[slug]
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { ConstructionProject } from '@/payload-types'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { ProjectDetailTemplate } from '@/branches/construction/templates'
import { buildConstructionProjectSchema, buildLocalBusinessSchema } from '@/features/seo/lib/schema-builders'

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'construction-projects',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
  })

  const project = docs[0]

  if (!project) {
    return {
      title: 'Project niet gevonden',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const imageUrl = typeof project.featuredImage === 'object' && project.featuredImage !== null ? project.featuredImage.url : null

  return {
    title: project.meta?.title || `${project.title} - Onze Projecten`,
    description: project.meta?.description || project.shortDescription,
    alternates: {
      canonical: `${siteUrl}/projecten/${slug}`,
    },
    openGraph: {
      title: project.meta?.title || project.title,
      description: project.meta?.description || project.shortDescription,
      url: `${siteUrl}/projecten/${slug}`,
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  if (!isFeatureEnabled('construction')) notFound()

  const { slug } = await params
  const payload = await getPayload({ config })

  // Fetch project
  const { docs } = await payload.find({
    collection: 'construction-projects',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    depth: 3,
    limit: 1,
  })

  const project = docs[0] as ConstructionProject

  if (!project) {
    notFound()
  }

  // JSON-LD structured data
  let jsonLdSchemas: object[] = []
  try {
    const settings = await payload.findGlobal({ slug: 'settings' })
    if (settings.enableJSONLD) {
      const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
      jsonLdSchemas.push(buildLocalBusinessSchema(settings, siteUrl))
      jsonLdSchemas.push(buildConstructionProjectSchema(project, settings, siteUrl))
    }
  } catch { /* fail silently */ }

  return (
    <>
      {jsonLdSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ProjectDetailTemplate project={project} />
    </>
  )
}
