import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import { ProjectCard } from '@/branches/shared/components/ProjectCard'
import type { ProjectsGridBlockProps } from './types'

const gridColsClasses: Record<string, string> = {
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

export async function ProjectsGridBlockComponent(props: ProjectsGridBlockProps) {
  const {
    heading,
    projectsSource = 'auto',
    projects: manualProjects,
    branch,
    limit = 6,
    columns = '3',
    ctaButton,
    enableAnimation,
    animationType,
    animationDuration,
    animationDelay,
  } = props

  const payload = await getPayload({ config })
  let projects: any[] = []

  if (projectsSource === 'manual' && manualProjects) {
    if (Array.isArray(manualProjects)) {
      projects = manualProjects.filter(
        (p): p is any => typeof p === 'object' && p !== null,
      )
      if (projects.length === 0 && manualProjects.length > 0) {
        const ids = manualProjects.filter((id): id is number => typeof id === 'number')
        if (ids.length > 0) {
          const result = await payload.find({
            collection: 'projects',
            where: { id: { in: ids } },
            depth: 1,
          })
          projects = result.docs
        }
      }
    }
  } else {
    const where: any = { status: { equals: 'published' } }

    if (projectsSource === 'featured') {
      where.featured = { equals: true }
    } else if (projectsSource === 'branch' && branch) {
      where.branch = { equals: branch }
    }

    const result = await payload.find({
      collection: 'projects',
      where,
      limit: limit || 6,
      sort: '-createdAt',
      depth: 1,
    })
    projects = result.docs
  }

  if (projects.length === 0) return null

  const gridClass = gridColsClasses[columns || '3'] || gridColsClasses['3']

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="projects-grid-block py-12 md:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        {heading && (heading.title || heading.description) && (
          <div className="mb-8 text-center md:mb-12">
            {heading.badge && (
              <div className="mb-3 inline-block rounded-full bg-teal/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal">
                {heading.badge}
              </div>
            )}
            {heading.title && (
              <h2 className="mb-3 font-display text-2xl text-navy md:text-3xl lg:text-4xl">
                {heading.title}
              </h2>
            )}
            {heading.description && (
              <p className="mx-auto max-w-2xl text-sm text-grey-dark md:text-base">
                {heading.description}
              </p>
            )}
          </div>
        )}

        <div className={`grid ${gridClass} gap-6`}>
          {projects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {ctaButton?.enabled && (
          <div className="mt-10 text-center">
            <Link
              href={ctaButton.link || '/projects'}
              className="inline-flex items-center gap-2 rounded-lg bg-teal px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-dark"
            >
              {ctaButton.text || 'Bekijk alle projecten'}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </AnimationWrapper>
  )
}

export default ProjectsGridBlockComponent
