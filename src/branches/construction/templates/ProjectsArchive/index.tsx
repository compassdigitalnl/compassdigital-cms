import React from 'react'
import Link from 'next/link'
import { FeaturedCard } from '@/branches/shared/components/ui/marketing/FeaturedCard'
import { ProjectCard } from '@/branches/construction/components/ProjectCard'
import type { ProjectsArchiveProps } from './types'
import type { Media } from '@/payload-types'

export function ProjectsArchiveTemplate({ projects, categories, totalPages, currentPage, featuredProject }: ProjectsArchiveProps) {
  const featuredImage = featuredProject
    ? (typeof (featuredProject as any).featuredImage === 'object' ? ((featuredProject as any).featuredImage as Media)?.url : null)
    : null
  const featuredCategory = featuredProject && typeof featuredProject.category === 'object' ? featuredProject.category?.title : null

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-grey-mid">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-navy">Projecten</span>
        </nav>
      </div>

      <section className="bg-gradient-to-br from-secondary to-secondary/90 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="font-display text-3xl text-white md:text-4xl lg:text-5xl">Onze projecten</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">Bekijk een selectie van onze recent afgeronde projecten.</p>
          <div className="mt-6 flex items-center justify-center gap-8">
            <div className="text-center"><div className="text-2xl font-bold text-white">{projects.length}+</div><div className="text-sm text-white/60">Projecten</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-white">{categories.length}</div><div className="text-sm text-white/60">Categorieën</div></div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {featuredProject && featuredImage && (
          <div className="mb-12">
            <FeaturedCard
              title={featuredProject.title}
              description={(featuredProject as any).shortDescription || ''}
              imageUrl={featuredImage}
              imageAlt={featuredProject.title}
              badge={featuredCategory || 'Uitgelicht'}
              meta={[
                ...((featuredProject as any).location ? [{ icon: '📍', text: (featuredProject as any).location }] : []),
                ...((featuredProject as any).year ? [{ icon: '📅', text: String((featuredProject as any).year) }] : []),
              ]}
              href={'/projecten/' + featuredProject.slug}
              ctaText="Bekijk project"
            />
          </div>
        )}

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
          </div>
        ) : (
          <div className="py-12 text-center text-grey-mid">Geen projecten gevonden.</div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Link key={i} href={'/projecten' + (i > 0 ? '?page=' + (i + 1) : '')}
                className={'flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ' + (currentPage === i + 1 ? 'bg-primary text-white' : 'bg-grey-light text-grey-dark hover:bg-grey')}>
                {i + 1}
              </Link>
            ))}
          </div>
        )}

        <section className="mt-16 rounded-2xl bg-gradient-to-br from-navy to-navy-light p-8 text-center md:p-12">
          <h2 className="font-display text-2xl text-white md:text-3xl">Klaar voor uw eigen project?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">Neem contact op voor een vrijblijvend adviesgesprek.</p>
          <Link href="/offerte-aanvragen" className="btn btn-primary mt-6 inline-flex items-center gap-2">Gratis offerte aanvragen</Link>
        </section>
      </div>
    </div>
  )
}

export default ProjectsArchiveTemplate
