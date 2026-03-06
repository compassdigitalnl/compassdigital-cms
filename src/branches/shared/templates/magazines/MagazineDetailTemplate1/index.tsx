'use client'

import React from 'react'

import { Breadcrumbs } from '@/globals/site/breadcrumbs/components/Breadcrumbs'
import { MagazineHero } from '@/branches/shared/components/magazines/MagazineHero/Component'
import { MagazineServiceLinks } from '@/branches/shared/components/magazines/MagazineServiceLinks/Component'
import { MagazineUSPCards } from '@/branches/shared/components/magazines/MagazineUSPCards/Component'
import { MagazineSubscriptionCTA } from '@/branches/shared/components/magazines/MagazineSubscriptionCTA/Component'
import { MagazineIssueGrid } from '@/branches/shared/components/magazines/MagazineIssueGrid/Component'
import { MagazineTestimonial } from '@/branches/shared/components/magazines/MagazineTestimonial/Component'
import { MagazineStory } from '@/branches/shared/components/magazines/MagazineStory/Component'
import type { MagazineDetailTemplate1Props } from './types'

export default function MagazineDetailTemplate1({
  name,
  slug,
  badge,
  title,
  description,
  richDescription,
  logoUrl,
  stats,
  uspCards,
  recentIssues,
  testimonial,
  subscriptionCTA,
  serviceLinks,
}: MagazineDetailTemplate1Props) {
  return (
    <div className="min-h-screen bg-theme-bg">
      {/* Breadcrumbs */}
      <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width, 1792px)' }}>
        <Breadcrumbs
          items={[{ label: 'Magazines', href: '/magazines' }]}
          currentPage={name}
        />
      </div>

      <div className="mx-auto px-6 pb-12" style={{ maxWidth: 'var(--container-width, 1792px)' }}>
        {/* Hero */}
        <MagazineHero
          badge={badge}
          title={title}
          description={description}
          logoUrl={logoUrl}
          stats={stats}
          className="mb-9"
        />

        {/* Direct regelen — after Hero */}
        <MagazineServiceLinks links={serviceLinks} className="mb-10" />

        {/* USP Cards */}
        {uspCards && uspCards.length > 0 && (
          <MagazineUSPCards cards={uspCards} className="mb-10" />
        )}

        {/* Subscription CTA — after USPs */}
        {subscriptionCTA && (
          <MagazineSubscriptionCTA
            title={subscriptionCTA.title}
            description={subscriptionCTA.description}
            price={subscriptionCTA.price}
            priceSuffix={subscriptionCTA.priceSuffix}
            buttonLabel={subscriptionCTA.buttonLabel}
            buttonHref={subscriptionCTA.buttonHref || `/subscription-checkout/${slug}`}
            className="mb-12"
          />
        )}

        {/* Recent Issues */}
        {recentIssues && recentIssues.length > 0 && (
          <MagazineIssueGrid
            title={`Recente edities van ${name}`}
            issues={recentIssues}
            magazineSlug={slug}
            className="mb-11"
          />
        )}

        {/* Testimonial */}
        {testimonial && (
          <MagazineTestimonial
            initials={testimonial.initials}
            quote={testimonial.quote}
            authorName={testimonial.authorName}
            authorRole={testimonial.authorRole}
            rating={testimonial.rating}
            className="mb-10"
          />
        )}

        {/* Story / Description — bottom */}
        <MagazineStory description={richDescription} className="mb-10" />
      </div>
    </div>
  )
}
