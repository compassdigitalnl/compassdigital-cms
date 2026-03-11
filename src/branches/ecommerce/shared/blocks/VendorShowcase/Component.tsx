/**
 * B-26 VendorShowcase Component
 *
 * Vendor/brand cards in grid layout.
 * Each card shows logo, name, and product count.
 * Carousel layout scrolls horizontally on mobile.
 * Uses theme variables for all colors.
 */
import React from 'react'
import Link from 'next/link'
import { Icon } from '@/branches/shared/components/common/Icon'
import { AnimationWrapper } from '@/branches/shared/blocks/_shared/AnimationWrapper'
import type { VendorShowcaseBlock } from '@/payload-types'

interface Brand {
  id: number | string
  name: string
  slug: string
  logo?: { url?: string; alt?: string } | null
  description?: string | null
  productCount?: number
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
  let brands: Brand[] = []

  if (source === 'manual' && manualVendors) {
    brands = manualVendors.filter((v): v is Brand => typeof v === 'object' && v !== null)
  } else {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3020'
      let apiUrl = `${baseUrl}/api/brands?sort=name&limit=${limit}`

      if (source === 'featured') {
        apiUrl += '&where[featured][equals]=true'
      }

      const response = await fetch(apiUrl, {
        next: { revalidate: 300 },
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        const data = await response.json()
        brands = data.docs || []
      }
    } catch (error) {
      console.error('VendorShowcase: Error fetching brands:', error)
      brands = (manualVendors as Brand[]) || []
    }
  }

  if (!brands || brands.length === 0) return null

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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{title}</h2>
            )}
            {subtitle && (
              <p className="text-lg text-grey-mid max-w-2xl mx-auto">{subtitle}</p>
            )}
          </div>
        )}

        {/* Brand cards */}
        <div
          className={
            isCarousel
              ? 'flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-grey scrollbar-track-transparent'
              : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
          }
        >
          {brands.slice(0, limit || 6).map((brand) => {
            const logo =
              brand.logo && typeof brand.logo === 'object' ? brand.logo : null
            const productCount = brand.productCount || 0

            return (
              <Link
                key={brand.id}
                href={`/merken/${brand.slug}`}
                className={`group bg-white border-2 border-grey hover:border-primary rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  isCarousel ? 'flex-shrink-0 w-48 snap-start' : ''
                }`}
              >
                {/* Logo */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden group-hover:bg-primary-glow transition-colors">
                  {logo && logo.url ? (
                    <img
                      src={logo.url}
                      alt={logo.alt || brand.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <Icon name="Award" size={32} className="text-gray-300 group-hover:text-primary transition-colors" />
                  )}
                </div>

                {/* Brand name */}
                <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">
                  {brand.name}
                </h3>

                {/* Product count */}
                {productCount > 0 && (
                  <p className="text-sm text-grey-mid">{productCount} producten</p>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </AnimationWrapper>
  )
}

export default VendorShowcaseComponent
