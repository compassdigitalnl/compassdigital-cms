/**
 * B-15 CategoryGrid Component
 *
 * Server component that fetches and displays product categories
 * in a grid layout with images, names, and product counts.
 * Uses theme variables for all colors.
 */
import React from 'react'
import Link from 'next/link'
import { Icon } from '@/branches/shared/components/common/Icon'
import { AnimationWrapper } from '@/branches/shared/blocks/_shared/AnimationWrapper'
import type { CategoryGridBlock as CategoryGridType } from '@/payload-types'
import type { ProductCategory } from '@/payload-types'

const gridClasses: Record<string, string> = {
  'grid-3': 'grid grid-cols-2 md:grid-cols-3 gap-4',
  'grid-4': 'grid grid-cols-2 md:grid-cols-4 gap-4',
  masonry: 'columns-2 md:columns-3 gap-4 space-y-4',
}

export const CategoryGridComponent: React.FC<CategoryGridType> = async ({
  title,
  source = 'all',
  categories: manualCategories,
  limit = 6,
  layout = 'grid-3',
  showCount = true,
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  let categories: ProductCategory[] = []

  if (source === 'manual' && manualCategories) {
    categories = manualCategories as ProductCategory[]
  } else {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3020'
      let apiUrl = `${baseUrl}/api/product-categories?sort=name&limit=${limit}`

      if (source === 'featured') {
        apiUrl += '&where[featured][equals]=true'
      }

      const response = await fetch(apiUrl, {
        next: { revalidate: 300 },
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        const data = await response.json()
        categories = data.docs || []
      }
    } catch (error) {
      console.error('CategoryGrid: Error fetching categories:', error)
      categories = (manualCategories as ProductCategory[]) || []
    }
  }

  if (!categories || categories.length === 0) return null

  const isMasonry = layout === 'masonry'
  const gridClass = gridClasses[layout || 'grid-3'] || gridClasses['grid-3']

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="py-12 md:py-16 bg-gray-50"
    >
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
            {title}
          </h2>
        )}

        <div className={gridClass}>
          {categories.slice(0, limit || 6).map((category) => {
            if (typeof category !== 'object') return null

            const catTitle = (category as any).title || category.name || ''
            const slug = category.slug
            const icon = category.icon
            const image = category.image
            const productCount = (category as any).productCount || 0

            return (
              <Link
                key={category.id}
                href={`/categorie/${slug}`}
                className={`group bg-white border-2 border-grey hover:border-primary rounded-2xl p-6 text-center hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 relative overflow-hidden ${isMasonry ? 'break-inside-avoid' : ''}`}
              >
                {/* Top border accent on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                {icon && (
                  <div className="w-14 h-14 mx-auto bg-gray-100 group-hover:bg-primary-glow rounded-xl flex items-center justify-center mb-4 transition-colors">
                    <Icon name={icon} size={28} className="text-primary" />
                  </div>
                )}
                {!icon && image && typeof image === 'object' && image.url && (
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl overflow-hidden">
                    <img
                      src={image.url}
                      alt={catTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                  {catTitle}
                </h3>
                {showCount && productCount > 0 && (
                  <p className="text-sm text-gray-500">{productCount}+ producten</p>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </AnimationWrapper>
  )
}

export default CategoryGridComponent
