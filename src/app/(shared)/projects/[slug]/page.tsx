/**
 * Unified Project Detail Page
 *
 * Shows a single project from the shared 'projects' collection.
 * Route: /projects/[slug]
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ProjectCard } from '@/branches/shared/components/ProjectCard'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 1,
  })

  const project = docs[0] as any
  if (!project) return { title: 'Project niet gevonden' }

  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const imageUrl =
    typeof project.featuredImage === 'object' && project.featuredImage?.url
      ? project.featuredImage.url
      : null

  return {
    title: `${project.title} - Projecten`,
    description: project.shortDescription || undefined,
    alternates: { canonical: `${siteUrl}/projects/${slug}` },
    openGraph: {
      title: project.title,
      description: project.shortDescription || undefined,
      url: `${siteUrl}/projects/${slug}`,
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
  }
}

const branchLabels: Record<string, string> = {
  'e-commerce': 'E-commerce',
  construction: 'Bouw & Installatie',
  beauty: 'Beauty & Wellness',
  horeca: 'Horeca',
  zorg: 'Zorg & Welzijn',
  dienstverlening: 'Dienstverlening',
  ervaringen: 'Ervaringen',
  marketplace: 'Marketplace',
  publishing: 'Publishing',
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    depth: 2,
    limit: 1,
  })

  const project = docs[0] as any
  if (!project) notFound()

  const featuredImage =
    typeof project.featuredImage === 'object' && project.featuredImage !== null
      ? project.featuredImage
      : null
  const gallery = Array.isArray(project.gallery)
    ? project.gallery.filter((img: any) => typeof img === 'object' && img?.url)
    : []
  const testimonial = project.testimonial
  const beforeAfter = project.beforeAfter || {}
  const beforeImage = typeof beforeAfter.before === 'object' ? beforeAfter.before : null
  const afterImage = typeof beforeAfter.after === 'object' ? beforeAfter.after : null

  // Build specs
  const specs: { label: string; value: string }[] = []
  if (project.client) specs.push({ label: 'Klant', value: project.client })
  if (project.location) specs.push({ label: 'Locatie', value: project.location })
  if (project.industry) specs.push({ label: 'Branche', value: project.industry })
  if (project.year) specs.push({ label: 'Jaar', value: String(project.year) })
  if (project.duration) specs.push({ label: 'Doorlooptijd', value: project.duration })
  if (project.size) specs.push({ label: 'Oppervlakte', value: project.size })
  if (project.budget) specs.push({ label: 'Budget', value: project.budget })

  // Related projects (same branch, excluding current)
  let relatedProjects: any[] = []
  try {
    const result = await payload.find({
      collection: 'projects',
      where: {
        and: [
          { status: { equals: 'published' } },
          { id: { not_equals: project.id } },
          { branch: { equals: project.branch } },
        ],
      },
      limit: 3,
      sort: '-createdAt',
      depth: 1,
    })
    relatedProjects = result.docs
  } catch {
    /* silently fail */
  }

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-grey-mid">
          <Link href="/" className="hover:text-teal">
            Home
          </Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-teal">
            Projecten
          </Link>
          {project.branch && (
            <>
              <span>/</span>
              <Link
                href={`/projects?branch=${project.branch}`}
                className="hover:text-teal"
              >
                {branchLabels[project.branch] || project.branch}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-navy">{project.title}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-10 lg:col-span-2">
            {/* Hero image + gallery */}
            {featuredImage?.url && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2 md:row-span-2">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <Image
                      src={featuredImage.url}
                      alt={featuredImage.alt || project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                    {project.resultHighlight && (
                      <div className="absolute bottom-4 right-4 z-[2] rounded-lg bg-teal/90 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
                        {project.resultHighlight}
                      </div>
                    )}
                  </div>
                </div>
                {gallery.slice(0, 2).map((img: any, i: number) => (
                  <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <Image
                      src={img.url}
                      alt={img.alt || ''}
                      fill
                      className="object-cover"
                      sizes="33vw"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Before/After */}
            {beforeImage?.url && afterImage?.url && (
              <div>
                <h2 className="mb-4 font-display text-xl text-navy">Voor & Na</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-grey-dark">
                      Voor
                    </p>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                      <Image
                        src={beforeImage.url}
                        alt="Voor"
                        fill
                        className="object-cover"
                        sizes="50vw"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-grey-dark">
                      Na
                    </p>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                      <Image
                        src={afterImage.url}
                        alt="Na"
                        fill
                        className="object-cover"
                        sizes="50vw"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Specs grid */}
            {specs.length > 0 && (
              <div
                className={`grid gap-4 ${specs.length >= 4 ? 'grid-cols-2 md:grid-cols-4' : specs.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}
              >
                {specs.map((spec, i) => (
                  <div key={i} className="rounded-lg bg-grey-light p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-grey-dark">
                      {spec.label}
                    </p>
                    <p className="mt-1 text-base font-bold text-navy">{spec.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Title & branch badge */}
            <div>
              {project.branch && (
                <span className="mb-2 inline-block rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
                  {branchLabels[project.branch] || project.branch}
                </span>
              )}
              <h1 className="font-display text-3xl text-navy md:text-4xl">{project.title}</h1>
              {project.shortDescription && (
                <p className="mt-3 text-lg text-grey-dark">{project.shortDescription}</p>
              )}
            </div>

            {/* Rich text sections */}
            {project.longDescription && (
              <RichTextSection content={project.longDescription} />
            )}
            {project.challenge && (
              <div>
                <h2 className="mb-3 font-display text-xl text-navy">De uitdaging</h2>
                <RichTextSection content={project.challenge} />
              </div>
            )}
            {project.solution && (
              <div>
                <h2 className="mb-3 font-display text-xl text-navy">Onze aanpak</h2>
                <RichTextSection content={project.solution} />
              </div>
            )}
            {project.resultDescription && (
              <div>
                <h2 className="mb-3 font-display text-xl text-navy">Het resultaat</h2>
                <RichTextSection content={project.resultDescription} />
              </div>
            )}

            {/* Testimonial */}
            {testimonial?.quote && (
              <div className="rounded-xl border border-teal/20 bg-teal/5 p-6">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-lg text-amber-400">
                      &#9733;
                    </span>
                  ))}
                </div>
                <blockquote className="text-lg italic leading-relaxed text-navy">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                {testimonial.clientName && (
                  <div className="mt-3 text-sm font-semibold text-grey-dark">
                    — {testimonial.clientName}
                    {testimonial.clientRole && (
                      <span className="font-normal text-grey-mid">
                        , {testimonial.clientRole}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Gallery (remaining images) */}
            {gallery.length > 2 && (
              <div>
                <h2 className="mb-4 font-display text-xl text-navy">Meer foto&apos;s</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {gallery.slice(2).map((img: any, i: number) => (
                    <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                      <Image
                        src={img.url}
                        alt={img.alt || ''}
                        fill
                        className="object-cover"
                        sizes="33vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            {/* CTA card */}
            <div className="rounded-xl border border-grey bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-bold text-navy">
                Zelf ook zo&apos;n project?
              </h3>
              <p className="mb-4 text-sm text-grey-dark">
                Neem vrijblijvend contact op voor een adviesgesprek.
              </p>
              <Link
                href="/contact"
                className="block w-full rounded-lg bg-teal px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-teal-dark"
              >
                Neem contact op
              </Link>
            </div>

            {/* Badges */}
            {project.badges && project.badges.length > 0 && (
              <div className="rounded-xl border border-grey bg-white p-6">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-grey-dark">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.badges.map((b: any, i: number) => (
                    <span
                      key={i}
                      className="rounded-full bg-navy/10 px-3 py-1 text-xs font-semibold text-navy"
                    >
                      {b.badge}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Related projects */}
        {relatedProjects.length > 0 && (
          <div className="mt-16 border-t border-grey pt-12">
            <h2 className="mb-8 text-center font-display text-2xl text-navy">
              Vergelijkbare projecten
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href={`/projects?branch=${project.branch}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:underline"
              >
                Bekijk alle {branchLabels[project.branch] || ''} projecten
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
        )}
      </div>
    </div>
  )
}

/** Renders Lexical rich text or plain string */
function RichTextSection({ content }: { content: any }) {
  if (!content) return null

  // Plain text string
  if (typeof content === 'string') {
    return <p className="text-grey-dark leading-relaxed">{content}</p>
  }

  // Lexical rich text object
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

  if (node.type === 'paragraph') {
    const children = node.children?.map((child: any, i: number) => (
      <LexicalNode key={i} node={child} />
    ))
    return <p>{children}</p>
  }

  if (node.type === 'heading') {
    const Tag = (node.tag || 'h2') as 'h2' | 'h3' | 'h4'
    const children = node.children?.map((child: any, i: number) => (
      <LexicalNode key={i} node={child} />
    ))
    return <Tag>{children}</Tag>
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
        {node.children?.map((child: any, i: number) => (
          <LexicalNode key={i} node={child} />
        ))}
      </Tag>
    )
  }

  if (node.type === 'listitem') {
    return (
      <li>
        {node.children?.map((child: any, i: number) => (
          <LexicalNode key={i} node={child} />
        ))}
      </li>
    )
  }

  if (node.type === 'link') {
    return (
      <a href={node.fields?.url || '#'} className="text-teal hover:underline">
        {node.children?.map((child: any, i: number) => (
          <LexicalNode key={i} node={child} />
        ))}
      </a>
    )
  }

  // Fallback: render children if any
  if (node.children) {
    return (
      <>
        {node.children.map((child: any, i: number) => (
          <LexicalNode key={i} node={child} />
        ))}
      </>
    )
  }

  return null
}
