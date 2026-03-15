/**
 * Smart Cases Param Route (shared)
 *
 * /cases/horeca → branch filter page
 * /cases/techstore24 → case detail with device mockups, tech stack, metrics
 *
 * Strategy: Check professional-cases first, then unified projects collection.
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { isFeatureEnabled } from '@/lib/tenant/features'
import Link from 'next/link'
import Image from 'next/image'
import { ProjectCard } from '@/branches/shared/components/ui/data-display/ProjectCard'
import { DeviceMockup } from '@/branches/shared/components/ui/media/DeviceMockup'
import { LiveSiteButton } from '@/branches/shared/components/ui/marketing/LiveSiteButton'
import { TechStack } from '@/branches/shared/components/ui/data-display/TechStack'
import { MetricsGrid } from '@/branches/shared/components/ui/data-display/MetricsGrid'
import { ProjectTimeline } from '@/branches/shared/components/ui/layout/ProjectTimeline'
import {
  buildProfessionalCaseSchema,
  buildLocalBusinessSchema,
} from '@/features/seo/lib/schema-builders'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const branchLabels: Record<string, string> = {
  'e-commerce': 'E-commerce',
  tech: 'E-commerce',
  construction: 'Bouw & Installatie',
  bouw: 'Bouw & Constructie',
  beauty: 'Beauty & Wellness',
  horeca: 'Horeca',
  zorg: 'Zorg & Welzijn',
  dienstverlening: 'Dienstverlening',
  ervaringen: 'Ervaringen & Events',
  marketplace: 'Marketplace',
  publishing: 'Publishing',
}

const branchKeys = Object.keys(branchLabels)

interface PageProps {
  params: Promise<{ param: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { param } = await params

  // Branch filter
  if (branchKeys.includes(param)) {
    return {
      title: `${branchLabels[param]} Cases`,
      description: `Bekijk onze ${branchLabels[param].toLowerCase()} cases.`,
    }
  }

  const payload = await getPayload({ config })
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''

  // Try professional-cases first
  if (isFeatureEnabled('professional_services')) {
    try {
      const { docs } = await payload.find({
        collection: 'professional-cases',
        where: { slug: { equals: param }, status: { equals: 'published' } },
        limit: 1,
        depth: 1,
      })
      if (docs[0]) {
        const c = docs[0] as any
        const imageUrl = typeof c.featuredImage === 'object' && c.featuredImage?.url ? c.featuredImage.url : null
        return {
          title: c.meta?.title || `${c.title} - Cases`,
          description: c.meta?.description || c.shortDescription,
          alternates: { canonical: `${siteUrl}/cases/${param}` },
          openGraph: {
            title: c.meta?.title || c.title,
            description: c.meta?.description || c.shortDescription,
            url: `${siteUrl}/cases/${param}`,
            ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
          },
        }
      }
    } catch { /* */ }
  }

  // Try unified projects
  try {
    const { docs } = await payload.find({
      collection: 'projects',
      where: { slug: { equals: param }, status: { equals: 'published' } },
      limit: 1,
      depth: 1,
    })
    if (docs[0]) {
      const p = docs[0] as any
      const imageUrl = typeof p.featuredImage === 'object' && p.featuredImage?.url ? p.featuredImage.url : null
      return {
        title: `${p.title} - Cases`,
        description: p.shortDescription || undefined,
        alternates: { canonical: `${siteUrl}/cases/${param}` },
        openGraph: {
          title: p.title,
          description: p.shortDescription || undefined,
          url: `${siteUrl}/cases/${param}`,
          ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
        },
      }
    }
  } catch { /* */ }

  // Try content-cases (unified content module)
  try {
    const { docs } = await payload.find({
      collection: 'content-cases',
      where: { slug: { equals: param }, status: { equals: 'published' } },
      limit: 1,
      depth: 1,
    })
    if (docs[0]) {
      const p = docs[0] as any
      const imageUrl = typeof p.featuredImage === 'object' && p.featuredImage?.url ? p.featuredImage.url : null
      return {
        title: `${p.title} - Cases`,
        description: p.shortDescription || undefined,
        alternates: { canonical: `${siteUrl}/cases/${param}` },
        openGraph: {
          title: p.title,
          description: p.shortDescription || undefined,
          url: `${siteUrl}/cases/${param}`,
          ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
        },
      }
    }
  } catch { /* */ }

  return { title: 'Case niet gevonden' }
}

