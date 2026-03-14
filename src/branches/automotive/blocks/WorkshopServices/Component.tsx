import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import type { WorkshopServicesProps } from './types'

export async function WorkshopServicesComponent(props: WorkshopServicesProps) {
  const {
    heading,
    limit = 6,
    showPrices = true,
  } = props

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'content-services',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { branch: { equals: 'automotive' } },
      ],
    },
    limit: limit || 6,
    sort: 'title',
  })

  const services = result.docs

  if (services.length === 0) return null

  return (
    <section className="px-4 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto">
        {heading && (
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
              Werkplaats
            </div>
            <h2 className="text-3xl font-extrabold text-[var(--color-base-1000)] md:text-4xl lg:text-5xl">
              {heading}
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service: any) => (
            <div
              key={service.id}
              className="group overflow-hidden rounded-2xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] shadow-sm transition-all duration-300 hover:shadow-lg hover:border-[var(--color-primary)]/30"
            >
              <div className="p-6">
                {/* Icon placeholder */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                  </svg>
                </div>

                <h3 className="mb-2 text-lg font-bold text-[var(--color-base-1000)]">
                  {service.title}
                </h3>

                {service.shortDescription && (
                  <p className="mb-4 text-sm text-[var(--color-base-600)] line-clamp-3">
                    {service.shortDescription}
                  </p>
                )}

                <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-[var(--color-base-500)]">
                  {service.duration && (
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      {service.duration} min
                    </span>
                  )}
                  {showPrices && service.price != null && (
                    <span className="font-semibold text-[var(--color-base-1000)]">
                      &euro; {Number(service.price).toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </div>

                {/* Vehicle type badge if available */}
                {service.vehicleType && (
                  <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-[var(--color-base-100)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-base-700)]">
                      {service.vehicleType}
                    </span>
                  </div>
                )}

                <Link
                  href={service.slug ? `/werkplaats/${service.slug}` : '#'}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-[var(--color-primary-hover,var(--color-primary))]"
                >
                  Afspraak maken
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
