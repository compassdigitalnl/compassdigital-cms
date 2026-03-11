import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Breadcrumb } from '@/globals/site/breadcrumbs/components/Breadcrumb/Component'
import { RichText } from '@/branches/shared/components/common/RichText'
import type { ServiceDetailProps } from './types'

/**
 * ServiceDetailTemplate - Detail page for a professional service (/dienstverlening/[slug])
 *
 * 2-column layout with main content (breadcrumb, hero, description, process steps,
 * service types, USPs, FAQ, CTA) and a sidebar (consultation form, phone, related services).
 */
export async function ServiceDetailTemplate({ service }: ServiceDetailProps) {
  const payload = await getPayload({ config })

  // Fetch related services (same collection, different slug, limit 3)
  let relatedServices: any[] = []
  try {
    const relatedResult = await payload.find({
      collection: 'professional-services',
      where: {
        and: [
          { status: { equals: 'published' } },
          { slug: { not_equals: service.slug } },
        ],
      },
      limit: 3,
      sort: 'title',
    })
    relatedServices = relatedResult.docs
  } catch (e) {
    // fail silently
  }

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Dienstverlening', href: '/dienstverlening' },
    { label: service.title },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg, #f9fafb)' }}>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Two-column layout */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content (col-span-2) */}
          <div className="lg:col-span-2">
            {/* Hero area */}
            <div className="mb-8">
              {service.icon && (
                <span className="mb-3 inline-block text-4xl">{service.icon}</span>
              )}
              <h1
                className="text-3xl md:text-4xl font-bold mb-3"
                style={{
                  color: 'var(--color-navy, #1a2b4a)',
                  fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                }}
              >
                {service.title}
              </h1>
              {service.shortDescription && (
                <p className="text-lg leading-relaxed" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                  {service.shortDescription}
                </p>
              )}
            </div>

            {/* Long description (rich text) */}
            {service.longDescription && (
              <div className="mb-10">
                <RichText content={service.longDescription} />
              </div>
            )}

            {/* Process Steps */}
            {service.processSteps && service.processSteps.length > 0 && (
              <div className="mb-10">
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Ons proces
                </h2>
                <ol className="space-y-6">
                  {service.processSteps.map((step: any, index: number) => (
                    <li key={index} className="flex gap-4">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{ backgroundColor: 'var(--color-primary, #00897B)' }}
                      >
                        {step.icon || index + 1}
                      </div>
                      <div>
                        <h3
                          className="text-lg font-semibold mb-1"
                          style={{ color: 'var(--color-navy, #1a2b4a)' }}
                        >
                          {step.title}
                        </h3>
                        <p style={{ color: 'var(--color-grey-dark, #475569)' }}>
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Service Types Grid */}
            {service.serviceTypes && service.serviceTypes.length > 0 && (
              <div className="mb-10">
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Onze specialisaties
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.serviceTypes.map((type: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-xl border p-5 transition-shadow hover:shadow-md"
                      style={{
                        borderColor: 'var(--color-grey, #e2e8f0)',
                        backgroundColor: 'var(--color-white, #ffffff)',
                      }}
                    >
                      {type.icon && (
                        <span className="mb-2 inline-block text-2xl">{type.icon}</span>
                      )}
                      <h3
                        className="text-base font-semibold mb-1"
                        style={{ color: 'var(--color-navy, #1a2b4a)' }}
                      >
                        {type.name}
                      </h3>
                      {type.description && (
                        <p className="text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                          {type.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* USPs */}
            {service.usps && service.usps.length > 0 && (
              <div className="mb-10">
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Waarom kiezen voor ons
                </h2>
                <div className="space-y-4">
                  {service.usps.map((usp: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm"
                        style={{
                          backgroundColor: 'var(--color-primary-glow, rgba(0,137,123,0.1))',
                          color: 'var(--color-primary, #00897B)',
                        }}
                      >
                        {usp.icon || '\u2713'}
                      </div>
                      <div>
                        <h3
                          className="text-base font-semibold mb-0.5"
                          style={{ color: 'var(--color-navy, #1a2b4a)' }}
                        >
                          {usp.title}
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                          {usp.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ */}
            {service.faq && service.faq.length > 0 && (
              <div className="mb-10">
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Veelgestelde vragen
                </h2>
                <div className="space-y-3">
                  {service.faq.map((item: any, index: number) => (
                    <details
                      key={index}
                      className="group rounded-xl border overflow-hidden"
                      style={{
                        borderColor: 'var(--color-grey, #e2e8f0)',
                        backgroundColor: 'var(--color-white, #ffffff)',
                      }}
                    >
                      <summary
                        className="flex cursor-pointer items-center justify-between p-5 text-base font-semibold transition-colors hover:bg-gray-50"
                        style={{ color: 'var(--color-navy, #1a2b4a)' }}
                      >
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
                      <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section */}
            <div
              className="rounded-xl p-8 text-center"
              style={{ backgroundColor: 'var(--color-primary-glow, rgba(0,137,123,0.08))' }}
            >
              <h2
                className="text-2xl font-bold mb-2"
                style={{
                  color: 'var(--color-navy, #1a2b4a)',
                  fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                }}
              >
                Interesse in {service.title.toLowerCase()}?
              </h2>
              <p className="mb-6" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                Plan een vrijblijvend adviesgesprek en ontdek wat wij voor u kunnen betekenen.
              </p>
              <a
                href="/adviesgesprek-aanvragen"
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary, #00897B)' }}
              >
                Plan een adviesgesprek
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

          {/* Sidebar (col-span-1) */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Consultation CTA Card */}
              <div
                className="rounded-xl border p-6"
                style={{
                  borderColor: 'var(--color-grey, #e2e8f0)',
                  backgroundColor: 'var(--color-white, #ffffff)',
                }}
              >
                <h3
                  className="text-lg font-bold mb-3"
                  style={{ color: 'var(--color-navy, #1a2b4a)' }}
                >
                  Vrijblijvend advies
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                  Neem contact op voor een persoonlijk adviesgesprek over uw situatie.
                </p>
                <a
                  href="/adviesgesprek-aanvragen"
                  className="block w-full rounded-lg px-4 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: 'var(--color-primary, #00897B)' }}
                >
                  Plan een adviesgesprek
                </a>
              </div>

              {/* Related Services */}
              {relatedServices.length > 0 && (
                <div
                  className="rounded-xl border p-6"
                  style={{
                    borderColor: 'var(--color-grey, #e2e8f0)',
                    backgroundColor: 'var(--color-white, #ffffff)',
                  }}
                >
                  <h3
                    className="text-lg font-bold mb-4"
                    style={{ color: 'var(--color-navy, #1a2b4a)' }}
                  >
                    Overige diensten
                  </h3>
                  <div className="space-y-3">
                    {relatedServices.map((rs: any) => (
                      <a
                        key={rs.id}
                        href={`/dienstverlening/${rs.slug}`}
                        className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
                      >
                        {rs.icon && <span className="text-xl">{rs.icon}</span>}
                        <span
                          className="text-sm font-medium"
                          style={{ color: 'var(--color-navy, #1a2b4a)' }}
                        >
                          {rs.title}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceDetailTemplate
