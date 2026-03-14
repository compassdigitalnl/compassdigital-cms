import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import type { MagazineShowcaseProps } from './types'

export async function MagazineShowcaseComponent(props: MagazineShowcaseProps) {
  const { heading, limit = 4, showSubscriptionCTA = true } = props

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'magazines',
    where: {
      visible: { equals: true },
    },
    limit: limit || 4,
    sort: 'order',
    depth: 2,
  })

  const magazines = result.docs

  if (magazines.length === 0) return null

  return (
    <section className="px-4 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto">
        {heading && (
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-[var(--color-base-1000)] md:text-4xl">
              {heading}
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {magazines.map((magazine: any) => {
            const cover =
              magazine.cover && typeof magazine.cover === 'object' ? magazine.cover : null
            const coverUrl = cover?.url || null
            const logo =
              magazine.logo && typeof magazine.logo === 'object' ? magazine.logo : null
            const logoUrl = logo?.url || null

            const editions = magazine.editions || []
            const editionCount = editions.length
            const latestEdition = editions.length > 0 ? editions[editions.length - 1] : null

            const frequencyLabels: Record<string, string> = {
              weekly: 'Wekelijks',
              biweekly: 'Tweewekelijks',
              monthly: 'Maandelijks',
              bimonthly: 'Tweemaandelijks',
              quarterly: 'Per kwartaal',
              biannual: 'Halfjaarlijks',
              yearly: 'Jaarlijks',
            }

            const url = `/magazines/${magazine.slug}`

            return (
              <a
                key={magazine.id}
                href={url}
                className="group overflow-hidden rounded-2xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] shadow-sm transition-all duration-300 hover:shadow-lg hover:border-[var(--color-primary)]/30"
              >
                {/* Cover image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-base-100)]">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={magazine.name || ''}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/5">
                      {logoUrl ? (
                        <Image
                          src={logoUrl}
                          alt={magazine.name || ''}
                          width={120}
                          height={120}
                          className="object-contain opacity-60"
                        />
                      ) : (
                        <span className="text-6xl">📖</span>
                      )}
                    </div>
                  )}

                  {/* Featured badge */}
                  {magazine.featured && (
                    <div className="absolute left-3 top-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary)] px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                        Uitgelicht
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="mb-1 text-lg font-bold text-[var(--color-base-1000)] transition-colors group-hover:text-[var(--color-primary)]">
                    {magazine.name}
                  </h3>

                  {magazine.tagline && (
                    <p className="mb-3 text-sm text-[var(--color-base-600)] line-clamp-2">
                      {magazine.tagline}
                    </p>
                  )}

                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-base-500)]">
                    {editionCount > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                        </svg>
                        {editionCount} {editionCount === 1 ? 'editie' : 'edities'}
                      </span>
                    )}
                    {magazine.frequency && (
                      <span className="inline-flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        {frequencyLabels[magazine.frequency] || magazine.frequency}
                      </span>
                    )}
                  </div>

                  {/* Latest edition info */}
                  {latestEdition && (
                    <div className="mt-3 rounded-lg bg-[var(--color-base-50)] p-2.5 text-xs text-[var(--color-base-600)]">
                      <span className="font-medium text-[var(--color-base-700)]">Nieuwste:</span>{' '}
                      {latestEdition.title}
                    </div>
                  )}
                </div>
              </a>
            )
          })}
        </div>

        {/* Subscription CTA */}
        {showSubscriptionCTA && (
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#2563eb] p-8 text-center text-white md:p-12">
            <h3 className="mb-3 text-2xl font-extrabold md:text-3xl">
              Nooit meer een editie missen?
            </h3>
            <p className="mx-auto mb-6 max-w-2xl text-base text-white/80">
              Word abonnee en ontvang alle edities automatisch. Inclusief toegang tot het digitale archief en exclusieve content.
            </p>
            <a
              href="/magazines"
              className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#7c3aed] shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
            >
              Bekijk alle magazines
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
