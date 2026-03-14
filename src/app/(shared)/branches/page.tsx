/**
 * /branches/ — Content Services Archive (Oplossingen)
 *
 * Lists all content-services entries as branch landing pages.
 * Route slug is configured via Settings > servicesModule.routeSlug.
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

const branchIcons: Record<string, string> = {
  tech: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zM3 14h7v7H3v-7z',
  beauty: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  horeca: 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z',
  bouw: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z',
  zorg: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  ervaringen: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  dienstverlening: 'M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z',
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Oplossingen per Branche — Sityzr',
    description:
      'Ontdek onze branche-specifieke website- en platformoplossingen. Van e-commerce tot beauty, van horeca tot bouw — voor elke sector de perfecte digitale oplossing.',
  }
}

export default async function BranchesArchivePage() {
  const payload = await getPayload({ config })

  const { docs: services } = await payload.find({
    collection: 'content-services',
    where: { status: { equals: 'published' } },
    limit: 50,
    sort: 'title',
    depth: 1,
  })

  // Get case counts per branch for stats
  const { docs: cases } = await payload.find({
    collection: 'content-cases',
    where: { status: { equals: 'published' } },
    limit: 100,
    depth: 0,
  })

  const caseCounts: Record<string, number> = {}
  for (const c of cases as any[]) {
    const b = c.branch || 'general'
    caseCounts[b] = (caseCounts[b] || 0) + 1
  }

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
            {services.length} branche-specifieke oplossingen — gebouwd op hetzelfde
            krachtige platform, afgestemd op jouw sector.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="px-6 py-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(services as any[]).map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                caseCount={caseCounts[service.branch] || 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-navy px-6 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 font-display text-2xl md:text-3xl">
            Niet zeker welke oplossing bij jou past?
          </h2>
          <p className="mb-8 text-white/70">
            Plan een gratis adviesgesprek en ontdek welke branche-oplossing het beste
            aansluit bij jouw bedrijf.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-teal px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-teal-dark"
          >
            Gratis adviesgesprek plannen
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}

function ServiceCard({
  service,
  caseCount,
}: {
  service: any
  caseCount: number
}) {
  const imageData =
    typeof service.featuredImage === 'object' && service.featuredImage !== null
      ? service.featuredImage
      : null
  const featureCount = service.features?.length || 0

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-grey bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/branches/${service.slug}`}
        className="flex h-full flex-col text-inherit no-underline"
      >
        {/* Image */}
        {imageData?.url && (
          <div className="relative aspect-video w-full overflow-hidden bg-grey-light">
            <Image
              src={imageData.url}
              alt={imageData.alt || service.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {service.branch && branchLabels[service.branch] && (
              <div className="absolute left-3 top-3 z-[2] rounded-md bg-navy/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {branchLabels[service.branch]}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col p-6">
          {/* Icon + title */}
          <div className="mb-3 flex items-start gap-3">
            {service.icon && (
              <span className="text-2xl">{service.icon}</span>
            )}
            <h3 className="font-display text-lg leading-tight text-navy md:text-xl">
              {service.title}
            </h3>
          </div>

          {/* Description */}
          {service.shortDescription && (
            <p className="mb-4 text-sm leading-relaxed text-grey-dark line-clamp-3">
              {service.shortDescription}
            </p>
          )}

          {/* Stats row */}
          <div className="mb-4 flex gap-4 text-xs text-grey-mid">
            {featureCount > 0 && (
              <span className="flex items-center gap-1">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {featureCount} features
              </span>
            )}
            {caseCount > 0 && (
              <span className="flex items-center gap-1">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                  />
                </svg>
                {caseCount} {caseCount === 1 ? 'project' : 'projecten'}
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-teal transition-all group-hover:gap-2.5">
            Bekijk oplossing
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  )
}
