import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { ProjectCard } from '@/branches/shared/components/ProjectCard'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Projecten - Ons Werk',
    description: 'Bekijk onze projecten en case studies. Van e-commerce tot bouw, van beauty tot horeca — ontdek wat wij voor onze klanten hebben gerealiseerd.',
  }
}

export default async function ProjectsArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const payload = await getPayload({ config })
  const currentPage = Number(pageParam) || 1
  const perPage = 12

  const { docs: projects, totalPages, totalDocs } = await payload.find({
    collection: 'projects',
    where: { status: { equals: 'published' } },
    limit: perPage,
    page: currentPage,
    sort: '-createdAt',
    depth: 1,
  })

  // Get featured projects (first page only)
  let featuredProjects: any[] = []
  if (currentPage === 1) {
    const { docs } = await payload.find({
      collection: 'projects',
      where: { status: { equals: 'published' }, featured: { equals: true } },
      limit: 2,
      depth: 1,
    })
    featuredProjects = docs
  }

  const branchLabels: Record<string, string> = {
    'e-commerce': 'E-commerce',
    'construction': 'Bouw',
    'beauty': 'Beauty',
    'horeca': 'Horeca',
    'zorg': 'Zorg',
    'dienstverlening': 'Dienstverlening',
    'ervaringen': 'Ervaringen',
    'marketplace': 'Marketplace',
    'publishing': 'Publishing',
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-light px-6 py-16 text-center text-white md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
            Portfolio
          </div>
          <h1 className="mb-4 font-display text-3xl md:text-5xl">
            Onze Projecten
          </h1>
          <p className="text-base text-white/80 md:text-lg">
            {totalDocs} {totalDocs === 1 ? 'project' : 'projecten'} — ontdek wat wij voor onze klanten hebben gerealiseerd.
          </p>
        </div>
      </section>

      {/* Branch filter — clean URLs */}
      <section className="border-b border-grey bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2">
          <Link
            href="/projects"
            className="rounded-full bg-navy px-4 py-1.5 text-xs font-semibold text-white transition-colors"
          >
            Alles
          </Link>
          {Object.entries(branchLabels).map(([value, label]) => (
            <Link
              key={value}
              href={`/projects/${value}`}
              className="rounded-full bg-grey-light px-4 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-grey"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured projects */}
      {featuredProjects.length > 0 && (
        <section className="bg-grey-light px-6 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-grey-dark">Uitgelicht</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {featuredProjects.map((project: any) => (
                <ProjectCard key={project.id} project={project} variant="detailed" showTestimonial />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects grid */}
      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          {projects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project: any) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-grey-dark">
              <p className="text-lg">Nog geen projecten beschikbaar.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/projects${p > 1 ? `?page=${p}` : ''}`}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${p === currentPage ? 'bg-navy text-white' : 'bg-grey-light text-navy hover:bg-grey'}`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
