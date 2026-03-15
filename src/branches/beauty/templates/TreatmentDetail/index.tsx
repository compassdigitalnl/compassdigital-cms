import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Breadcrumb } from '@/globals/site/breadcrumbs/components/Breadcrumb/Component'
import { RichText } from '@/branches/shared/components/common/RichText'
import type { TreatmentDetailProps } from './types'

/**
 * TreatmentDetailTemplate - Detail page for a beauty treatment (/behandelingen/[slug])
 *
 * 2-column layout with main content (breadcrumb, icon, title, description, FAQ)
 * and a sidebar (price box, duration, related treatments).
 */
export async function TreatmentDetailTemplate({ treatment }: TreatmentDetailProps) {
  const payload = await getPayload({ config })

  // Fetch related treatments (same branch, different slug, limit 3)
  let relatedTreatments: any[] = []
  try {
    const relatedResult = await payload.find({
      collection: 'content-services',
      where: {
        and: [
          { status: { equals: 'published' } },
          { slug: { not_equals: treatment.slug } },
          { branch: { equals: 'beauty' } },
        ],
      },
      limit: 3,
      sort: 'title',
    })
    relatedTreatments = relatedResult.docs
  } catch (e) {
    // fail silently
  }

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Behandelingen', href: '/behandelingen' },
    { label: treatment.title },
  ]

  return (
    <div className="min-h-screen bg-grey-light">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Two-column layout */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content (col-span-2) */}
          <div className="lg:col-span-2">
            {/* Hero area */}
            <div className="mb-8">
              {treatment.icon && (
                <span className="mb-3 inline-block text-4xl">{treatment.icon}</span>
              )}
              <h1 className="mb-3 font-display text-3xl font-bold text-navy md:text-4xl">
                {treatment.title}
              </h1>
              {treatment.shortDescription && (
                <p className="text-lg leading-relaxed text-grey-dark">
                  {treatment.shortDescription}
                </p>
              )}
            </div>

            {/* Long description (rich text) */}
            {treatment.longDescription && (
              <div className="mb-10">
                <RichText content={treatment.longDescription} />
              </div>
            )}

            {/* FAQ */}
            {treatment.faq && treatment.faq.length > 0 && (
              <div className="mb-10">
                <h2 className="mb-6 font-display text-2xl font-bold text-navy">
                  Veelgestelde vragen
                </h2>
                <div className="space-y-3">
                  {treatment.faq.map((item: any, index: number) => (
                    <details
                      key={index}
                      className="group overflow-hidden rounded-xl border border-gray-200 bg-white"
                    >
                      <summary className="flex cursor-pointer items-center justify-between p-5 text-base font-semibold text-navy transition-colors hover:bg-gray-50">
                        {item.question}
                        <svg
                          className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-5 pb-5 text-sm leading-relaxed text-grey-dark">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section */}
            <div className="rounded-xl bg-teal-50 p-8 text-center">
              <h2 className="mb-2 font-display text-2xl font-bold text-navy">
                Wil je deze behandeling boeken?
              </h2>
              <p className="mb-6 text-grey-dark">
                Plan direct een afspraak in en geniet van professionele verzorging.
              </p>
              <a
                href={'/boeken?service=' + (treatment.slug || '')}
                className="btn btn-primary"
              >
                Boek nu
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

          {/* Sidebar (col-span-1) */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Price box */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                {treatment.price && (
                  <div className="mb-4">
                    <div className="text-sm text-grey-mid">
                      Vanaf
                    </div>
                    <div className="text-3xl font-bold text-teal">
                      {typeof treatment.price === 'number'
                        ? new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(treatment.price)
                        : treatment.price}
                    </div>
                  </div>
                )}

                {treatment.duration && (
                  <div className="mb-4 flex items-center gap-2 text-sm text-grey-dark">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{treatment.duration} minuten</span>
                  </div>
                )}

                <a
                  href={'/boeken?service=' + (treatment.slug || '')}
                  className="btn btn-primary mt-2 block w-full text-center"
                >
                  Boek nu
                </a>
              </div>

              {/* Related treatments */}
              {relatedTreatments.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="mb-4 text-lg font-semibold text-navy">
                    Andere behandelingen
                  </h3>
                  <ul className="space-y-3">
                    {relatedTreatments.map((related: any) => (
                      <li key={related.id}>
                        <Link
                          href={'/behandelingen/' + related.slug}
                          className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                        >
                          {related.icon && (
                            <span className="text-lg">{related.icon}</span>
                          )}
                          <div>
                            <div className="text-sm font-medium text-navy">
                              {related.title}
                            </div>
                            {related.price && (
                              <div className="text-xs text-grey-mid">
                                {typeof related.price === 'number'
                                  ? new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(related.price)
                                  : related.price}
                              </div>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TreatmentDetailTemplate
