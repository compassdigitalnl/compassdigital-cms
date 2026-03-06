'use client'

import React from 'react'
import Link from 'next/link'
import {
  Settings, FileText, MapPin, CreditCard, ArrowRight,
} from 'lucide-react'

import { Breadcrumbs } from '@/globals/site/breadcrumbs/components/Breadcrumbs'
import { MagazineHero } from '@/branches/shared/components/magazines/MagazineHero/Component'
import { MagazineUSPCards } from '@/branches/shared/components/magazines/MagazineUSPCards/Component'
import { MagazineSubscriptionCTA } from '@/branches/shared/components/magazines/MagazineSubscriptionCTA/Component'
import { MagazineIssueGrid } from '@/branches/shared/components/magazines/MagazineIssueGrid/Component'
import { MagazineTestimonial } from '@/branches/shared/components/magazines/MagazineTestimonial/Component'
import { MagazineStory } from '@/branches/shared/components/magazines/MagazineStory/Component'
import type { MagazineDetailTemplate1Props } from './types'

const SERVICE_LINKS = [
  { icon: Settings, label: 'Abonnement wijzigen', href: '/account/subscriptions' },
  { icon: MapPin, label: 'Adres wijzigen', href: '/account/addresses' },
  { icon: CreditCard, label: 'Betaalgegevens', href: '/account/payment-methods' },
  { icon: FileText, label: 'Facturen bekijken', href: '/account/invoices' },
]

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
  const services = serviceLinks && serviceLinks.length > 0 ? serviceLinks : SERVICE_LINKS

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

        {/* Direct regelen */}
        <section className="mb-10">
          <h2
            className="mb-4 flex items-center gap-2 font-heading text-xl font-extrabold text-[var(--color-text-primary)]"
          >
            <Settings className="h-5 w-5 text-[var(--color-primary)]" />
            Direct regelen
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((link, i) => {
              const Icon = typeof link.icon === 'string' ? Settings : link.icon
              return (
                <Link
                  key={i}
                  href={link.href}
                  className="group flex items-center gap-3 rounded-2xl border border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)] px-5 py-4 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-md,0_8px_24px_rgba(10,22,40,0.08))]"
                >
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{ background: 'var(--color-primary-glow, rgba(0,150,136,0.08))' }}
                  >
                    <Icon className="h-5 w-5 text-[var(--color-primary)]" />
                  </div>
                  <span className="flex-1 text-sm font-bold text-[var(--color-text-primary)]">
                    {link.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-[var(--color-text-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--color-primary)]" />
                </Link>
              )
            })}
          </div>
        </section>

        {/* Story / Description — bottom */}
        <MagazineStory description={richDescription} className="mb-10" />
      </div>
    </div>
  )
}
