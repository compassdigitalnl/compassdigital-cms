/**
 * Smart Service Detail Route (shared)
 * Route: /diensten/[slug]
 *
 * Strategy: Try professional-services first, fallback to construction-services.
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { isFeatureEnabled } from '@/lib/tenant/features'
import Link from 'next/link'
import Image from 'next/image'
import { ProjectCard } from '@/branches/shared/components/ProjectCard'
import {
  buildProfessionalServiceSchema,
  buildConstructionServiceSchema,
  buildLocalBusinessSchema,
} from '@/features/seo/lib/schema-builders'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''

  // Try professional-services
  try {
    const { docs } = await payload.find({
      collection: 'professional-services',
      where: { slug: { equals: slug }, status: { equals: 'published' } },
      limit: 1,
      depth: 1,
    })
    if (docs[0]) {
      const s = docs[0] as any
      const imageUrl = typeof s.heroImage === 'object' && s.heroImage?.url ? s.heroImage.url : null
      return {
        title: s.meta?.title || `${s.title} - Onze Diensten`,
        description: s.meta?.description || s.shortDescription,
        alternates: { canonical: `${siteUrl}/diensten/${slug}` },
        openGraph: {
          title: s.meta?.title || s.title,
          description: s.meta?.description || s.shortDescription,
          url: `${siteUrl}/diensten/${slug}`,
          ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
        },
      }
    }
  } catch { /* */ }

  // Try construction-services
  try {
    const { docs } = await payload.find({
      collection: 'construction-services',
      where: { slug: { equals: slug }, status: { equals: 'published' } },
      limit: 1,
      depth: 1,
    })
    if (docs[0]) {
      const s = docs[0] as any
      const imageUrl = typeof s.heroImage === 'object' && s.heroImage?.url ? s.heroImage.url : null
      return {
        title: `${s.title} - Onze Diensten`,
        description: s.shortDescription,
        alternates: { canonical: `${siteUrl}/diensten/${slug}` },
        openGraph: {
          title: s.title,
          description: s.shortDescription,
          url: `${siteUrl}/diensten/${slug}`,
          ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
        },
      }
    }
  } catch { /* */ }

  return { title: 'Dienst niet gevonden' }
}

