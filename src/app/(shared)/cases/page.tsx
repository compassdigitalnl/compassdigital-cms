/**
 * Smart Cases Overview Page (shared)
 *
 * Strategy 1: professional-cases collection (if available and has content)
 * Strategy 2: unified projects collection (fallback)
 *
 * Lives in (shared) because cases are universal, not branch-specific.
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ProjectCard } from '@/branches/shared/components/ProjectCard'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const siteName = process.env.SITE_NAME || 'Cases'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Cases - ${siteName}`,
    description: 'Bekijk onze cases en projecten. Ontdek wat wij voor onze klanten hebben gerealiseerd.',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/cases`,
    },
  }
}

const branchLabels: Record<string, string> = {
  'e-commerce': 'E-commerce',
  tech: 'E-commerce',
  construction: 'Bouw',
  bouw: 'Bouw & Constructie',
  beauty: 'Beauty',
  horeca: 'Horeca',
  zorg: 'Zorg',
  dienstverlening: 'Dienstverlening',
  ervaringen: 'Ervaringen',
  marketplace: 'Marketplace',
  publishing: 'Publishing',
}

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const payload = await getPayload({ config })

  // Strategy 1: Professional Cases (dedicated collection)
  if (isFeatureEnabled('professional_services')) {
    try {
      const { docs: testDocs } = await payload.find({
        collection: 'professional-cases',
        where: { status: { equals: 'published' } },
        limit: 1,
        depth: 0,
      })

      if (testDocs.length > 0) {
        const { CasesArchiveTemplate } = await import(
          '@/branches/professional-services/templates'
        )

        const params = await searchParams
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
            where: { status: { equals: 'published' }, featured: { equals: true } },
            depth: 2,
            limit: 1,
            sort: '-createdAt',
          })
          featuredCase = featuredDocs[0] || null
        } catch { /* */ }

        const where: any = { status: { equals: 'published' } }
        if (featuredCase) where.id = { not_equals: featuredCase.id }

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
    } catch {
      // professional-cases not available, fall through to projects
    }
  }

  // Strategy 2: Unified Projects collection OR content-cases (unified content module)
  if (!isFeatureEnabled('cases') && !isFeatureEnabled('professional_services')) {
    notFound()
  }

  const params = await searchParams
  const currentPage = Number(params.page) || 1

  // Try projects first, fall back to content-cases
  let projects: any[] = []
  let totalPages = 1
  let totalDocs = 0
  let featuredProjects: any[] = []
  let usingContentCases = false

  try {
    const result = await payload.find({
      collection: 'projects',
      where: { status: { equals: 'published' } },
      limit: 12,
      page: currentPage,
      sort: '-createdAt',
      depth: 1,
    })
    projects = result.docs
    totalPages = result.totalPages
    totalDocs = result.totalDocs
  } catch { /* projects collection may not exist */ }

  // If no projects found, try content-cases
  if (projects.length === 0) {
    try {
      const result = await payload.find({
        collection: 'content-cases',
        where: { status: { equals: 'published' } },
        limit: 12,
        page: currentPage,
        sort: '-createdAt',
        depth: 1,
      })
      projects = result.docs
      totalPages = result.totalPages
      totalDocs = result.totalDocs
      usingContentCases = true
    } catch { /* content-cases may not exist */ }
  }

  if (currentPage === 1) {
    const collection = usingContentCases ? 'content-cases' : 'projects'
    try {
      const { docs } = await payload.find({
        collection,
        where: { status: { equals: 'published' }, featured: { equals: true } },
        limit: 2,
        depth: 1,
      })
      featuredProjects = docs
    } catch { /* */ }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-light px-6 py-16 text-center text-white md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
            Portfolio
          </div>
          <h1 className="mb-4 font-display text-3xl md:text-5xl">Onze Cases</h1>
          <p className="text-base text-white/80 md:text-lg">
            {totalDocs} {totalDocs === 1 ? 'case' : 'cases'} — ontdek wat wij voor onze klanten hebben gerealiseerd.
          </p>
        </div>
      </section>

      {/* Branch filter — clean URLs */}
      <section className="border-b border-grey bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2">
          <Link href="/cases" className="rounded-full bg-navy px-4 py-1.5 text-xs font-semibold text-white transition-colors">
            Alles
          </Link>
          {Object.entries(branchLabels).map(([value, label]) => (
            <Link
              key={value}
              href={`/cases/${value}`}
              className="rounded-full bg-grey-light px-4 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-grey"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featuredProjects.length > 0 && (
        <section className="bg-grey-light px-6 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-grey-dark">Uitgelicht</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {featuredProjects.map((project: any) => (
                <ProjectCard key={project.id} project={project} variant="detailed" showTestimonial basePath="/cases" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Grid */}
      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          {projects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project: any) => (
                <ProjectCard key={project.id} project={project} basePath="/cases" />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-grey-dark">
              <p className="text-lg">Nog geen cases beschikbaar.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/cases${p > 1 ? `?page=${p}` : ''}`}
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
