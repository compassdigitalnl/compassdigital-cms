'use client'

import React from 'react'
import type { Brand, Media, Product } from '@/payload-types'
import { TrendingUp } from 'lucide-react'

// Layout
import { Breadcrumbs } from '@/branches/shared/components/layout/breadcrumbs/Breadcrumbs'
import type { BreadcrumbItem } from '@/branches/shared/components/layout/breadcrumbs/Breadcrumbs'

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

interface PopularProduct {
  id: string
  name: string
  slug: string
  sku: string
  brand: { name: string; slug: string }
  image?: { url: string; alt: string }
  price: number | null
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
  popularProducts: PopularProduct[]
  descriptionPlainText?: string | null
  breadcrumbs?: BreadcrumbItem[]
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
  popularProducts,
  descriptionPlainText,
  breadcrumbs,
}: BrandDetailTemplate1Props) {
  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Merken', href: '/merken' },
    { label: brand.name, href: `/merken/${brand.slug}` },
  ]

  const certifications = brand.certifications || []

  return (
    <div className="bg-theme-bg min-h-screen">
      {/* Breadcrumbs */}
      <div className="mx-auto max-w-[1240px] px-6">
        <Breadcrumbs items={breadcrumbs || defaultBreadcrumbs} />
      </div>

      <div className="mx-auto max-w-[1240px] px-6 pb-12">
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
