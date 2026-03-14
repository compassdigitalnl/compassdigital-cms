import { getPayload } from 'payload'
import config from '@payload-config'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import BrancheArchiveTemplate1 from '@/branches/shared/templates/branches/BrancheArchiveTemplate1'
import { RenderBlocks } from '@/branches/shared/blocks/RenderBlocks'
import { JsonLdSchema } from '@/features/seo/components/JsonLdSchema'
import type { Metadata } from 'next'
import type { Page } from '@/payload-types'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'settings' }) as any
    const archiveSeo = settings?.archiveSeo

    // Try CMS page first
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'branches' } },
      limit: 1,
      depth: 0,
      select: { title: true, meta: true },
    })
    if (docs[0]) {
      const page = docs[0] as any
      return {
        title: page.meta?.title || page.title || 'Branches',
        description: page.meta?.description || archiveSeo?.branchesDescription || 'Ontdek onze oplossingen per branche.',
      }
    }

    return {
      title: archiveSeo?.branchesTitle || 'Branches',
      description: archiveSeo?.branchesDescription || 'Ontdek onze oplossingen per branche.',
    }
  } catch {
    return { title: 'Branches' }
  }
}

export default async function BranchesPage() {
  const payload = await getPayload({ config })

  // Strategy 1: If shop is enabled, use branches collection (ecommerce product branches)
  if (isFeatureEnabled('shop')) {
    const { docs: branches } = await payload.find({
      collection: 'branches',
      where: { visible: { equals: true } },
      sort: 'order',
      limit: 100,
      depth: 1,
    })

    if (branches.length > 0) {
      const branchesWithCounts = await Promise.all(
        branches.map(async (branch: any) => {
          try {
            const { totalDocs } = await payload.count({
              collection: 'products',
              where: { branches: { equals: branch.id } },
            })
            return { ...branch, productCount: totalDocs }
          } catch {
            return { ...branch, productCount: 0 }
          }
        }),
      )
      const totalProductCount = branchesWithCounts.reduce((sum, b) => sum + (b.productCount || 0), 0)
      return <BrancheArchiveTemplate1 branches={branchesWithCounts} totalProductCount={totalProductCount} />
    }
  }

  // Strategy 2: Render CMS page with slug "branches" (landing page mode)
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'branches' } },
    limit: 1,
    depth: 1,
  })

  const page = docs[0] as Page | undefined
  if (page) {
    return (
      <>
        <JsonLdSchema page={page} />
        <RenderBlocks blocks={page.layout || []} />
      </>
    )
  }

  // Strategy 3: Content Services as branch solutions (content module mode)
  try {
    const { docs: services } = await payload.find({
      collection: 'content-services',
      where: { status: { equals: 'published' } },
      limit: 50,
      sort: 'title',
      depth: 1,
    })

    if (services.length > 0) {
      // Get case counts per branch for stats
      let caseCounts: Record<string, number> = {}
      try {
        const { docs: cases } = await payload.find({
          collection: 'content-cases',
          where: { status: { equals: 'published' } },
          limit: 100,
          depth: 0,
        })
        for (const c of cases as any[]) {
          const b = c.branch || 'general'
          caseCounts[b] = (caseCounts[b] || 0) + 1
        }
      } catch { /* */ }

      return <ContentServicesArchive services={services as any[]} caseCounts={caseCounts} />
    }
  } catch { /* content-services may not exist */ }

  notFound()
}

const branchLabels: Record<string, string> = {
  tech: 'E-commerce',
  beauty: 'Beauty & Wellness',
  horeca: 'Horeca',
  bouw: 'Bouw & Constructie',
  zorg: 'Zorg & Gezondheid',
  ervaringen: 'Ervaringen & Events',
  dienstverlening: 'Dienstverlening',
  marketplace: 'Marketplace',
}

function ContentServicesArchive({ services, caseCounts }: { services: any[], caseCounts: Record<string, number> }) {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-light px-6 py-16 text-center text-white md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
            Oplossingen
          </div>
          <h1 className="mb-4 font-display text-3xl md:text-5xl">
            Voor Elke Branche de Perfecte Oplossing
          </h1>
          <p className="text-base text-white/80 md:text-lg">
            {services.length} branche-specifieke oplossingen — gebouwd op hetzelfde krachtige platform, afgestemd op jouw sector.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="px-6 py-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const imageData = typeof service.featuredImage === 'object' && service.featuredImage !== null ? service.featuredImage : null
              const featureCount = service.features?.length || 0
              const caseCount = caseCounts[service.branch] || 0

              return (
                <article key={service.id} className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-grey bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <Link href={`/branches/${service.slug}`} className="flex h-full flex-col text-inherit no-underline">
                    {imageData?.url && (
                      <div className="relative aspect-video w-full overflow-hidden bg-grey-light">
                        <Image src={imageData.url} alt={imageData.alt || service.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                        {service.branch && branchLabels[service.branch] && (
                          <div className="absolute left-3 top-3 z-[2] rounded-md bg-navy/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                            {branchLabels[service.branch]}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-3 flex items-start gap-3">
                        {service.icon && <span className="text-2xl">{service.icon}</span>}
                        <h3 className="font-display text-lg leading-tight text-navy md:text-xl">{service.title}</h3>
                      </div>
                      {service.shortDescription && (
                        <p className="mb-4 text-sm leading-relaxed text-grey-dark line-clamp-3">{service.shortDescription}</p>
                      )}
                      <div className="mb-4 flex gap-4 text-xs text-grey-mid">
                        {featureCount > 0 && (
                          <span className="flex items-center gap-1">
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {featureCount} features
                          </span>
                        )}
                        {caseCount > 0 && (
                          <span className="flex items-center gap-1">
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>
                            {caseCount} {caseCount === 1 ? 'project' : 'projecten'}
                          </span>
                        )}
                      </div>
                      <div className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-teal transition-all group-hover:gap-2.5">
                        Bekijk oplossing
                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </div>
                    </div>
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-navy px-6 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 font-display text-2xl md:text-3xl">Niet zeker welke oplossing bij jou past?</h2>
          <p className="mb-8 text-white/70">Plan een gratis adviesgesprek en ontdek welke branche-oplossing het beste aansluit bij jouw bedrijf.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-lg bg-teal px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-teal-dark">
            Gratis adviesgesprek plannen
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>
    </>
  )
}
