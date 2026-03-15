import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ConsultationForm } from '@/branches/professional-services/components/ConsultationForm'
import type { ConsultationRequestProps } from './types'

export async function ConsultationRequestTemplate({
  phone = '020 123 4567',
}: ConsultationRequestProps) {
  let testimonial: any = null
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'professional-reviews',
      where: { and: [{ status: { equals: 'published' } }, { featured: { equals: true } }] },
      limit: 1,
      sort: '-createdAt',
    })
    testimonial = result.docs[0] || null
  } catch (e) {
    /* fail silently */
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-grey-mid">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <span className="text-navy">Adviesgesprek aanvragen</span>
        </nav>
      </div>

      <section className="bg-gradient-to-br from-secondary to-secondary/90 py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="font-display text-3xl text-white md:text-4xl">
            Gratis adviesgesprek aanvragen
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-white/80">
            Vul het formulier in en wij nemen binnen 24 uur contact met u op voor een vrijblijvend
            adviesgesprek.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ConsultationForm />
          </div>
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl border border-grey bg-white p-6">
              <h3 className="mb-4 text-lg font-bold text-navy">Waarom kiezen voor ons?</h3>
              <ul className="space-y-3">
                {[
                  'Vrijblijvend en kosteloos advies',
                  'Reactie binnen 24 uur',
                  'Ervaren professionals',
                  'Transparante werkwijze',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-grey-dark">
                    <svg
                      className="mt-0.5 shrink-0 text-green"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M13.3 4.7L6 12l-3.3-3.3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-grey bg-white p-6">
              <h3 className="mb-3 text-lg font-bold text-navy">Liever direct contact?</h3>
              <p className="mb-4 text-sm text-grey-dark">Bel of mail ons gerust.</p>
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-sm font-semibold text-navy hover:text-primary"
              >
                {phone}
              </a>
            </div>

            {testimonial && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
                <div className="mb-2 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-base ${i < (testimonial.rating || 5) ? 'text-amber-400' : 'text-grey'}`}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>
                <blockquote className="mb-3 text-sm italic leading-relaxed text-navy">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                {testimonial.clientName && (
                  <div className="text-xs font-semibold text-grey-dark">
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
          </aside>
        </div>
      </div>
    </div>
  )
}

export default ConsultationRequestTemplate