export default async function CaseParamPage({ params, searchParams }: PageProps) {
  const { param } = await params

  // Branch filter
  if (branchKeys.includes(param)) {
    return <BranchFilterPage branch={param} searchParams={searchParams} />
  }

  // Detail page — try professional-cases first, then projects
  const payload = await getPayload({ config })

  if (isFeatureEnabled('professional_services')) {
    try {
      const { docs } = await payload.find({
        collection: 'professional-cases',
        where: { slug: { equals: param }, status: { equals: 'published' } },
        depth: 3,
        limit: 1,
      })
      if (docs[0]) {
        return <ProfessionalCaseDetail caseItem={docs[0]} />
      }
    } catch { /* fall through */ }
  }

  // Try unified projects first, then content-cases
  try {
    const { docs } = await payload.find({
      collection: 'projects',
      where: { slug: { equals: param }, status: { equals: 'published' } },
      depth: 2,
      limit: 1,
    })
    if (docs[0]) {
      return <ProjectCaseDetail slug={param} />
    }
  } catch { /* */ }

  // Try content-cases (unified content module)
  try {
    const { docs } = await payload.find({
      collection: 'content-cases',
      where: { slug: { equals: param }, status: { equals: 'published' } },
      depth: 2,
      limit: 1,
    })
    if (docs[0]) {
      return <ContentCaseDetail caseItem={docs[0] as any} />
    }
  } catch { /* */ }

  return <ProjectCaseDetail slug={param} />
}

/* ─── Branch Filter ─────────────────────────────────────────── */

