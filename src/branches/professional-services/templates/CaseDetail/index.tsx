import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CaseCard } from '@/branches/professional-services/components/CaseCard'
import { PhoneCard } from '@/branches/shared/components/ui/PhoneCard'
import { RichText } from '@/branches/shared/components/common/RichText'
import type { CaseDetailProps } from './types'

export async function CaseDetailTemplate({ case: caseItem }: CaseDetailProps) {
  const payload = await getPayload({ config })

  let relatedCases: any[] = []
  try {
    const categoryId =
      typeof caseItem.category === 'object' ? caseItem.category?.id : caseItem.category
    const result = await payload.find({
      collection: 'professional-cases',
      where: {
        and: [
          { status: { equals: 'published' } },
          { id: { not_equals: caseItem.id } },
          ...(categoryId ? [{ category: { equals: categoryId } }] : []),
        ],
      },
      limit: 3,
      sort: '-createdAt',
    })
    relatedCases = result.docs
  } catch (e) {
    /* fail silently */
  }

  const featuredImage =
    typeof caseItem.featuredImage === 'object' ? caseItem.featuredImage : null
  const testimonial = caseItem.testimonial
  const category = typeof caseItem.category === 'object' ? caseItem.category : null

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-grey-mid">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/cases" className="hover:text-primary">
            Cases
          </Link>
          <span>/</span>
          <span className="text-navy">{caseItem.title}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            {featuredImage?.url && (
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                  src={featuredImage.url}
                  alt={featuredImage.alt || caseItem.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                  priority
                />
              </div>
            )}

            <div>
              {category && (
                <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {category.title}
                </span>
              )}
              <h1 className="font-display text-3xl text-navy md:text-4xl">{caseItem.title}</h1>
              {caseItem.shortDescription && (
                <p className="mt-3 text-lg text-grey-dark">{caseItem.shortDescription}</p>
              )}
            </div>

            {(caseItem.client || caseItem.industry || caseItem.duration || caseItem.result) && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {caseItem.client && (
                  <div className="rounded-lg bg-grey-light p-4">
                    <div className="text-xs font-semibold uppercase text-grey-mid">Klant</div>
                    <div className="mt-1 text-sm font-bold text-navy">{caseItem.client}</div>
                  </div>
                )}
                {caseItem.industry && (
                  <div className="rounded-lg bg-grey-light p-4">
                    <div className="text-xs font-semibold uppercase text-grey-mid">Branche</div>
                    <div className="mt-1 text-sm font-bold text-navy">{caseItem.industry}</div>
                  </div>
                )}
                {caseItem.duration && (
                  <div className="rounded-lg bg-grey-light p-4">
                    <div className="text-xs font-semibold uppercase text-grey-mid">Duur</div>
                    <div className="mt-1 text-sm font-bold text-navy">{caseItem.duration}</div>
                  </div>
                )}
                {caseItem.result && (
                  <div className="rounded-lg bg-grey-light p-4">
                    <div className="text-xs font-semibold uppercase text-grey-mid">Resultaat</div>
                    <div className="mt-1 text-sm font-bold text-navy">{caseItem.result}</div>
                  </div>
                )}
              </div>
            )}

            {caseItem.longDescription && (
              <div className="prose max-w-none">
                <RichText content={caseItem.longDescription} />
              </div>
            )}
            {caseItem.challenge && (
              <div>
                <h2 className="mb-3 font-display text-xl text-navy">De uitdaging</h2>
                <RichText content={caseItem.challenge} />
              </div>
            )}
            {caseItem.solution && (
              <div>
                <h2 className="mb-3 font-display text-xl text-navy">Onze aanpak</h2>
                <RichText content={caseItem.solution} />
              </div>
            )}
            {caseItem.resultDescription && (
              <div>
                <h2 className="mb-3 font-display text-xl text-navy">Het resultaat</h2>
                <RichText content={caseItem.resultDescription} />
              </div>
            )}

            {testimonial?.quote && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
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
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl border border-grey bg-white p-5">
              <h3 className="mb-4 text-lg font-bold text-navy">Vrijblijvend advies</h3>
              <p className="mb-4 text-sm text-grey-dark">
                Neem contact op voor een persoonlijk adviesgesprek.
              </p>
              <a
                href="/adviesgesprek-aanvragen"
                className="block w-full rounded-lg px-4 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary, #00897B)' }}
              >
                Plan een adviesgesprek
              </a>
            </div>
            <PhoneCard phone={process.env.CONTACT_PHONE || '020 123 4567'} />
          </aside>
        </div>

        {relatedCases.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-8 text-center font-display text-2xl text-navy">
              Vergelijkbare cases
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedCases.map((c) => (
                <CaseCard key={c.id} case={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CaseDetailTemplate
