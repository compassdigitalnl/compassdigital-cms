'use client'

import React, { useState, useMemo } from 'react'
import { BookOpen, Search } from 'lucide-react'

import { Breadcrumbs } from '@/globals/site/breadcrumbs/components/Breadcrumbs'
import { MagazineCard } from '@/branches/ecommerce/components/magazines/MagazineCard/Component'
import { FeaturedMagazines } from '@/branches/ecommerce/components/magazines/FeaturedMagazines/Component'
import type { MagazineArchiveTemplate1Props } from './types'

export default function MagazineArchiveTemplate1({
  magazines,
  featuredMagazines = [],
  totalIssueCount,
}: MagazineArchiveTemplate1Props) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMagazines = useMemo(() => {
    if (!searchQuery.trim()) return magazines
    const q = searchQuery.toLowerCase()
    return magazines.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.tagline && m.tagline.toLowerCase().includes(q)),
    )
  }, [magazines, searchQuery])

  return (
    <div className="min-h-screen bg-theme-bg">
      {/* Breadcrumbs */}
      <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width, 1792px)' }}>
        <Breadcrumbs items={[]} currentPage="Magazines" />
      </div>

      <div className="mx-auto px-6 pb-12" style={{ maxWidth: 'var(--container-width, 1792px)' }}>
        {/* Hero */}
        <section
          className="relative mb-8 overflow-hidden rounded-[20px] bg-gradient-to-br from-theme-navy to-theme-navy-light p-10 md:p-[40px]"
          role="banner"
        >
          <div
            className="pointer-events-none absolute -right-[10%] -top-1/2 h-[400px] w-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%)' }}
          />
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center md:gap-10">
            <div className="flex-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-theme-teal/30 bg-theme-teal/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-theme-teal-light">
                <BookOpen className="h-3.5 w-3.5" />
                MAGAZINES
              </div>
              <h1
                className="mb-2.5 font-heading text-[28px] font-extrabold leading-tight text-white md:text-[36px]"
                style={{ letterSpacing: '-0.02em' }}
              >
                Alle magazines
              </h1>
              <p className="max-w-[520px] text-base leading-relaxed text-white/50">
                Ontdek onze titels. Van vakbladen tot lifestylemagazines &mdash; er is altijd iets
                dat bij je past.
              </p>
            </div>
            <div className="flex gap-6 md:gap-8">
              <div className="text-center">
                <div className="font-heading text-2xl font-extrabold text-theme-teal-light md:text-[28px]">
                  {magazines.length}
                </div>
                <div className="mt-0.5 text-xs text-white/40">Titels</div>
              </div>
              {totalIssueCount !== undefined && (
                <div className="text-center">
                  <div className="font-heading text-2xl font-extrabold text-theme-teal-light md:text-[28px]">
                    {totalIssueCount}
                  </div>
                  <div className="mt-0.5 text-xs text-white/40">Edities</div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Magazines */}
        {featuredMagazines.length > 0 && (
          <FeaturedMagazines
            magazines={featuredMagazines.map((m) => ({
              id: m.id,
              name: m.name,
              slug: m.slug,
              tagline: m.tagline,
              logo: m.logo,
              image: m.image,
              issueCount: m.issueCount,
            }))}
            className="mb-9"
          />
        )}

        {/* Search */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-theme-grey-mid" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek op magazine..."
              className="
                h-11 w-full rounded-xl border-2 bg-theme-grey-light pl-11 pr-4
                text-sm text-theme-navy outline-none
                placeholder:text-theme-grey-mid
                transition-all duration-200
                focus:border-theme-teal focus:bg-white focus:shadow-[0_0_0_4px_var(--color-primary-glow)]
              "
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>
          <span className="text-sm text-theme-grey-mid">
            {filteredMagazines.length} {filteredMagazines.length === 1 ? 'titel' : 'titels'}
          </span>
        </div>

        {/* Magazine Grid */}
        {filteredMagazines.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg font-semibold text-theme-navy">Geen magazines gevonden</p>
            <p className="mt-1 text-sm text-theme-grey-mid">
              Probeer een andere zoekterm.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMagazines.map((magazine) => (
              <MagazineCard
                key={magazine.id}
                id={magazine.id}
                name={magazine.name}
                slug={magazine.slug}
                tagline={magazine.tagline}
                logo={magazine.logo}
                image={magazine.image}
                issueCount={magazine.issueCount}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
