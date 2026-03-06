'use client'

import React from 'react'

import { Breadcrumbs } from '@/globals/site/breadcrumbs/components/Breadcrumbs'
import { MagazineHero } from '@/branches/ecommerce/components/magazines/MagazineHero/Component'
import { PricingPlansGrid } from '@/branches/shared/ui/pricing/PricingPlansGrid'
import { MagazineUSPCards } from '@/branches/ecommerce/components/magazines/MagazineUSPCards/Component'
import { MagazineStory } from '@/branches/ecommerce/components/magazines/MagazineStory/Component'
import { MagazineIssueGrid } from '@/branches/ecommerce/components/magazines/MagazineIssueGrid/Component'
import { MagazineTestimonial } from '@/branches/ecommerce/components/magazines/MagazineTestimonial/Component'
import { MagazineSubscriptionCTA } from '@/branches/ecommerce/components/magazines/MagazineSubscriptionCTA/Component'
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
  plans,
  trustItems,
  subscriptionCTA,
}: MagazineDetailTemplate1Props) {
  const hasPlans = plans && plans.length > 0

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

        {/* Subscription Plans — PROMINENT, right after hero */}
        {hasPlans && (
          <div className="mb-12">
            <div className="mb-8 text-center">
              <h2
                className="font-heading text-[26px] font-extrabold text-[var(--color-text-primary)] md:text-[30px]"
                style={{ letterSpacing: '-0.02em' }}
              >
                Word {name} abonnee
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-base text-[var(--color-text-secondary)]">
                Kies het abonnement dat bij je past en ontvang {name} thuis.
              </p>
            </div>
            <PricingPlansGrid plans={plans} />
          </div>
        )}

        {/* USP Cards */}
        {uspCards && uspCards.length > 0 && (
          <MagazineUSPCards cards={uspCards} className="mb-10" />
        )}

        {/* Story / Description */}
        <MagazineStory description={richDescription} className="mb-10" />

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

        {/* Bottom CTA — still show for quick action even if plans above */}
        {subscriptionCTA && (
          <MagazineSubscriptionCTA
            title={subscriptionCTA.title}
            description={subscriptionCTA.description}
            price={subscriptionCTA.price}
            priceSuffix={subscriptionCTA.priceSuffix}
            buttonLabel={subscriptionCTA.buttonLabel}
            buttonHref={subscriptionCTA.buttonHref || `/abonneren/${slug}`}
            className="mb-12"
          />
        )}
      </div>
    </div>
  )
}
