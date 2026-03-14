/**
 * /branches/[slug]/ — Content Service Detail (Branche Oplossing)
 *
 * Shows a single content-service entry as a full landing page with:
 * - Hero with featured image
 * - Features grid
 * - Process steps
 * - USPs
 * - Related cases (projects)
 * - FAQ
 * - CTA
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ProjectCard } from '@/branches/shared/components/ProjectCard'

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

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'content-services',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 1,
  })

  const service = docs[0] as any
  if (!service) return { title: 'Oplossing niet gevonden' }

  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const imageUrl =
    typeof service.featuredImage === 'object' && service.featuredImage?.url
      ? service.featuredImage.url
      : null

  return {
    title: `${service.title} — Sityzr`,
    description: service.shortDescription || undefined,
    alternates: { canonical: `${siteUrl}/branches/${slug}` },
    openGraph: {
      title: service.title,
      description: service.shortDescription || undefined,
      url: `${siteUrl}/branches/${slug}`,
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
  }
}

export default async function BranchDetailPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'content-services',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  })

  const service = docs[0] as any
  if (!service) notFound()

  const imageData =
    typeof service.featuredImage === 'object' && service.featuredImage !== null
      ? service.featuredImage
      : null

  // Fetch related cases for this branch
  let relatedCases: any[] = []
  if (service.branch) {
    try {
      const result = await payload.find({
        collection: 'content-cases',
        where: {
          and: [
            { status: { equals: 'published' } },
            { branch: { equals: service.branch } },
          ],
        },
        limit: 6,
        sort: '-createdAt',
        depth: 1,
      })
      relatedCases = result.docs
    } catch {
      /* silently fail */
    }
  }

  // Fetch related reviews for this branch
  let relatedReviews: any[] = []
  if (service.branch) {
    try {
      const result = await payload.find({
        collection: 'content-reviews',
        where: {
          and: [
            { status: { equals: 'published' } },
            { branch: { equals: service.branch } },
          ],
        },
        limit: 3,
        depth: 1,
      })
      relatedReviews = result.docs
    } catch {
      /* silently fail */
    }
  }

  // Fetch other services for "more solutions" section
  let otherServices: any[] = []
  try {
    const result = await payload.find({
      collection: 'content-services',
      where: {
        and: [
          { status: { equals: 'published' } },
          { id: { not_equals: service.id } },
        ],
      },
      limit: 3,
      sort: 'title',
      depth: 1,
    })
    otherServices = result.docs
  } catch {
    /* silently fail */
  }

  const features = service.features || []
  const processSteps = service.processSteps || []
  const usps = service.usps || []
  const faq = service.faq || []

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-grey-mid">
          <Link href="/" className="hover:text-teal">
            Home
          </Link>
          <span>/</span>
          <Link href="/branches" className="hover:text-teal">
            Oplossingen
          </Link>
          <span>/</span>
          <span className="text-navy">{service.title}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-light px-6 py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div>
            {service.branch && branchLabels[service.branch] && (
              <div className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
                {branchLabels[service.branch]}
              </div>
            )}
            <h1 className="mb-4 font-display text-3xl md:text-5xl">
              {service.title}
            </h1>
            {service.shortDescription && (
              <p className="mb-6 text-lg text-white/80">
                {service.shortDescription}
              </p>
            )}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-teal px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-dark"
              >
                Gratis demo aanvragen
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                Bekijk tarieven
              </Link>
            </div>
          </div>
          {imageData?.url && (
            <div className="relative aspect-video overflow-hidden rounded-xl shadow-2xl">
              <Image
                src={imageData.url}
                alt={imageData.alt || service.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          )}
        </div>
      </section>

      {/* Description (rich text) */}
      {service.description && (
        <section className="px-6 py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <RichTextSection content={service.description} />
          </div>
        </section>
      )}

      {/* Features Grid */}
      {features.length > 0 && (
        <section className="bg-grey-light px-6 py-12 md:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-2 text-center font-display text-2xl text-navy md:text-3xl">
              Mogelijkheden
            </h2>
            <p className="mb-10 text-center text-grey-dark">
              Alles wat je nodig hebt voor{' '}
              {(branchLabels[service.branch] || service.title).toLowerCase()}
            </p>
            <div
              className={`grid gap-6 ${features.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}
            >
              {features.map((feature: any, i: number) => (
                <div
                  key={i}
                  className="rounded-xl border border-grey bg-white p-6 transition-shadow hover:shadow-md"
                >
                  {feature.icon && (
                    <span className="mb-3 inline-block text-2xl">
                      {feature.icon}
                    </span>
                  )}
                  <h3 className="mb-2 text-base font-bold text-navy">
                    {feature.title}
                  </h3>
                  {feature.description && (
                    <p className="text-sm leading-relaxed text-grey-dark">
                      {feature.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process Steps */}
      {processSteps.length > 0 && (
        <section className="px-6 py-12 md:py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-2 text-center font-display text-2xl text-navy md:text-3xl">
              Hoe het werkt
            </h2>
            <p className="mb-10 text-center text-grey-dark">
              In {processSteps.length} stappen naar jouw perfecte{' '}
              {(branchLabels[service.branch] || '').toLowerCase()} platform
            </p>
            <div className="space-y-6">
              {processSteps.map((step: any, i: number) => (
                <div
                  key={i}
                  className="flex gap-6 rounded-xl border border-grey bg-white p-6"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal text-lg font-bold text-white">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-bold text-navy">
                      {step.title}
                    </h3>
                    {step.description && (
                      <p className="text-sm leading-relaxed text-grey-dark">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* USPs */}
      {usps.length > 0 && (
        <section className="bg-teal/5 px-6 py-12 md:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-10 text-center font-display text-2xl text-navy md:text-3xl">
              Waarom Sityzr?
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {usps.map((usp: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal/20 text-teal">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-bold text-navy">
                      {usp.title}
                    </h3>
                    {usp.description && (
                      <p className="text-sm leading-relaxed text-grey-dark">
                        {usp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Cases / Projects */}
      {relatedCases.length > 0 && (
        <section className="px-6 py-12 md:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-2 text-center font-display text-2xl text-navy md:text-3xl">
              Projecten in {branchLabels[service.branch] || service.title}
            </h2>
            <p className="mb-10 text-center text-grey-dark">
              Bekijk wat wij voor klanten in deze branche hebben gerealiseerd
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedCases.map((project: any) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  basePath="/cases"
                />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href={`/cases/${service.branch}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:underline"
              >
                Bekijk alle{' '}
                {(branchLabels[service.branch] || '').toLowerCase()} projecten
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
          </div>
        </section>
      )}

      {/* Reviews */}
      {relatedReviews.length > 0 && (
        <section className="bg-grey-light px-6 py-12 md:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-10 text-center font-display text-2xl text-navy md:text-3xl">
              Wat klanten zeggen
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedReviews.map((review: any) => (
                <div
                  key={review.id}
                  className="rounded-xl border border-grey bg-white p-6"
                >
                  {review.rating && (
                    <div className="mb-3 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className="text-base"
                          style={{
                            color:
                              i < review.rating
                                ? 'var(--amber, #f59e0b)'
                                : '#e5e7eb',
                          }}
                        >
                          &#9733;
                        </span>
                      ))}
                    </div>
                  )}
                  <blockquote className="mb-4 text-sm italic leading-relaxed text-grey-dark">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    {review.authorPhoto &&
                      typeof review.authorPhoto === 'object' &&
                      review.authorPhoto?.url && (
                        <Image
                          src={review.authorPhoto.url}
                          alt={review.authorName}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      )}
                    {!review.authorPhoto?.url && review.authorInitials && (
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{
                          backgroundColor: review.authorColor || '#2563eb',
                        }}
                      >
                        {review.authorInitials}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-navy">
                        {review.authorName}
                      </p>
                      {(review.authorRole || review.authorCompany) && (
                        <p className="text-xs text-grey-mid">
                          {review.authorRole}
                          {review.authorRole && review.authorCompany && ', '}
                          {review.authorCompany}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="px-6 py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-10 text-center font-display text-2xl text-navy md:text-3xl">
              Veelgestelde vragen
            </h2>
            <div className="space-y-4">
              {faq.map((item: any, i: number) => (
                <details
                  key={i}
                  className="group rounded-xl border border-grey bg-white"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-5 text-base font-semibold text-navy">
                    {item.question}
                    <svg
                      className="h-5 w-5 shrink-0 text-grey-mid transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="border-t border-grey px-5 pb-5 pt-3 text-sm leading-relaxed text-grey-dark">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other Solutions */}
      {otherServices.length > 0 && (
        <section className="bg-grey-light px-6 py-12 md:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-center font-display text-2xl text-navy">
              Andere oplossingen
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {otherServices.map((svc: any) => {
                const img =
                  typeof svc.featuredImage === 'object' &&
                  svc.featuredImage !== null
                    ? svc.featuredImage
                    : null
                return (
                  <Link
                    key={svc.id}
                    href={`/branches/${svc.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-grey bg-white no-underline transition-shadow hover:shadow-md"
                  >
                    {img?.url && (
                      <div className="relative aspect-[3/2] overflow-hidden">
                        <Image
                          src={img.url}
                          alt={img.alt || svc.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="33vw"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="mb-1 font-display text-base text-navy">
                        {svc.title}
                      </h3>
                      {svc.shortDescription && (
                        <p className="text-xs text-grey-dark line-clamp-2">
                          {svc.shortDescription}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/branches"
                className="text-sm font-semibold text-teal hover:underline"
              >
                Bekijk alle oplossingen
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="bg-navy px-6 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 font-display text-2xl md:text-3xl">
            Klaar om te starten met {service.title}?
          </h2>
          <p className="mb-8 text-white/70">
            Vraag een gratis demo aan en ontdek hoe Sityzr jouw{' '}
            {(branchLabels[service.branch] || '').toLowerCase()} bedrijf kan
            transformeren.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-teal px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-teal-dark"
            >
              Gratis demo aanvragen
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              Bekijk tarieven
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ─── Rich Text Helpers ─────────────────────────────────────── */

function RichTextSection({ content }: { content: any }) {
  if (!content) return null
  if (typeof content === 'string') {
    return <p className="leading-relaxed text-grey-dark">{content}</p>
  }
  if (content?.root?.children) {
    return (
      <div className="prose max-w-none text-grey-dark">
        {content.root.children.map((node: any, i: number) => (
          <LexicalNode key={i} node={node} />
        ))}
      </div>
    )
  }
  return null
}

function LexicalNode({ node }: { node: any }) {
  if (!node) return null
  if (node.type === 'paragraph')
    return (
      <p>
        {node.children?.map((c: any, i: number) => (
          <LexicalNode key={i} node={c} />
        ))}
      </p>
    )
  if (node.type === 'heading') {
    const Tag = (node.tag || 'h2') as 'h2' | 'h3' | 'h4'
    return (
      <Tag>
        {node.children?.map((c: any, i: number) => (
          <LexicalNode key={i} node={c} />
        ))}
      </Tag>
    )
  }
  if (node.type === 'text') {
    let text: React.ReactNode = node.text || ''
    if (node.format & 1) text = <strong>{text}</strong>
    if (node.format & 2) text = <em>{text}</em>
    if (node.format & 4) text = <s>{text}</s>
    if (node.format & 8) text = <u>{text}</u>
    return <>{text}</>
  }
  if (node.type === 'list') {
    const Tag = node.listType === 'number' ? 'ol' : 'ul'
    return (
      <Tag>
        {node.children?.map((c: any, i: number) => (
          <LexicalNode key={i} node={c} />
        ))}
      </Tag>
    )
  }
  if (node.type === 'listitem')
    return (
      <li>
        {node.children?.map((c: any, i: number) => (
          <LexicalNode key={i} node={c} />
        ))}
      </li>
    )
  if (node.type === 'link')
    return (
      <a href={node.fields?.url || '#'} className="text-teal hover:underline">
        {node.children?.map((c: any, i: number) => (
          <LexicalNode key={i} node={c} />
        ))}
      </a>
    )
  if (node.children)
    return (
      <>
        {node.children.map((c: any, i: number) => (
          <LexicalNode key={i} node={c} />
        ))}
      </>
    )
  return null
}
