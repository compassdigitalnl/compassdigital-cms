/**
 * Technology Hub Page (shared)
 * Route: /technologieen
 *
 * Dynamically aggregates technologies from all published projects.
 * Groups by category with links to individual technology pages.
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const siteName = process.env.SITE_NAME || 'Technologieën'

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
  return {
    title: `Technologieën - ${siteName}`,
    description: 'Ontdek de technologieën die wij inzetten voor onze projecten. Van frontend frameworks tot backend platforms.',
    alternates: { canonical: `${siteUrl}/technologieen` },
  }
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const categoryLabels: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  platform: 'Platform',
  integration: 'Integratie',
  design: 'Design',
}

const categoryOrder = ['frontend', 'backend', 'platform', 'integration', 'design']

const categoryStyles: Record<string, { border: string; bg: string; icon: string }> = {
  frontend: { border: 'border-blue/30', bg: 'bg-blue/5', icon: 'text-blue' },
  backend: { border: 'border-purple/30', bg: 'bg-purple/5', icon: 'text-purple' },
  platform: { border: 'border-teal/30', bg: 'bg-teal/5', icon: 'text-teal' },
  integration: { border: 'border-amber/30', bg: 'bg-amber/5', icon: 'text-amber' },
  design: { border: 'border-coral/30', bg: 'bg-coral/5', icon: 'text-coral' },
}

interface TechAggregation {
  name: string
  slug: string
  icon?: string
  category: string
  projectCount: number
}

export default async function TechnologieenPage() {
  if (!isFeatureEnabled('cases')) {
    notFound()
  }

  const payload = await getPayload({ config })

  // Fetch all published projects with technologies
  const { docs: projects } = await payload.find({
    collection: 'projects',
    where: { status: { equals: 'published' } },
    limit: 500,
    depth: 0,
    select: {
      technologies: true,
    },
  })

  // Aggregate unique technologies
  const techMap = new Map<string, TechAggregation>()

  for (const project of projects) {
    const technologies = Array.isArray((project as any).technologies) ? (project as any).technologies : []
    for (const tech of technologies) {
      if (!tech.name) continue
      const slug = slugify(tech.name)
      const existing = techMap.get(slug)
      if (existing) {
        existing.projectCount++
        // Update icon/category if missing
        if (!existing.icon && tech.icon) existing.icon = tech.icon
        if (existing.category === 'platform' && tech.category) existing.category = tech.category
      } else {
        techMap.set(slug, {
          name: tech.name,
          slug,
          icon: tech.icon,
          category: tech.category || 'platform',
          projectCount: 1,
        })
      }
    }
  }

  // Group by category
  const grouped: Record<string, TechAggregation[]> = {}
  for (const tech of techMap.values()) {
    if (!grouped[tech.category]) grouped[tech.category] = []
    grouped[tech.category].push(tech)
  }

  // Sort each category by project count (desc) then name
  for (const cat of Object.keys(grouped)) {
    grouped[cat].sort((a, b) => b.projectCount - a.projectCount || a.name.localeCompare(b.name))
  }

  const totalTechs = techMap.size
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-light px-6 py-16 text-center text-white md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
            Tech Stack
          </div>
          <h1 className="mb-4 font-display text-3xl md:text-5xl">Onze Technologieën</h1>
          <p className="text-base text-white/80 md:text-lg">
            {totalTechs} technologieën verdeeld over {Object.keys(grouped).length} categorieën — de tools waarmee wij bouwen.
          </p>
        </div>
      </section>

      {/* Category sections */}
      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-6xl space-y-12">
          {categoryOrder
            .filter((cat) => grouped[cat]?.length > 0)
            .map((cat) => {
              const style = categoryStyles[cat] || categoryStyles.platform
              return (
                <div key={cat}>
                  <h2 className="mb-6 font-display text-xl text-navy">
                    {categoryLabels[cat] || cat}
                    <span className="ml-2 text-sm font-normal text-grey-dark">({grouped[cat].length})</span>
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {grouped[cat].map((tech) => (
                      <Link
                        key={tech.slug}
                        href={`/technologieen/${tech.slug}`}
                        className={`group flex items-center gap-3 rounded-lg border ${style.border} ${style.bg} px-4 py-3 transition-shadow hover:shadow-md`}
                      >
                        <div className="flex flex-1 flex-col">
                          <span className="text-sm font-semibold text-navy group-hover:text-teal">
                            {tech.name}
                          </span>
                          <span className="text-xs text-grey-dark">
                            {tech.projectCount} {tech.projectCount === 1 ? 'project' : 'projecten'}
                          </span>
                        </div>
                        <svg className="h-4 w-4 text-grey-mid transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Onze Technologieën',
            description: 'Overzicht van technologieën die wij inzetten',
            url: `${siteUrl}/technologieen`,
            numberOfItems: totalTechs,
          }),
        }}
      />
    </>
  )
}