export default async function ServiceDetailPage({ params }: PageProps) {
  if (
    !isFeatureEnabled('services') &&
    !isFeatureEnabled('professional_services') &&
    !isFeatureEnabled('construction')
  ) {
    notFound()
  }

  const { slug } = await params
  const payload = await getPayload({ config })

  let service: any = null
  let source: 'professional' | 'construction' = 'professional'

  // Try professional-services first
  try {
    const { docs } = await payload.find({
      collection: 'professional-services',
      where: { slug: { equals: slug }, status: { equals: 'published' } },
      depth: 2,
      limit: 1,
    })
    if (docs[0]) service = docs[0]
  } catch { /* */ }

  // Fallback to construction-services
  if (!service) {
    try {
      const { docs } = await payload.find({
        collection: 'construction-services',
        where: { slug: { equals: slug }, status: { equals: 'published' } },
        depth: 2,
        limit: 1,
      })
      if (docs[0]) {
        service = docs[0]
        source = 'construction'
      }
    } catch { /* */ }
  }

  if (!service) notFound()

  const heroImage = typeof service.heroImage === 'object' && service.heroImage?.url ? service.heroImage : null
  const features = Array.isArray(service.features) ? service.features : []
  const processSteps = Array.isArray(service.processSteps) ? service.processSteps : []
  const usps = Array.isArray(service.usps) ? service.usps : []
  const serviceTypes = Array.isArray(service.serviceTypes) ? service.serviceTypes : []
  const faq = Array.isArray(service.faq) ? service.faq : []

  // Get related cases
  let relatedCases: any[] = []
  const relatedProjects = Array.isArray(service.relatedProjects) ? service.relatedProjects.filter((p: any) => typeof p === 'object') : []

  if (relatedProjects.length > 0) {
    relatedCases = relatedProjects.slice(0, 6)
  } else if (service.branch) {
    // Auto-query projects with same branch
    try {
      const { docs } = await payload.find({
        collection: 'projects',
        where: { status: { equals: 'published' }, branch: { equals: service.branch } },
        limit: 3,
        sort: '-createdAt',
        depth: 1,
      })
      relatedCases = docs
    } catch { /* */ }
  }

  // Get related services for sidebar
  let relatedServices: any[] = []
  try {
    const collection = source === 'construction' ? 'construction-services' : 'professional-services'
    const { docs } = await payload.find({
      collection,
      where: {
        and: [
          { status: { equals: 'published' } },
          { id: { not_equals: service.id } },
        ],
      },
      limit: 4,
      sort: 'title',
      depth: 0,
    })
    relatedServices = docs
  } catch { /* */ }

  // JSON-LD
  let jsonLdSchemas: object[] = []
  try {
    const settings = await payload.findGlobal({ slug: 'settings' })
    if (settings.enableJSONLD) {
      const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
      jsonLdSchemas.push(buildLocalBusinessSchema(settings, siteUrl))
      if (source === 'construction') {
        jsonLdSchemas.push(buildConstructionServiceSchema(service, settings, siteUrl))
      } else {
        jsonLdSchemas.push(buildProfessionalServiceSchema(service, settings, siteUrl))
      }
    }
  } catch { /* */ }

  return (
    <div className="bg-white">
      {jsonLdSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-grey-mid">
          <Link href="/" className="hover:text-teal">Home</Link>
          <span>/</span>
          <Link href="/diensten" className="hover:text-teal">Diensten</Link>
          <span>/</span>
          <span className="text-navy">{service.title}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            {service.icon && <span className="text-2xl">{service.icon}</span>}
            {service.color && (
              <span className={`rounded-full bg-${service.color}/10 px-3 py-1 text-xs font-semibold text-${service.color}`}>
                {service.branch ? (service.branch === 'construction' ? 'Bouw' : service.branch) : 'Dienst'}
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl text-navy md:text-4xl">{service.title}</h1>
          {service.shortDescription && (
            <p className="mt-3 max-w-3xl text-lg text-grey-dark">{service.shortDescription}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-10 lg:col-span-2">
            {/* Hero image */}
            {heroImage && (
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image src={heroImage.url} alt={heroImage.alt || service.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 66vw" priority />
              </div>
            )}

            {/* Long description */}
            {service.longDescription && (
              <div className="prose max-w-none text-grey-dark">
                <RichTextContent content={service.longDescription} />
              </div>
            )}

            {/* Features grid */}
            {features.length > 0 && (
              <div>
                <h2 className="mb-4 font-display text-xl text-navy">Kenmerken</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {features.map((f: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg border border-grey bg-white p-4">
                      <svg className="mt-0.5 h-5 w-5 shrink-0 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <span className="text-sm font-medium text-navy">{f.feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Process steps */}
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

            {/* USPs */}
            {usps.length > 0 && (
              <div>
                <h2 className="mb-4 font-display text-xl text-navy">Waarom kiezen voor ons?</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {usps.map((usp: any, i: number) => (
                    <div key={i} className="rounded-xl border border-teal/20 bg-teal/5 p-5">
                      <h3 className="mb-1 text-sm font-bold text-navy">{usp.title}</h3>
                      <p className="text-sm text-grey-dark">{usp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Service types */}
            {serviceTypes.length > 0 && (
              <div>
                <h2 className="mb-4 font-display text-xl text-navy">Dienst varianten</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {serviceTypes.map((st: any, i: number) => (
                    <div key={i} className="rounded-lg border border-grey p-4">
                      <h3 className="mb-1 text-sm font-bold text-navy">{st.name}</h3>
                      {st.description && <p className="text-sm text-grey-dark">{st.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related cases */}
            {relatedCases.length > 0 && (
              <div>
                <h2 className="mb-6 font-display text-xl text-navy">Cases met deze dienst</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {relatedCases.map((project: any) => (
                    <ProjectCard key={project.id} project={project} basePath="/cases" />
                  ))}
                </div>
              </div>
            )}

            {/* FAQ */}
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

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl border border-grey bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-bold text-navy">Interesse in deze dienst?</h3>
              <p className="mb-4 text-sm text-grey-dark">Neem vrijblijvend contact op voor een adviesgesprek.</p>
              <Link href="/contact" className="block w-full rounded-lg bg-teal px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-teal-dark">
                Neem contact op
              </Link>
            </div>

            {relatedServices.length > 0 && (
              <div className="rounded-xl border border-grey bg-white p-6">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-grey-dark">Andere diensten</h4>
                <div className="space-y-2">
                  {relatedServices.map((rs: any) => (
                    <Link
                      key={rs.id}
                      href={`/diensten/${rs.slug}`}
                      className="flex items-center gap-2 rounded-lg p-2 text-sm text-navy transition-colors hover:bg-grey-light"
                    >
                      {rs.icon && <span>{rs.icon}</span>}
                      <span className="font-medium">{rs.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}

/* ─── Rich Text Helper ─── */

function RichTextContent({ content }: { content: any }) {
  if (!content) return null
  if (typeof content === 'string') return <p>{content}</p>
  if (content?.root?.children) {
    return <>{content.root.children.map((node: any, i: number) => <LexicalNode key={i} node={node} />)}</>
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
