/**
 * ProjectsGridComponent - Projects grid block (SERVER COMPONENT)
 *
 * Features:
 * - Auto-fetch from construction-projects collection
 * - Featured projects filtering
 * - Manual project selection
 * - Category filtering
 * - Configurable columns
 * - Optional CTA button
 */

import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Icon } from '@/branches/shared/components/common/Icon'
import { ProjectCard } from '@/branches/construction/components/ProjectCard'
import type { ProjectsGridProps, ConstructionProject } from './types'

export async function ProjectsGridComponent(props: ProjectsGridProps) {
  const {
    heading,
    projectsSource = 'auto',
    projects: manualProjects,
    category,
    limit = 6,
    columns = '3',
    showFilter = false,
    ctaButton,
  } = props

  // Fetch projects based on source
  let projects: ConstructionProject[] = []
  const payload = await getPayload({ config })

  if (projectsSource === 'auto') {
    // All published projects
    const result = await payload.find({
      collection: 'construction-projects',
      where: { status: { equals: 'published' } },
      limit: limit || 6,
      sort: '-createdAt',
    })
    projects = result.docs
  } else if (projectsSource === 'featured') {
    // Featured projects only
    const result = await payload.find({
      collection: 'construction-projects',
      where: {
        and: [
          { status: { equals: 'published' } },
          { featured: { equals: true } },
        ],
      },
      limit: limit || 6,
      sort: '-createdAt',
    })
    projects = result.docs
  } else if (projectsSource === 'category' && category) {
    // Filter by category/service
    const categoryId = typeof category === 'object' ? category.id : category
    const result = await payload.find({
      collection: 'construction-projects',
      where: {
        and: [
          { status: { equals: 'published' } },
          { serviceCategory: { equals: categoryId } },
        ],
      },
      limit: limit || 6,
      sort: '-createdAt',
    })
    projects = result.docs
  } else if (projectsSource === 'manual' && manualProjects) {
    // Manual selection
    if (Array.isArray(manualProjects)) {
      projects = manualProjects.filter(
        (project): project is ConstructionProject =>
          typeof project === 'object' && project !== null
      )

      // If we have IDs, resolve them
      if (projects.length === 0 && manualProjects.length > 0) {
        const ids = manualProjects.filter((id): id is number => typeof id === 'number')
        if (ids.length > 0) {
          const result = await payload.find({
            collection: 'construction-projects',
            where: { id: { in: ids } },
          })
          projects = result.docs
        }
      }
    }
  }

  if (projects.length === 0) {
    return (
      <section className="py-12 md:py-16 lg:py-20 px-4">
        <div className="container mx-auto text-center">
          <p className="text-grey-mid">Geen projecten beschikbaar.</p>
        </div>
      </section>
    )
  }

  // Grid columns
  const gridColsClasses = {
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }
  const gridClass = gridColsClasses[columns || '3'] || gridColsClasses['3']

  return (
    <section className="py-12 md:py-16 lg:py-20 px-4">
      <div className="container mx-auto">
        {/* Heading */}
        {heading && (
          <div className="text-center mb-12">
            {heading.badge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-glow border border-primary/20 rounded-full text-sm text-primary font-semibold mb-4">
                <span>{heading.badge}</span>
              </div>
            )}

            {heading.title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-secondary-color mb-4">
                {heading.title}
              </h2>
            )}

            {heading.description && (
              <p className="text-lg text-grey-mid max-w-3xl mx-auto">{heading.description}</p>
            )}
          </div>
        )}

        {/* Projects Grid */}
        <div className={`grid ${gridClass} gap-6`}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} variant="default" />
          ))}
        </div>

        {/* CTA Button */}
        {ctaButton?.enabled && (
          <div className="text-center mt-12">
            <Link
              href={ctaButton.link || '/projecten'}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              {ctaButton.text || 'Bekijk alle projecten'}
              <Icon name="ArrowRight" size={20} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
