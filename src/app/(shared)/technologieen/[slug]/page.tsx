/**
 * Technology Detail Page (shared)
 * Route: /technologieen/[slug]
 *
 * Shows all projects using a specific technology.
 * Also shows "often combined with" technologies.
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { isFeatureEnabled } from '@/lib/tenant/features'
import Link from 'next/link'
import { ProjectCard } from '@/branches/shared/components/ui/data-display/ProjectCard'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

const categoryStyles: Record<string, string> = {
  frontend: 'bg-blue/10 text-blue border-blue/30',
  backend: 'bg-purple/10 text-purple border-purple/30',
  platform: 'bg-teal/10 text-teal border-teal/30',
  integration: 'bg-amber/10 text-amber border-amber/30',
  design: 'bg-coral/10 text-coral border-coral/30',
}

interface PageProps {
  params: Promise<{ slug: string }>
}

async function findTechAndProjects(slug: string) {
  const payload = await getPayload({ config })

  // Fetch all published projects
  const { docs: allProjects } = await payload.find({
    collection: 'projects',
    where: { status: { equals: 'published' } },
    limit: 500,
    depth: 1,
  })

  // Find matching projects and tech info
  let techName = ''
  let techIcon = ''
  let techCategory = 'platform'
  const matchingProjects: any[] = []
  const coTechs = new Map<string, { name: string; slug: string; category: string; count: number }>()

  for (const project of allProjects) {
    const technologies = Array.isArray((project as any).technologies) ? (project as any).technologies : []
    let isMatch = false

    for (const tech of technologies) {
      if (!tech.name) continue
      if (slugify(tech.name) === slug) {
        isMatch = true
        if (!techName) techName = tech.name
        if (!techIcon && tech.icon) techIcon = tech.icon
        if (techCategory === 'platform' && tech.category) techCategory = tech.category
      }
    }

    if (isMatch) {
      matchingProjects.push(project)
      // Count co-occurring technologies
      for (const tech of technologies) {
        if (!tech.name || slugify(tech.name) === slug) continue
        const ts = slugify(tech.name)
        const existing = coTechs.get(ts)
        if (existing) {
          existing.count++
        } else {
          coTechs.set(ts, { name: tech.name, slug: ts, category: tech.category || 'platform', count: 1 })
        }
      }
    }
  }

  // Sort co-technologies by frequency
  const combinedWith = Array.from(coTechs.values()).sort((a, b) => b.count - a.count).slice(0, 8)

  return { techName, techIcon, techCategory, matchingProjects, combinedWith }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { techName, matchingProjects } = await findTechAndProjects(slug)
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''

  if (!techName) return { title: 'Technologie niet gevonden' }

  return {
    title: `${techName} - Technologieën`,
    description: `Bekijk ${matchingProjects.length} ${matchingProjects.length === 1 ? 'project' : 'projecten'} gebouwd met ${techName}.`,
    alternates: { canonical: `${siteUrl}/technologieen/${slug}` },
  }
}

export default async function TechDetailPage({ params }: PageProps) {
  if (!isFeatureEnabled('cases')) {
    notFound()
  }

  const { slug } = await params
  const { techName, techIcon, techCategory, matchingProjects, combinedWith } = await findTechAndProjects(slug)

  if (!techName) notFound()

  const catStyle = categoryStyles[techCategory] || categoryStyles.platform
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-grey-mid">
          <Link href="/" className="hover:text-teal">Home</Link>
          <span>/</span>
          <Link href="/technologieen" className="hover:text-teal">Technologieën</Link>
          <span>/</span>
          <span className="text-navy">{techName}</span>
        </nav>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-br from-navy to-navy-light px-6 py-12 text-white md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-4">
            <div>
              <span className={`mb-2 inline-block rounded-full border px-3 py-1 text-xs font-semibold ${catStyle}`}>
                {categoryLabels[techCategory] || techCategory}
              </span>
              <h1 className="font-display text-3xl md:text-4xl">{techName}</h1>
              <p className="mt-2 text-white/80">
                Gebruikt in {matchingProjects.length} {matchingProjects.length === 1 ? 'project' : 'projecten'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 font-display text-xl text-navy">
            Projecten met {techName}
          </h2>
          {matchingProjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {matchingProjects.map((project: any) => (
                <ProjectCard key={project.id} project={project} basePath="/cases" />
              ))}
            </div>
          ) : (
            <p className="text-grey-dark">Geen projecten gevonden.</p>
          )}
        </div>
      </section>

      {/* Combined with */}
      {combinedWith.length > 0 && (
        <section className="border-t border-grey bg-grey-light/50 px-6 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 font-display text-xl text-navy">Vaak gecombineerd met</h2>
            <div className="flex flex-wrap gap-3">
              {combinedWith.map((tech) => {
                const style = categoryStyles[tech.category] || categoryStyles.platform
                return (
                  <Link
                    key={tech.slug}
                    href={`/technologieen/${tech.slug}`}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-shadow hover:shadow-md ${style}`}
                  >
                    {tech.name}
                    <span className="text-xs opacity-60">({tech.count})</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            name: techName,
            description: `Projecten gebouwd met ${techName}`,
            url: `${siteUrl}/technologieen/${slug}`,
            about: {
              '@type': 'Thing',
              name: techName,
            },
          }),
        }}
      />
    </div>
  )
}
