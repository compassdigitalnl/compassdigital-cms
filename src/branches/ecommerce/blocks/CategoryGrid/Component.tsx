import React from 'react'
import Link from 'next/link'
import { Icon } from '@/branches/shared/components/common/Icon'
import { SectionLabel } from '@/branches/shared/components/admin/SectionLabel'
import type { CategoryGridBlock as CategoryGridType } from '@/payload-types'
import type { Category } from '@/payload-types'

export const CategoryGrid: React.FC<CategoryGridType> = async ({
  sectionLabel,
  heading,
  intro,
  source = 'auto',
  categories: manualCategories,
  showIcon = true,
  showProductCount = true,
  layout = 'grid-3',
  limit = 10,
  showQuickOrderCard = false,
  quickOrderLink = '/quick-order',
}) => {
  // Fetch categories based on source
  let categories: Category[] = []

  if (source === 'manual' && manualCategories) {
    categories = manualCategories as Category[]
  } else if (source === 'auto') {
    // Fetch categories from API
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3020'

      // Fetch all categories sorted by name
      let apiUrl = `${baseUrl}/api/product-categories?sort=name&limit=${limit}`

      const response = await fetch(apiUrl, {
        next: { revalidate: 300 }, // Cache categorieën 5 minuten (veranderen zelden)
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        categories = data.docs || []
      } else {
        console.error(`Failed to fetch categories: ${response.status} ${response.statusText}`)
        categories = (manualCategories as Category[]) || []
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      // Fallback to manual categories on error
      categories = (manualCategories as Category[]) || []
    }
  }

  if (!categories || categories.length === 0) return null

  const gridClass = {
    'grid-2': 'grid grid-cols-1 md:grid-cols-2 gap-4',
    'grid-3': 'grid grid-cols-2 md:grid-cols-3 gap-4',
    'grid-4': 'grid grid-cols-2 md:grid-cols-4 gap-4',
    'grid-5': 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4',
    'grid-6': 'grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3',
  }[layout]

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {(sectionLabel || heading || intro) && (
          <div className="text-center mb-12">
            {sectionLabel && <SectionLabel label={sectionLabel} />}
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{heading}</h2>
            )}
            {intro && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{intro}</p>}
          </div>
        )}

        <div className={gridClass}>
          {categories.slice(0, limit).map((category) => {
            const slug = typeof category === 'object' ? category.slug : null
            const title = typeof category === 'object' ? category.title : ''
            const icon = typeof category === 'object' ? category.icon : null
            const image = typeof category === 'object' ? category.image : null
            const productCount = typeof category === 'object' ? category.productCount : 0

            return (
              <Link
                key={typeof category === 'object' ? category.id : category}
                href={`/categorie/${slug}`}
                className="group bg-white border-2 border-gray-200 rounded-2xl p-6 text-center hover:-translate-y-1.5 hover:border-teal-500 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                {/* Top border accent on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                {showIcon && icon && (
                  <div className="w-14 h-14 mx-auto bg-gray-100 group-hover:bg-teal-100 rounded-xl flex items-center justify-center mb-4 transition-colors">
                    <Icon name={icon} size={28} className="text-teal-600" />
                  </div>
                )}
                {showIcon && image && typeof image === 'object' && image.url && (
                  <div className="w-14 h-14 mx-auto mb-4">
                    <img src={image.url} alt={title} className="w-full h-full object-contain" />
                  </div>
                )}
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">
                  {title}
                </h3>
                {showProductCount && productCount > 0 && (
                  <p className="text-sm text-gray-500">{productCount}+ producten</p>
                )}
              </Link>
            )
          })}

          {/* Quick Order Card */}
          {showQuickOrderCard && (
            <Link
              href={quickOrderLink}
              className="group bg-gradient-to-br from-teal-500 to-teal-600 border-2 border-teal-600 rounded-2xl p-6 text-center hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              {/* Decorative glow */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="w-14 h-14 mx-auto bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                  <Icon name="Zap" size={28} className="text-white" />
                </div>
                <h3 className="font-bold text-white mb-1 text-lg">Quick Order</h3>
                <p className="text-sm text-white/80">Bestel snel met SKU of EAN</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
