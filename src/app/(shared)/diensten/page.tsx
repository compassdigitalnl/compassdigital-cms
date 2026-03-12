/**
 * Smart Services Archive Route (shared)
 * Route: /diensten
 *
 * Strategy: Query professional-services (unified), fallback to construction-services.
 * Uses the existing `services` feature flag.
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const siteName = process.env.SITE_NAME || 'Diensten'

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
  return {
    title: `Onze Diensten - ${siteName}`,
    description: 'Ontdek ons complete aanbod van diensten. Bekijk wat wij voor u kunnen betekenen.',
    alternates: { canonical: `${siteUrl}/diensten` },
  }
}

const colorMap: Record<string, string> = {
  teal: 'bg-teal/10 text-teal border-teal/20',
  blue: 'bg-blue/10 text-blue border-blue/20',
  green: 'bg-green/10 text-green border-green/20',
  purple: 'bg-purple/10 text-purple border-purple/20',
  amber: 'bg-amber/10 text-amber border-amber/20',
  coral: 'bg-coral/10 text-coral border-coral/20',
}

const branchLabels: Record<string, string> = {
  'e-commerce': 'E-commerce',
  construction: 'Bouw & Installatie',
  beauty: 'Beauty & Wellness',
  horeca: 'Horeca',
  zorg: 'Zorg & Welzijn',
  dienstverlening: 'Dienstverlening',
  ervaringen: 'Ervaringen & Events',
  marketplace: 'Marketplace',
  publishing: 'Publishing',
}

interface PageProps {
  searchParams: Promise<{ page?: string; branch?: string }>
}

export default async function DienstenPage({ searchParams }: PageProps) {
  if (
    !isFeatureEnabled('services') &&
    !isFeatureEnabled('professional_services') &&
    !isFeatureEnabled('construction')
  ) {
    notFound()
  }

  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const activeBranch = params.branch || null
  const payload = await getPayload({ config })

  // Try professional-services first
  let services: any[] = []
  let totalPages = 1
  let totalDocs = 0
  let source: 'professional' | 'construction' = 'professional'

  try {
    const where: any = { status: { equals: 'published' } }
    if (activeBranch) {
      where.branch = { equals: activeBranch }
    }

    const result = await payload.find({
      collection: 'professional-services',
      where,
      depth: 1,
      limit: 24,
      page: currentPage,
      sort: 'title',
    })
    services = result.docs
    totalPages = result.totalPages
    totalDocs = result.totalDocs
  } catch {
    // professional-services not available
  }

  // Fallback to construction-services if no results
  if (services.length === 0 && !activeBranch) {
    try {
      const result = await payload.find({
        collection: 'construction-services',
        where: { status: { equals: 'published' } },
        depth: 1,
        limit: 24,
        page: currentPage,
        sort: 'title',
      })
      services = result.docs
      totalPages = result.totalPages
      totalDocs = result.totalDocs
      source = 'construction'
    } catch {
      // construction-services not available
    }
  }

  // Collect unique branches from all professional-services for filter tabs
  let branchFilters: string[] = []
  try {
    const allServices = await payload.find({
      collection: 'professional-services',
      where: { status: { equals: 'published' } },
      limit: 500,
      depth: 0,
      select: { branch: true },
    })
    const branches = new Set<string>()
    allServices.docs.forEach((s: any) => {
      if (s.branch) branches.add(s.branch)
    })
    branchFilters = Array.from(branches).sort()
  } catch { /* */ }

  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-light px-6 py-16 text-center text-white md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
            Diensten
          </div>
          <h1 className="mb-4 font-display text-3xl md:text-5xl">Onze Diensten</h1>
          <p className="text-base text-white/80 md:text-lg">
            {totalDocs} {totalDocs === 1 ? 'dienst' : 'diensten'} — ontdek wat wij voor u kunnen betekenen.
          </p>
        </div>
      </section>

      {/* Branch filter tabs */}
      {branchFilters.length > 1 && (
        <section className="border-b border-grey bg-white px-6 py-4">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2">
            <Link
              href="/diensten"
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${!activeBranch ? 'bg-navy text-white' : 'bg-grey-light text-navy hover:bg-grey'}`}
            >
              Alles
            </Link>
            {branchFilters.map((branch) => (
              <Link
                key={branch}
                href={`/diensten?branch=${branch}`}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${activeBranch === branch ? 'bg-navy text-white' : 'bg-grey-light text-navy hover:bg-grey'}`}
              >
                {branchLabels[branch] || branch}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          {services.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service: any) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-grey-dark">
              <p className="text-lg">Nog geen diensten beschikbaar.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/diensten${activeBranch ? `?branch=${activeBranch}&` : '?'}page=${p}`}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${p === currentPage ? 'bg-navy text-white' : 'bg-grey-light text-navy hover:bg-grey'}`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Onze Diensten',
            description: 'Overzicht van al onze diensten',
            url: `${siteUrl}/diensten`,
            numberOfItems: totalDocs,
          }),
        }}
      />
    </>
  )
}

function ServiceCard({ service }: { service: any }) {
  const heroImage = typeof service.heroImage === 'object' && service.heroImage?.url ? service.heroImage : null
  const colorClass = colorMap[service.color] || colorMap.teal

  return (
    <Link
      href={`/diensten/${service.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-grey bg-white transition-shadow hover:shadow-lg"
    >
      {heroImage ? (
        <div className="relative aspect-[16/9] overflow-hidden bg-grey-light">
          <Image
            src={heroImage.url}
            alt={heroImage.alt || service.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-navy to-navy-light">
          <span className="text-4xl">{service.icon || '⚙️'}</span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        {service.branch && (
          <span className="mb-2 inline-block self-start rounded-full bg-grey-light px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-grey-dark">
            {branchLabels[service.branch] || service.branch}
          </span>
        )}
        <h3 className="mb-2 font-display text-lg text-navy group-hover:text-teal">{service.title}</h3>
        {service.shortDescription && (
          <p className="line-clamp-2 text-sm text-grey-dark">{service.shortDescription}</p>
        )}
        {service.features && service.features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {service.features.slice(0, 3).map((f: any, i: number) => (
              <span key={i} className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${colorClass}`}>
                {f.feature}
              </span>
            ))}
            {service.features.length > 3 && (
              <span className="rounded-full bg-grey-light px-2 py-0.5 text-[10px] font-semibold text-grey-dark">
                +{service.features.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
