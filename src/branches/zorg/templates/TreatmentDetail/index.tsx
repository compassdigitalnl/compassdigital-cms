import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Breadcrumb } from '@/globals/site/breadcrumbs/components/Breadcrumb/Component'
import { RichText } from '@/branches/shared/components/common/RichText'
import { InsuranceBadge } from '@/branches/zorg/components/InsuranceBadge'
import type { TreatmentDetailProps } from './types'

/**
 * TreatmentDetailTemplate - Detail page for a zorg treatment (/behandelingen/[slug])
 *
 * 2-column layout with main content (breadcrumb, title, description, FAQ)
 * and a sidebar (price box, duration, insurance info, related treatments).
 */
export async function TreatmentDetailTemplate({ item }: TreatmentDetailProps) {
  const payload = await getPayload({ config })

  // Fetch related treatments (same branch, different slug, limit 3)
  let relatedTreatments: any[] = []
  try {
    const relatedResult = await payload.find({
      collection: 'content-services',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { slug: { not_equals: item.slug } },
          { branch: { equals: 'zorg' } },
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
    { label: item.title },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg, #f9fafb)' }}>
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
              <h1
                className="mb-3 text-3xl font-bold md:text-4xl"
                style={{
                  color: 'var(--color-navy, #1a2b4a)',
                  fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                }}
              >
                {item.title}
              </h1>
              {item.shortDescription && (
                <p className="text-lg leading-relaxed" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                  {item.shortDescription}
                </p>
              )}

              {/* Insurance badge inline */}
              {item.insurance && (
                <div className="mt-3">
                  <InsuranceBadge status={item.insurance} />
                </div>
              )}
            </div>

            {/* Long description (rich text) */}
            {item.description && (
              <div className="mb-10">
                <RichText content={item.description} />
              </div>
            )}

            {/* FAQ */}
            {item.faq && item.faq.length > 0 && (
              <div className="mb-10">
                <h2
                  className="mb-6 text-2xl font-bold"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Veelgestelde vragen
                </h2>
                <div className="space-y-3">
                  {item.faq.map((faqItem: any, index: number) => (
                    <details
                      key={index}
                      className="group overflow-hidden rounded-xl border"
                      style={{
                        borderColor: 'var(--color-grey, #e2e8f0)',
                        backgroundColor: 'var(--color-white, #ffffff)',
                      }}
                    >
                      <summary
                        className="flex cursor-pointer items-center justify-between p-5 text-base font-semibold transition-colors hover:bg-grey-light"
                        style={{ color: 'var(--color-navy, #1a2b4a)' }}
                      >
                        {faqItem.question}
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
                      <div
                        className="px-5 pb-5 text-sm leading-relaxed"
                        style={{ color: 'var(--color-grey-dark, #475569)' }}
                      >
                        {faqItem.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section */}
            <div
              className="rounded-xl p-8 text-center"
              style={{ backgroundColor: 'var(--color-primary-glow, rgba(5,150,105,0.08))' }}
            >
              <h2
                className="mb-2 text-2xl font-bold"
                style={{
                  color: 'var(--color-navy, #1a2b4a)',
                  fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                }}
              >
                Wilt u een afspraak maken?
              </h2>
              <p className="mb-6" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                Plan direct een afspraak in bij een van onze behandelaars.
              </p>
              <a
                href={'/afspraak-maken?behandeling=' + (item.slug || '')}
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary, #059669)' }}
              >
                Afspraak maken
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
              <div
                className="rounded-xl border p-6"
                style={{
                  borderColor: 'var(--color-grey, #e2e8f0)',
                  backgroundColor: 'var(--color-white, #ffffff)',
                }}
              >
                {item.price && (
                  <div className="mb-4">
                    <div className="text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                      Tarief
                    </div>
                    <div
                      className="text-3xl font-bold"
                      style={{ color: 'var(--color-primary, #059669)' }}
                    >
                      {typeof item.price === 'number'
                        ? new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(item.price)
                        : item.price}
                    </div>
                  </div>
                )}

                {item.duration && (
                  <div
                    className="mb-4 flex items-center gap-2 text-sm"
                    style={{ color: 'var(--color-grey-dark, #475569)' }}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{item.duration} minuten</span>
                  </div>
                )}

                {item.insurance && (
                  <div className="mb-4">
                    <InsuranceBadge status={item.insurance} />
                  </div>
                )}

                {item.successRate && (
                  <div
                    className="mb-4 flex items-center gap-2 text-sm"
                    style={{ color: 'var(--color-grey-dark, #475569)' }}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{item.successRate}% succespercentage</span>
                  </div>
                )}

                <a
                  href={'/afspraak-maken?behandeling=' + (item.slug || '')}
                  className="mt-2 block w-full rounded-lg px-4 py-3 text-center text-base font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: 'var(--color-primary, #059669)' }}
                >
                  Afspraak maken
                </a>
              </div>

              {/* Related treatments */}
              {relatedTreatments.length > 0 && (
                <div
                  className="rounded-xl border p-6"
                  style={{
                    borderColor: 'var(--color-grey, #e2e8f0)',
                    backgroundColor: 'var(--color-white, #ffffff)',
                  }}
                >
                  <h3
                    className="mb-4 text-lg font-semibold"
                    style={{ color: 'var(--color-navy, #1a2b4a)' }}
                  >
                    Andere behandelingen
                  </h3>
                  <ul className="space-y-3">
                    {relatedTreatments.map((related: any) => (
                      <li key={related.id}>
                        <Link
                          href={'/behandelingen/' + related.slug}
                          className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-grey-light"
                        >
                          <div>
                            <div
                              className="text-sm font-medium"
                              style={{ color: 'var(--color-navy, #1a2b4a)' }}
                            >
                              {related.title}
                            </div>
                            {related.price && (
                              <div
                                className="text-xs"
                                style={{ color: 'var(--color-grey-mid, #94A3B8)' }}
                              >
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
