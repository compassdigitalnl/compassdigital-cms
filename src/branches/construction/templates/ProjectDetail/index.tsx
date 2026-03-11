import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import { BeforeAfterSlider } from '@/branches/shared/components/ui/BeforeAfterSlider'
import { SpecsGrid } from '@/branches/shared/components/ui/SpecsGrid'
import { PhoneCard } from '@/branches/shared/components/ui/PhoneCard'
import { ProjectCard } from '@/branches/construction/components/ProjectCard'
import { QuoteForm } from '@/branches/construction/components/QuoteForm'
import type { ProjectDetailProps } from './types'
import type { ConstructionProject, Media } from '@/payload-types'

export async function ProjectDetailTemplate({ project }: ProjectDetailProps) {
  const payload = await getPayload({ config })

  let relatedProjects: ConstructionProject[] = []
  try {
    const categoryId = typeof project.category === 'object' ? project.category?.id : project.category
    const result = await payload.find({
      collection: 'construction-projects',
      where: {
        and: [
          { status: { equals: 'published' } },
          { id: { not_equals: project.id } },
          ...(categoryId ? [{ category: { equals: categoryId } }] : []),
        ],
      },
      limit: 3,
      sort: '-createdAt',
    })
    relatedProjects = result.docs
  } catch (e) { /* fail silently */ }

  const featuredImage = typeof project.featuredImage === 'object' ? (project.featuredImage as Media) : null
  const gallery = (project as any).gallery || []
  const beforeAfter = (project as any).beforeAfter || {}
  const beforeImage = typeof beforeAfter.before === 'object' ? beforeAfter.before : null
  const afterImage = typeof beforeAfter.after === 'object' ? beforeAfter.after : null

  const specs = []
  if ((project as any).location) specs.push({ icon: 'location', label: 'Locatie', value: (project as any).location })
  if ((project as any).year) specs.push({ icon: 'year', label: 'Jaar', value: String((project as any).year) })
  if ((project as any).duration) specs.push({ icon: 'duration', label: 'Duur', value: (project as any).duration })
  if ((project as any).size) specs.push({ icon: 'area', label: 'Oppervlakte', value: (project as any).size })

  const category = typeof project.category === 'object' ? project.category : null
  const testimonial = (project as any).testimonial

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-grey-mid">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/projecten" className="hover:text-primary">Projecten</Link>
          <span>/</span>
          <span className="text-navy">{project.title}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            {featuredImage?.url && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2 md:row-span-2">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <Image src={featuredImage.url} alt={featuredImage.alt || project.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
                  </div>
                </div>
                {gallery.slice(0, 2).map((item: any, i: number) => {
                  const img = typeof item.image === 'object' ? item.image : null
                  if (!img?.url) return null
                  return (
                    <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                      <Image src={img.url} alt={img.alt || ''} fill className="object-cover" sizes="33vw" />
                    </div>
                  )
                })}
              </div>
            )}

            {beforeImage?.url && afterImage?.url && (
              <div>
                <h2 className="mb-4 font-display text-xl text-navy">Voor & Na</h2>
                <BeforeAfterSlider beforeImage={beforeImage.url} afterImage={afterImage.url} />
              </div>
            )}

            {specs.length > 0 && <SpecsGrid specs={specs} columns={specs.length >= 4 ? 4 : specs.length as 2 | 3} />}

            <div>
              {category && (
                <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{category.title}</span>
              )}
              <h1 className="font-display text-3xl text-navy md:text-4xl">{project.title}</h1>
              {(project as any).shortDescription && <p className="mt-3 text-lg text-grey-dark">{(project as any).shortDescription}</p>}
            </div>

            {(project as any).longDescription && <div className="prose max-w-none text-grey-dark"><p>{(project as any).longDescription}</p></div>}
            {(project as any).challenge && <div><h2 className="mb-3 font-display text-xl text-navy">De uitdaging</h2><p className="text-grey-dark">{(project as any).challenge}</p></div>}
            {(project as any).solution && <div><h2 className="mb-3 font-display text-xl text-navy">Onze aanpak</h2><p className="text-grey-dark">{(project as any).solution}</p></div>}
            {(project as any).result && <div><h2 className="mb-3 font-display text-xl text-navy">Het resultaat</h2><p className="text-grey-dark">{(project as any).result}</p></div>}

            {testimonial?.quote && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
                <div className="mb-3 flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <span key={i} className="text-lg text-amber-400">&#9733;</span>)}</div>
                <blockquote className="text-lg italic leading-relaxed text-navy">&ldquo;{testimonial.quote}&rdquo;</blockquote>
                {testimonial.clientName && <div className="mt-3 text-sm font-semibold text-grey-dark">— {testimonial.clientName}{testimonial.clientRole && <span className="font-normal text-grey-mid">, {testimonial.clientRole}</span>}</div>}
              </div>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl border border-grey bg-white p-5">
              <h3 className="mb-4 text-lg font-bold text-navy">Vrijblijvend advies</h3>
              <QuoteForm className="quote-form--compact" />
            </div>
            <PhoneCard phone="0251-247233" />
          </aside>
        </div>

        {relatedProjects.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-8 text-center font-display text-2xl text-navy">Vergelijkbare projecten</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectDetailTemplate
