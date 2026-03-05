'use client'

import React from 'react'
import Link from 'next/link'
import type { Brand, Media, Product } from '@/payload-types'
import { TrendingUp, Layers } from 'lucide-react'

// Layout
import { Breadcrumbs } from '@/globals/site/breadcrumbs/components/Breadcrumbs'
import type { BreadcrumbItem } from '@/globals/site/breadcrumbs/components/Breadcrumbs'

// Brand components
import { BrandHero } from '@/branches/ecommerce/components/brands/BrandHero/Component'
import { BrandStory } from '@/branches/ecommerce/components/brands/BrandStory/Component'
import { BrandCategories } from '@/branches/ecommerce/components/brands/BrandCategories/Component'
import { BrandCertifications } from '@/branches/ecommerce/components/brands/BrandCertifications/Component'
import { BrandCTA } from '@/branches/ecommerce/components/brands/BrandCTA/Component'

// Product components
import { ProductCard } from '@/branches/ecommerce/components/products/ProductCard/Component'

// Types
import type { BrandCategory } from '@/branches/ecommerce/components/brands/BrandCategories/types'
import type { Certification } from '@/branches/ecommerce/components/brands/BrandCertifications/types'

// ============================================
// TYPES
// ============================================

interface ProductLine {
  id: number
  name: string
  slug: string
  logo?: any
  productCount: number
}

interface PopularProduct {
  id: string
  name: string
  slug: string
  sku: string
  brand: { name: string; slug: string }
  image?: { url: string; alt: string }
  price: number | null
  priceLabel?: string
  compareAtPrice?: number
  stock: number
  stockStatus: 'in-stock' | 'low' | 'out' | 'on-backorder'
  badges?: Array<{ type: 'sale' | 'new' | 'pro' | 'popular'; label?: string }>
}

interface BrandDetailTemplate1Props {
  brand: Brand & {
    tagline?: string | null
    certifications?: Certification[]
  }
  productCount: number
  categoryCount?: number
  inStockPercent?: number
  categories: BrandCategory[]
  productLines: ProductLine[]
  popularProducts: PopularProduct[]
  descriptionPlainText?: string | null
}

// ============================================
// COMPONENT
// ============================================

export default function BrandDetailTemplate1({
  brand,
  productCount,
  categoryCount,
  inStockPercent,
  categories,
  productLines,
  popularProducts,
  descriptionPlainText,
}: BrandDetailTemplate1Props) {
  const certifications = brand.certifications || []

  return (
    <div className="bg-theme-bg min-h-screen">
      {/* Breadcrumbs */}
      <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width, 1792px)' }}>
        <Breadcrumbs
          items={[{ label: 'Merken', href: '/merken' }]}
          currentPage={brand.name}
        />
      </div>

      <div className="mx-auto px-6 pb-12" style={{ maxWidth: 'var(--container-width, 1792px)' }}>
        {/* Brand Hero */}
        <BrandHero
          name={brand.name}
          tagline={brand.tagline}
          description={descriptionPlainText}
          logo={brand.logo}
          productCount={productCount}
          categoryCount={categoryCount}
          inStockPercent={inStockPercent}
          className="mb-8"
        />

        {/* Brand Story */}
        <BrandStory description={brand.description} className="mb-10" />

        {/* Product Lines (sub-brands) */}
        {productLines.length > 0 && (
          <section className="mb-10" aria-labelledby="brand-productlines-title">
            <h2
              id="brand-productlines-title"
              className="mb-3.5 flex items-center gap-2 font-heading text-xl font-extrabold text-theme-navy"
            >
              <Layers className="h-5 w-5 text-theme-teal" />
              Productlijnen
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {productLines.map((line) => (
                <Link
                  key={line.id}
                  href={`/merken/${line.slug}`}
                  className="group flex flex-col items-center gap-3 rounded-[14px] border-[1.5px] border-[var(--grey,#E8ECF1)] bg-white px-4 py-5 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-[3px] hover:border-theme-teal hover:shadow-[0_8px_28px_rgba(0,0,0,0.05)]"
                >
                  <span className="text-center text-[13px] font-bold text-theme-navy">
                    {line.name}
                  </span>
                  <span className="text-[11px] text-theme-grey-mid">
                    {line.productCount} producten
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <BrandCategories
            categories={categories}
            brandSlug={brand.slug}
            className="mb-10"
          />
        )}

        {/* Popular Products */}
        {popularProducts.length > 0 && (
          <section className="mb-10" aria-labelledby="brand-products-title">
            <h2
              id="brand-products-title"
              className="mb-3.5 flex items-center gap-2 font-heading text-xl font-extrabold text-theme-navy"
            >
              <TrendingUp className="h-5 w-5 text-theme-teal" />
              Populaire producten
            </h2>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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

        {/* Certifications */}
        {certifications.length > 0 && (
          <BrandCertifications certifications={certifications} className="mb-10" />
        )}

        {/* CTA */}
        <BrandCTA
          brandName={brand.name}
          brandSlug={brand.slug}
          productCount={productCount}
          className="mb-12"
        />
      </div>
    </div>
  )
}
