import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Breadcrumb } from '@/globals/site/breadcrumbs/components/Breadcrumb/Component'
import { RichText } from '@/branches/shared/components/common/RichText'
import { AllergenBadge } from '@/branches/horeca/components/AllergenBadge'
import type { MenuItemDetailProps } from './types'

/**
 * MenuItemDetailTemplate - Detail page for a menu item (/menukaart/[slug])
 *
 * 2-column layout with main content (breadcrumb, icon, title, description, allergens)
 * and a sidebar (price box, reservation button, related items).
 */
export async function MenuItemDetailTemplate({ item }: MenuItemDetailProps) {
  const payload = await getPayload({ config })

  // Fetch related items (same branch, different slug, limit 3)
  let relatedItems: any[] = []
  try {
    const relatedResult = await payload.find({
      collection: 'content-services',
      where: {
        and: [
          { status: { equals: 'published' } },
          { slug: { not_equals: item.slug } },
          { branch: { equals: 'horeca' } },
        ],
      },
      limit: 3,
      sort: 'title',
    })
    relatedItems = relatedResult.docs
  } catch (e) {
    // fail silently
  }

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Menukaart', href: '/menukaart' },
    { label: item.title },
  ]

  // Parse allergens from comma-separated string
  const allergens: string[] = item.allergens
    ? item.allergens.split(',').map((a: string) => a.trim()).filter(Boolean)
    : []

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
              {item.icon && (
                <span className="mb-3 inline-block text-4xl">{item.icon}</span>
              )}
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
            </div>

            {/* Category badge */}
            {(item.service?.category || item.category) && (
              <div className="mb-6">
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: 'var(--color-primary-glow, rgba(249,115,22,0.08))',
                    color: 'var(--color-primary, #f97316)',
                  }}
                >
                  {item.service?.category || item.category}
                </span>
              </div>
            )}

            {/* Allergen badges */}
            {allergens.length > 0 && (
              <div className="mb-8">
                <h3
                  className="mb-3 text-sm font-semibold uppercase tracking-wide"
                  style={{ color: 'var(--color-grey-mid, #94A3B8)' }}
                >
                  Allergenen
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allergens.map((allergen, index) => (
                    <AllergenBadge key={index} allergen={allergen} />
                  ))}
                </div>
              </div>
            )}

            {/* Long description (rich text) */}
            {item.longDescription && (
              <div className="mb-10">
                <RichText content={item.longDescription} />
              </div>
            )}

            {/* CTA Section */}
            <div
              className="rounded-xl p-8 text-center"
              style={{ backgroundColor: 'var(--color-primary-glow, rgba(249,115,22,0.08))' }}
            >
              <h2
                className="mb-2 text-2xl font-bold"
                style={{
                  color: 'var(--color-navy, #1a2b4a)',
                  fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                }}
              >
                Wilt u dit gerecht proeven?
              </h2>
              <p className="mb-6" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                Reserveer een tafel en geniet van onze culinaire creaties.
              </p>
              <a
                href="/reserveren"
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary, #f97316)' }}
              >
                Reserveer een tafel
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
                      Prijs
                    </div>
                    <div
                      className="text-3xl font-bold"
                      style={{ color: 'var(--color-primary, #f97316)' }}
                    >
                      {typeof item.price === 'number'
                        ? new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(item.price)
                        : item.price}
                    </div>
                  </div>
                )}

                <a
                  href="/reserveren"
                  className="mt-2 block w-full rounded-lg px-4 py-3 text-center text-base font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: 'var(--color-primary, #f97316)' }}
                >
                  Reserveer een tafel
                </a>
              </div>

              {/* Related items */}
              {relatedItems.length > 0 && (
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
                    Andere gerechten
                  </h3>
                  <ul className="space-y-3">
                    {relatedItems.map((related: any) => (
                      <li key={related.id}>
                        <Link
                          href={'/menukaart/' + related.slug}
                          className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                        >
                          {related.icon && (
                            <span className="text-lg">{related.icon}</span>
                          )}
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

export default MenuItemDetailTemplate
