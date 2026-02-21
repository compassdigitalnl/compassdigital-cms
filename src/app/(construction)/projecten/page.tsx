/**
 * Construction Projects Overview Page
 *
 * Displays all published construction projects with filtering.
 * Route: /projecten
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { ConstructionProject } from '@/payload-types'
import { ProjectCard } from '@/branches/construction/components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Onze Projecten - Bouwbedrijf',
  description: 'Bekijk onze gerealiseerde bouwprojecten. Van nieuwbouw tot renovatie - ontdek wat we voor u kunnen betekenen.',
}

interface ProjectenPageProps {
  searchParams: Promise<{
    category?: string
    search?: string
  }>
}

export default async function ProjectenPage({ searchParams }: ProjectenPageProps) {
  const params = await searchParams
  const payload = await getPayload({ config })

  // Build query
  const where: any = { status: { equals: 'published' } }

  // Filter by category
  if (params.category) {
    where.category = { equals: params.category }
  }

  // Search in title/description
  if (params.search) {
    where.or = [
      { title: { contains: params.search } },
      { shortDescription: { contains: params.search } },
      { location: { contains: params.search } },
    ]
  }

  // Fetch projects
  const { docs: projects } = await payload.find({
    collection: 'construction-projects',
    where,
    depth: 2,
    limit: 50,
    sort: '-completionDate',
  })

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Onze Projecten</h1>
        <p className="text-xl text-gray-600">
          Trots op wat we hebben gerealiseerd. Bekijk onze projecten en laat u inspireren.
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <FilterButton label="Alle projecten" value="" currentCategory={params.category} />
          <FilterButton label="Nieuwbouw" value="new-construction" currentCategory={params.category} />
          <FilterButton label="Renovatie" value="renovation" currentCategory={params.category} />
          <FilterButton label="Aanbouw" value="extension" currentCategory={params.category} />
          <FilterButton label="Restauratie" value="restoration" currentCategory={params.category} />
          <FilterButton label="Zakelijk" value="commercial" currentCategory={params.category} />
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project as ConstructionProject}
                variant="default"
                showTestimonial={false}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">Geen projecten gevonden</p>
        </div>
      )}

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto mt-16 p-8 bg-gray-100 rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">Geïnspireerd geraakt?</h2>
        <p className="text-lg text-gray-600 mb-6">
          Vraag vrijblijvend een offerte aan en bespreek de mogelijkheden voor uw project.
        </p>
        <a
          href="/offerte-aanvragen"
          className="inline-block px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Offerte aanvragen
        </a>
      </div>
    </div>
  )
}

// Filter button component
function FilterButton({
  label,
  value,
  currentCategory,
}: {
  label: string
  value: string
  currentCategory?: string
}) {
  const isActive = currentCategory === value || (!currentCategory && !value)
  const href = value ? `/projecten?category=${value}` : '/projecten'

  return (
    <a
      href={href}
      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
        isActive
          ? 'bg-gray-900 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label}
    </a>
  )
}
