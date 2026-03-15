/**
 * B-26 VendorShowcase Component
 *
 * Vendor/supplier cards in grid or carousel layout.
 * Each card shows logo, name, product count, rating, and link to vendor page.
 * Uses CSS custom properties for all colors.
 */
import React from 'react'
import Link from 'next/link'
import { Star, Package, ChevronRight } from 'lucide-react'
import { AnimationWrapper } from '@/branches/shared/blocks/_shared/AnimationWrapper'
import type { VendorShowcaseBlock } from '@/payload-types'

interface Vendor {
  id: number | string
  name: string
  slug: string
  shortName?: string | null
  logo?: { url?: string; alt?: string } | null
  tagline?: string | null
  stats?: {
    productCount?: number | null
    rating?: number | null
    reviewCount?: number | null
  } | null
  isPremium?: boolean | null
  isVerified?: boolean | null
  [key: string]: any
}

export const VendorShowcaseComponent: React.FC<VendorShowcaseBlock> = async ({
  title,
  subtitle,
  source = 'all',
  vendors: manualVendors,
  limit = 6,
  layout = 'grid',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  let vendors: Vendor[] = []

  if (source === 'manual' && manualVendors) {
    vendors = (manualVendors as any[]).filter((v): v is Vendor => typeof v === 'object' && v !== null)
  } else {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3020'
      let apiUrl = `${baseUrl}/api/vendors?sort=-isFeatured,order,name&limit=${limit}&depth=1`

      if (source === 'featured') {
        apiUrl += '&where[isFeatured][equals]=true'
      }

      const response = await fetch(apiUrl, {
        next: { revalidate: 300 },
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        const data = await response.json()
        vendors = data.docs || []
      }
    } catch (error) {
      console.error('VendorShowcase: Error fetching vendors:', error)
      vendors = (manualVendors as Vendor[]) || []
    }
  }

  if (!vendors || vendors.length === 0) return null

  const isCarousel = layout === 'carousel'

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="py-12 md:py-16"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-10">
            {title && (
              <h2
                className="text-3xl md:text-4xl font-extrabold mb-2"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Vendor cards */}
        <div
          className={
            isCarousel
              ? 'flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-grey scrollbar-track-transparent'
              : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
          }
        >
          {vendors.slice(0, limit || 6).map((vendor) => {
            const logo =
              vendor.logo && typeof vendor.logo === 'object' ? vendor.logo : null
            const productCount = vendor.stats?.productCount || 0
            const rating = vendor.stats?.rating || 0

            return (
              <Link
                key={vendor.id}
                href={`/vendors/${vendor.slug}`}
                className={`group bg-white border-2 rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  isCarousel ? 'flex-shrink-0 w-48 snap-start' : ''
                }`}
                style={{ borderColor: 'var(--color-border)' }}
              >
                {/* Logo */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-xl flex items-center justify-center overflow-hidden transition-colors"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  {logo && logo.url ? (
                    <img
                      src={logo.url}
                      alt={logo.alt || vendor.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <span
                      className="text-sm font-extrabold"
                      style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
                    >
                      {vendor.shortName || vendor.name.substring(0, 6)}
                    </span>
                  )}
                </div>

                {/* Vendor name */}
                <h3 className="font-bold mb-1 transition-colors" style={{ color: 'var(--color-text-primary)' }}>
                  {vendor.name}
                </h3>

                {/* Stats */}
                <div className="flex items-center justify-center gap-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {productCount > 0 && (
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3" style={{ color: 'var(--color-primary)' }} />
                      {productCount}
                    </span>
                  )}
                  {rating > 0 && (
                    <span className="flex items-center gap-1 font-bold" style={{ color: 'var(--color-warning)' }}>
                      <Star className="w-3 h-3 fill-current" />
                      {rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* View all link */}
        <div className="text-center mt-8">
          <Link
            href="/vendors/"
            className="inline-flex items-center gap-1.5 text-sm font-bold transition-opacity hover:opacity-80"
            style={{ color: 'var(--color-primary)' }}
          >
            Bekijk alle leveranciers
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </AnimationWrapper>
  )
}

export default VendorShowcaseComponent