async function BranchFilterPage({
  branch,
  searchParams,
}: {
  branch: string
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const payload = await getPayload({ config })
  const currentPage = Number(pageParam) || 1

  // Try projects first, fall back to content-cases
  let projects: any[] = []
  let totalPages = 1
  let totalDocs = 0

  try {
    const result = await payload.find({
      collection: 'projects',
      where: { status: { equals: 'published' }, branch: { equals: branch } },
      limit: 12,
      page: currentPage,
      sort: '-createdAt',
      depth: 1,
    })
    projects = result.docs
    totalPages = result.totalPages
    totalDocs = result.totalDocs
  } catch { /* */ }

  // If no projects, try content-cases
  if (projects.length === 0) {
    try {
      const result = await payload.find({
        collection: 'content-cases',
        where: { status: { equals: 'published' }, branch: { equals: branch } },
        limit: 12,
        page: currentPage,
        sort: '-createdAt',
        depth: 1,
      })
      projects = result.docs
      totalPages = result.totalPages
      totalDocs = result.totalDocs
    } catch { /* */ }
  }

  return (
    <>
      <section className="bg-gradient-to-br from-navy to-navy-light px-6 py-16 text-center text-white md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
            {branchLabels[branch]}
          </div>
          <h1 className="mb-4 font-display text-3xl md:text-5xl">{branchLabels[branch]} Cases</h1>
          <p className="text-base text-white/80 md:text-lg">
            {totalDocs} {totalDocs === 1 ? 'case' : 'cases'}
          </p>
        </div>
      </section>

      <section className="border-b border-grey bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2">
          <Link href="/cases" className="rounded-full bg-grey-light px-4 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-grey">Alles</Link>
          {Object.entries(branchLabels).map(([value, label]) => (
            <Link key={value} href={`/cases/${value}`}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${branch === value ? 'bg-navy text-white' : 'bg-grey-light text-navy hover:bg-grey'}`}>
              {label}
            </Link>
          ))}
        </div>
      </section>

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
              <p className="text-lg">Nog geen cases in {branchLabels[branch].toLowerCase()}.</p>
              <Link href="/cases" className="mt-4 inline-block text-teal hover:underline">Bekijk alle cases</Link>
            </div>
          )}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link key={p} href={`/cases/${branch}${p > 1 ? `?page=${p}` : ''}`}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${p === currentPage ? 'bg-navy text-white' : 'bg-grey-light text-navy hover:bg-grey'}`}>
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

/* ─── Professional Case Detail ──────────────────────────────── */

async function ProfessionalCaseDetail({ caseItem }: { caseItem: any }) {
  const payload = await getPayload({ config })

  let jsonLdSchemas: object[] = []
  try {
    const settings = await payload.findGlobal({ slug: 'settings' })
    if (settings.enableJSONLD) {
      const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
      jsonLdSchemas.push(buildLocalBusinessSchema(settings, siteUrl))
      jsonLdSchemas.push(buildProfessionalCaseSchema(caseItem, settings, siteUrl))
    }
  } catch { /* */ }

  const { CaseDetailTemplate } = await import('@/branches/professional-services/templates')

  return (
    <>
      {jsonLdSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <CaseDetailTemplate case={caseItem} />
    </>
  )
}

/* ─── Unified Project Case Detail ───────────────────────────── */

async function ProjectCaseDetail({ slug }: { slug: string }) {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    depth: 2,
    limit: 1,
  })

  const project = docs[0] as any
  if (!project) notFound()

  const featuredImage = typeof project.featuredImage === 'object' && project.featuredImage !== null ? project.featuredImage : null
  const gallery = Array.isArray(project.gallery) ? project.gallery.filter((img: any) => typeof img === 'object' && img?.url) : []
  const testimonial = project.testimonial
  const screenshots = project.screenshots || {}
  const desktopScreenshot = typeof screenshots.desktop === 'object' ? screenshots.desktop : null
  const mobileScreenshot = typeof screenshots.mobile === 'object' ? screenshots.mobile : null
  const technologies = Array.isArray(project.technologies) ? project.technologies : []
  const metrics = Array.isArray(project.metrics) ? project.metrics : []
  const timeline = Array.isArray(project.timeline) ? project.timeline : []
  const features = Array.isArray(project.features) ? project.features : []
  const processSteps = Array.isArray(project.processSteps) ? project.processSteps : []
  const faq = Array.isArray(project.faq) ? project.faq : []
  const videoUrl = project.videoUrl || null

  // Related services (from relatedServices field or auto-query)
  let relatedServices: any[] = []
  const linkedServices = Array.isArray(project.relatedServices) ? project.relatedServices.filter((s: any) => typeof s === 'object' && s?.relationTo) : []
  if (linkedServices.length > 0) {
    relatedServices = linkedServices.map((s: any) => ({ ...s.value, _collection: s.relationTo })).filter((s: any) => s?.title)
  } else if (project.branch) {
    // Auto-query professional-services with same branch
    try {
      const { docs } = await payload.find({
        collection: 'professional-services',
        where: { status: { equals: 'published' }, branch: { equals: project.branch } },
        limit: 3,
        sort: 'title',
        depth: 0,
      })
      relatedServices = docs.map((d: any) => ({ ...d, _collection: 'professional-services' }))
    } catch { /* */ }
  }

  const specs: { label: string; value: string }[] = []
  if (project.client) specs.push({ label: 'Klant', value: project.client })
  if (project.location) specs.push({ label: 'Locatie', value: project.location })
  if (project.industry) specs.push({ label: 'Branche', value: project.industry })
  if (project.year) specs.push({ label: 'Jaar', value: String(project.year) })
  if (project.duration) specs.push({ label: 'Doorlooptijd', value: project.duration })

  let relatedProjects: any[] = []
  try {
    const result = await payload.find({
      collection: 'projects',
      where: { and: [{ status: { equals: 'published' } }, { id: { not_equals: project.id } }, { branch: { equals: project.branch } }] },
      limit: 3,
      sort: '-createdAt',
      depth: 1,
    })
    relatedProjects = result.docs
  } catch { /* */ }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-grey-mid">
          <Link href="/" className="hover:text-teal">Home</Link>
          <span>/</span>
          <Link href="/cases" className="hover:text-teal">Cases</Link>
          {project.branch && (<><span>/</span><Link href={`/cases/${project.branch}`} className="hover:text-teal">{branchLabels[project.branch] || project.branch}</Link></>)}
          <span>/</span>
          <span className="text-navy">{project.title}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-8">
          {project.branch && (
            <span className="mb-2 inline-block rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
              {branchLabels[project.branch] || project.branch}
            </span>
          )}
          <h1 className="font-display text-3xl text-navy md:text-4xl">{project.title}</h1>
          {project.shortDescription && <p className="mt-3 max-w-3xl text-lg text-grey-dark">{project.shortDescription}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {project.websiteUrl && <LiveSiteButton url={project.websiteUrl} />}
            {project.resultHighlight && (
              <span className="inline-flex items-center gap-2 rounded-full bg-teal/10 px-4 py-2 text-sm font-bold text-teal">{project.resultHighlight}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            {(desktopScreenshot?.url || mobileScreenshot?.url) && (
              <DeviceMockup desktopUrl={desktopScreenshot?.url} mobileUrl={mobileScreenshot?.url} desktopAlt={`${project.title} - Desktop`} mobileAlt={`${project.title} - Mobile`} websiteUrl={project.websiteUrl} />
            )}
            {!desktopScreenshot?.url && !mobileScreenshot?.url && featuredImage?.url && (
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image src={featuredImage.url} alt={featuredImage.alt || project.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 66vw" priority />
              </div>
            )}

            {specs.length > 0 && (
              <div className={`grid gap-4 ${specs.length >= 4 ? 'grid-cols-2 md:grid-cols-4' : specs.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {specs.map((spec, i) => (
                  <div key={i} className="rounded-lg bg-grey-light p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-grey-dark">{spec.label}</p>
                    <p className="mt-1 text-base font-bold text-navy">{spec.value}</p>
                  </div>
                ))}
              </div>
            )}

            {metrics.length > 0 && <MetricsGrid metrics={metrics} columns={Math.min(metrics.length, 4) as 2 | 3 | 4} variant="gradient" />}

            {project.longDescription && <RichTextSection content={project.longDescription} />}
            {project.challenge && (<div><h2 className="mb-3 font-display text-xl text-navy">De uitdaging</h2><RichTextSection content={project.challenge} /></div>)}
            {project.solution && (<div><h2 className="mb-3 font-display text-xl text-navy">Onze aanpak</h2><RichTextSection content={project.solution} /></div>)}
            {project.resultDescription && (<div><h2 className="mb-3 font-display text-xl text-navy">Het resultaat</h2><RichTextSection content={project.resultDescription} /></div>)}

            {features.length > 0 && (
              <div>
                <h2 className="mb-4 font-display text-xl text-navy">Gerealiseerde features</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {features.map((f: any, i: number) => (
                    <div key={i} className="flex gap-3 rounded-lg border border-grey bg-white p-4">
                      <svg className="mt-0.5 h-5 w-5 shrink-0 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <div>
                        <p className="text-sm font-semibold text-navy">{f.title}</p>
                        {f.description && <p className="mt-1 text-xs text-grey-dark">{f.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {technologies.length > 0 && <TechStack technologies={technologies} title="Technologie Stack" variant="cards" linkToHub />}
            {timeline.length > 0 && <ProjectTimeline phases={timeline} title="Project Timeline" />}

            {processSteps.length > 0 && (
              <div>
                <h2 className="mb-6 font-display text-xl text-navy">Ons werkproces</h2>
                <div className="relative space-y-0">
                  {processSteps.map((step: any, i: number) => (
                    <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
                      {i < processSteps.length - 1 && (
                        <div className="absolute left-5 top-10 h-full w-px bg-grey" />
                      )}
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">
                        {i + 1}
                      </div>
                      <div className="pt-1.5">
                        <p className="text-sm font-semibold text-navy">{step.title}</p>
                        {step.description && <p className="mt-1 text-sm text-grey-dark">{step.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {testimonial?.quote && (
              <div className="rounded-xl border border-teal/20 bg-teal/5 p-6">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (<span key={i} className="text-lg" style={{ color: 'var(--amber, #f59e0b)' }}>&#9733;</span>))}
                </div>
                <blockquote className="text-lg italic leading-relaxed text-navy">&ldquo;{testimonial.quote}&rdquo;</blockquote>
                {testimonial.clientName && (
                  <div className="mt-3 text-sm font-semibold text-grey-dark">
                    — {testimonial.clientName}{testimonial.clientRole && <span className="font-normal text-grey-mid">, {testimonial.clientRole}</span>}
                  </div>
                )}
              </div>
            )}

            {gallery.length > 0 && (
              <div>
                <h2 className="mb-4 font-display text-xl text-navy">Meer afbeeldingen</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {gallery.map((img: any, i: number) => (
                    <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl"><Image src={img.url} alt={img.alt || ''} fill className="object-cover" sizes="33vw" /></div>
                  ))}
                </div>
              </div>
            )}

            {videoUrl && (
              <div>
                <h2 className="mb-4 font-display text-xl text-navy">Video</h2>
                <div className="relative aspect-video overflow-hidden rounded-xl">
                  <iframe
                    src={videoUrl}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`${project.title} - Video`}
                  />
                </div>
              </div>
            )}

            {faq.length > 0 && (
              <div>
                <h2 className="mb-4 font-display text-xl text-navy">Veelgestelde vragen</h2>
                <div className="divide-y divide-grey rounded-xl border border-grey">
                  {faq.map((item: any, i: number) => (
                    <details key={i} className="group">
                      <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-semibold text-navy transition-colors hover:bg-grey-light/50">
                        {item.question}
                        <svg className="h-4 w-4 shrink-0 text-grey-dark transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </summary>
                      <div className="border-t border-grey bg-grey-light/30 px-5 py-4 text-sm leading-relaxed text-grey-dark">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl border border-grey bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-bold text-navy">Zelf ook zo&apos;n project?</h3>
              <p className="mb-4 text-sm text-grey-dark">Neem vrijblijvend contact op voor een adviesgesprek.</p>
              <Link href="/contact" className="block w-full rounded-lg bg-teal px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-teal-dark">Neem contact op</Link>
            </div>
            {project.badges && project.badges.length > 0 && (
              <div className="rounded-xl border border-grey bg-white p-6">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-grey-dark">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {project.badges.map((b: any, i: number) => (<span key={i} className="rounded-full bg-navy/10 px-3 py-1 text-xs font-semibold text-navy">{b.badge}</span>))}
                </div>
              </div>
            )}
            {project.websiteUrl && (
              <div className="rounded-xl border border-grey bg-white p-6">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-grey-dark">Live Website</h4>
                <LiveSiteButton url={project.websiteUrl} variant="outline" label="Bekijk website" />
              </div>
            )}
            {relatedServices.length > 0 && (
              <div className="rounded-xl border border-grey bg-white p-6">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-grey-dark">Gerelateerde diensten</h4>
                <div className="space-y-2">
                  {relatedServices.map((s: any) => {
                    const serviceUrl = s._collection === 'construction-services'
                      ? `/services/${s.slug}`
                      : `/dienstverlening/${s.slug}`
                    return (
                      <Link
                        key={s.id}
                        href={serviceUrl}
                        className="flex items-center gap-2 rounded-lg p-2 text-sm text-navy transition-colors hover:bg-grey-light"
                      >
                        {s.icon && <span>{s.icon}</span>}
                        <span className="font-medium">{s.title}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </aside>
        </div>

        {relatedProjects.length > 0 && (
          <div className="mt-16 border-t border-grey pt-12">
            <h2 className="mb-8 text-center font-display text-2xl text-navy">Vergelijkbare cases</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((p) => (<ProjectCard key={p.id} project={p} basePath="/cases" />))}
            </div>
            <div className="mt-8 text-center">
              <Link href={`/cases/${project.branch}`} className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:underline">
                Bekijk alle {branchLabels[project.branch] || ''} cases
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Content Case Detail (unified content-cases) ──────────── */

async function ContentCaseDetail({ caseItem }: { caseItem: any }) {
  const payload = await getPayload({ config })
  const featuredImage = typeof caseItem.featuredImage === 'object' && caseItem.featuredImage !== null ? caseItem.featuredImage : null
  const gallery = Array.isArray(caseItem.gallery) ? caseItem.gallery.filter((img: any) => typeof img === 'object' && img?.url) : []
  const testimonial = caseItem.testimonial
  const metrics = Array.isArray(caseItem.metrics) ? caseItem.metrics : []
  const technologies = Array.isArray(caseItem.technologies) ? caseItem.technologies : []

  const specs: { label: string; value: string }[] = []
  if (caseItem.client) specs.push({ label: 'Klant', value: caseItem.client })
  if (caseItem.industry) specs.push({ label: 'Branche', value: caseItem.industry })
  if (caseItem.year) specs.push({ label: 'Jaar', value: String(caseItem.year) })
  if (caseItem.duration) specs.push({ label: 'Doorlooptijd', value: caseItem.duration })
  if (caseItem.location) specs.push({ label: 'Locatie', value: caseItem.location })

  let relatedCases: any[] = []
  if (caseItem.branch) {
    try {
      const result = await payload.find({
        collection: 'content-cases',
        where: { and: [{ status: { equals: 'published' } }, { id: { not_equals: caseItem.id } }, { branch: { equals: caseItem.branch } }] },
        limit: 3,
        sort: '-createdAt',
        depth: 1,
      })
      relatedCases = result.docs
    } catch { /* */ }
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-grey-mid">
          <Link href="/" className="hover:text-teal">Home</Link>
          <span>/</span>
          <Link href="/cases" className="hover:text-teal">Cases</Link>
          {caseItem.branch && (<><span>/</span><Link href={`/cases/${caseItem.branch}`} className="hover:text-teal">{branchLabels[caseItem.branch] || caseItem.branch}</Link></>)}
          <span>/</span>
          <span className="text-navy">{caseItem.title}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            {featuredImage?.url && (
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image src={featuredImage.url} alt={featuredImage.alt || caseItem.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 66vw" priority />
                {caseItem.resultHighlight && (
                  <div className="absolute bottom-4 right-4 z-[2] rounded-lg bg-teal/90 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">{caseItem.resultHighlight}</div>
                )}
              </div>
            )}

            {specs.length > 0 && (
              <div className={`grid gap-4 ${specs.length >= 4 ? 'grid-cols-2 md:grid-cols-4' : specs.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {specs.map((spec, i) => (
                  <div key={i} className="rounded-lg bg-grey-light p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-grey-dark">{spec.label}</p>
                    <p className="mt-1 text-base font-bold text-navy">{spec.value}</p>
                  </div>
                ))}
              </div>
            )}

            {metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {metrics.map((m: any, i: number) => (
                  <div key={i} className="rounded-lg bg-teal/5 p-4 text-center">
                    <p className="text-2xl font-bold text-teal">{m.value}{m.suffix}</p>
                    <p className="mt-1 text-xs text-grey-dark">{m.label}</p>
                  </div>
                ))}
              </div>
            )}

            <div>
              {caseItem.branch && (
                <span className="mb-2 inline-block rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">{branchLabels[caseItem.branch] || caseItem.branch}</span>
              )}
              <h1 className="font-display text-3xl text-navy md:text-4xl">{caseItem.title}</h1>
              {caseItem.shortDescription && <p className="mt-3 text-lg text-grey-dark">{caseItem.shortDescription}</p>}
            </div>

            {caseItem.challenge && (<div><h2 className="mb-3 font-display text-xl text-navy">De uitdaging</h2><RichTextSection content={caseItem.challenge} /></div>)}
            {caseItem.solution && (<div><h2 className="mb-3 font-display text-xl text-navy">Onze aanpak</h2><RichTextSection content={caseItem.solution} /></div>)}
            {caseItem.resultDescription && (<div><h2 className="mb-3 font-display text-xl text-navy">Het resultaat</h2><RichTextSection content={caseItem.resultDescription} /></div>)}

            {technologies.length > 0 && (
              <div>
                <h2 className="mb-4 font-display text-xl text-navy">Technologie</h2>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech: any, i: number) => (
                    <span key={i} className="rounded-full bg-navy/10 px-3 py-1 text-xs font-semibold text-navy">{typeof tech === 'string' ? tech : tech.technology || tech.name}</span>
                  ))}
                </div>
              </div>
            )}

            {testimonial?.quote && (
              <div className="rounded-xl border border-teal/20 bg-teal/5 p-6">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (<span key={i} className="text-lg" style={{ color: 'var(--amber, #f59e0b)' }}>&#9733;</span>))}
                </div>
                <blockquote className="text-lg italic leading-relaxed text-navy">&ldquo;{testimonial.quote}&rdquo;</blockquote>
                {(testimonial.name || testimonial.clientName) && (
                  <div className="mt-3 text-sm font-semibold text-grey-dark">
                    — {testimonial.name || testimonial.clientName}
                    {(testimonial.role || testimonial.clientRole) && <span className="font-normal text-grey-mid">, {testimonial.role || testimonial.clientRole}</span>}
                  </div>
                )}
              </div>
            )}

            {gallery.length > 0 && (
              <div>
                <h2 className="mb-4 font-display text-xl text-navy">Afbeeldingen</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {gallery.map((img: any, i: number) => (
                    <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl"><Image src={img.url} alt={img.alt || ''} fill className="object-cover" sizes="33vw" /></div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl border border-grey bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-bold text-navy">Zelf ook zo&apos;n project?</h3>
              <p className="mb-4 text-sm text-grey-dark">Neem vrijblijvend contact op voor een adviesgesprek.</p>
              <Link href="/contact" className="block w-full rounded-lg bg-teal px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-teal-dark">Neem contact op</Link>
            </div>

            {caseItem.websiteUrl && (
              <div className="rounded-xl border border-grey bg-white p-6">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-grey-dark">Website</h4>
                <a href={caseItem.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:underline">
                  Bekijk live website
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
            )}

            {caseItem.badges && caseItem.badges.length > 0 && (
              <div className="rounded-xl border border-grey bg-white p-6">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-grey-dark">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {caseItem.badges.map((b: any, i: number) => (
                    <span key={i} className="rounded-full bg-navy/10 px-3 py-1 text-xs font-semibold text-navy">{typeof b === 'string' ? b : b.badge || b.label}</span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {relatedCases.length > 0 && (
          <div className="mt-16 border-t border-grey pt-12">
            <h2 className="mb-8 text-center font-display text-2xl text-navy">Vergelijkbare cases</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedCases.map((p: any) => (
                <ProjectCard key={p.id} project={p} basePath="/cases" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Rich Text Helpers ─────────────────────────────────────── */

function RichTextSection({ content }: { content: any }) {
  if (!content) return null
  if (typeof content === 'string') return <p className="leading-relaxed text-grey-dark">{content}</p>
  if (content?.root?.children) {
    return (
      <div className="prose max-w-none text-grey-dark">
        {content.root.children.map((node: any, i: number) => <LexicalNode key={i} node={node} />)}
      </div>
    )
  }
  return null
}

function LexicalNode({ node }: { node: any }) {
  if (!node) return null
  if (node.type === 'paragraph') return <p>{node.children?.map((c: any, i: number) => <LexicalNode key={i} node={c} />)}</p>
  if (node.type === 'heading') { const Tag = (node.tag || 'h2') as 'h2' | 'h3' | 'h4'; return <Tag>{node.children?.map((c: any, i: number) => <LexicalNode key={i} node={c} />)}</Tag> }
  if (node.type === 'text') {
    let text: React.ReactNode = node.text || ''
    if (node.format & 1) text = <strong>{text}</strong>
    if (node.format & 2) text = <em>{text}</em>
    if (node.format & 4) text = <s>{text}</s>
    if (node.format & 8) text = <u>{text}</u>
    return <>{text}</>
  }
  if (node.type === 'list') { const Tag = node.listType === 'number' ? 'ol' : 'ul'; return <Tag>{node.children?.map((c: any, i: number) => <LexicalNode key={i} node={c} />)}</Tag> }
  if (node.type === 'listitem') return <li>{node.children?.map((c: any, i: number) => <LexicalNode key={i} node={c} />)}</li>
  if (node.type === 'link') return <a href={node.fields?.url || '#'} className="text-teal hover:underline">{node.children?.map((c: any, i: number) => <LexicalNode key={i} node={c} />)}</a>
  if (node.children) return <>{node.children.map((c: any, i: number) => <LexicalNode key={i} node={c} />)}</>
  return null
}
