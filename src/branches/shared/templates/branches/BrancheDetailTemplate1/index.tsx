'use client'

import React from 'react'
import { TrendingUp } from 'lucide-react'

import { Breadcrumbs } from '@/globals/site/breadcrumbs/components/Breadcrumbs'
import { BranchHero } from '@/branches/shared/components/branches/BranchHero/Component'
import { BranchUSPCards } from '@/branches/shared/components/branches/BranchUSPCards/Component'
import { BranchCategoryGrid } from '@/branches/shared/components/branches/BranchCategoryGrid/Component'
import { BranchPackageGrid } from '@/branches/shared/components/branches/BranchPackageGrid/Component'
import { BranchTestimonial } from '@/branches/shared/components/branches/BranchTestimonial/Component'
import { BranchCTA } from '@/branches/shared/components/branches/BranchCTA/Component'
import { ProductCard } from '@/branches/ecommerce/shared/components/products/ProductCard/Component'
import type { BrancheDetailTemplate1Props } from './types'

export default function BrancheDetailTemplate1({
  name,
  slug,
  badge,
  title,
  description,
  icon,
  stats,
  uspCards,
  categories,
  packages,
  testimonial,
  popularProducts,
  ctaTitle = 'Klaar om te bestellen?',
  ctaDescription = 'Word klant en profiteer direct van exclusieve B2B-prijzen en gratis verzending vanaf \u20AC150.',
}: BrancheDetailTemplate1Props) {
  return (
    <div className="min-h-screen bg-theme-bg">
      {/* Breadcrumbs */}
      <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width, 1792px)' }}>
        <Breadcrumbs
          items={[{ label: 'Branches', href: '/branches' }]}
          currentPage={name}
        />
      </div>

      <div className="mx-auto px-6 pb-12" style={{ maxWidth: 'var(--container-width, 1792px)' }}>
        {/* Hero */}
        <BranchHero
          badge={badge}
          title={title}
          description={description}
          icon={icon}
          stats={stats}
          className="mb-9"
        />

        {/* USP Cards */}
        {uspCards && uspCards.length > 0 && (
          <BranchUSPCards cards={uspCards} className="mb-10" />
        )}

        {/* Categories */}
        {categories && categories.length > 0 && (
          <BranchCategoryGrid
            title={`Populaire categorieen voor ${name.toLowerCase()}`}
            categories={categories}
            branchSlug={slug}
            className="mb-11"
          />
        )}

        {/* Starter Packages */}
        {packages && packages.length > 0 && (
          <BranchPackageGrid
            title={`Starterspakketten voor ${name.toLowerCase()}`}
            packages={packages}
            className="mb-11"
          />
        )}

        {/* Testimonial */}
        {testimonial && (
          <BranchTestimonial
            initials={testimonial.initials}
            quote={testimonial.quote}
            authorName={testimonial.authorName}
            authorRole={testimonial.authorRole}
            rating={testimonial.rating}
            className="mb-10"
          />
        )}

        {/* Popular Products */}
        {popularProducts && popularProducts.length > 0 && (
          <section className="mb-10" aria-labelledby="branch-products-title">
            <h2
              id="branch-products-title"
              className="mb-4 flex items-center gap-2.5 font-heading text-[22px] font-extrabold text-theme-navy"
            >
              <TrendingUp className="h-[22px] w-[22px] text-theme-teal" />
              Populair bij {name.toLowerCase()}
            </h2>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {popularProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  sku={product.sku}
                  brand={product.brand}
                  image={product.image}
                  price={product.price}
                  priceLabel={product.priceLabel}
                  compareAtPrice={product.compareAtPrice}
                  stock={product.stock}
                  stockStatus={product.stockStatus}
                  badges={product.badges}
                  variant="grid"
                />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <BranchCTA
          title={ctaTitle}
          description={ctaDescription}
          className="mb-12"
        />
      </div>
    </div>
  )
}
