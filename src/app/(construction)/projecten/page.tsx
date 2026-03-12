/**
 * Construction Projects Overview Page
 *
 * Displays all published construction projects with filtering.
 * Route: /projecten
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { ConstructionProject } from '@/payload-types'
import type { Metadata } from 'next'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import { ProjectsArchiveTemplate } from '@/branches/construction/templates'

const siteName = process.env.SITE_NAME || 'Bouwbedrijf'

export const metadata: Metadata = {
  title: `Onze Projecten - ${siteName}`,
  description: 'Bekijk onze gerealiseerde bouwprojecten. Van nieuwbouw tot renovatie - ontdek wat we voor u kunnen betekenen.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/projecten`,
  },
}

interface ProjectenPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function ProjectenPage({ searchParams }: ProjectenPageProps) {
  if (!isFeatureEnabled('construction')) notFound()

  const params = await searchParams
  const payload = await getPayload({ config })
  const currentPage = parseInt(params.page || '1')

  // Fetch categories for stats
  const { docs: categories } = await payload.find({
    collection: 'construction-services',
    where: { status: { equals: 'published' } },
    depth: 0,
    limit: 100,
  })

  // Fetch featured project
  let featuredProject: ConstructionProject | null = null
  try {
    const { docs: featuredDocs } = await payload.find({
      collection: 'construction-projects',
      where: {
        status: { equals: 'published' },
        featured: { equals: true },
      },
      depth: 2,
      limit: 1,
      sort: '-createdAt',
    })
    featuredProject = featuredDocs[0] || null
  } catch { /* fail silently */ }

  // Fetch projects (exclude featured from grid)
  const where: any = { status: { equals: 'published' } }
  if (featuredProject) {
    where.id = { not_equals: featuredProject.id }
  }

  const { docs: projects, totalPages } = await payload.find({
    collection: 'construction-projects',
    where,
    depth: 2,
    limit: 24,
    page: currentPage,
    sort: '-createdAt',
  })

  return (
    <ProjectsArchiveTemplate
      projects={projects}
      categories={categories}
      totalPages={totalPages}
      currentPage={currentPage}
      featuredProject={featuredProject}
    />
  )
}
