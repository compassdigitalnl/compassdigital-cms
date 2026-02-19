import React from 'react'
import Link from 'next/link'
import { Icon } from '@/components/Icon'
import type { CategoryGridBlock as CategoryGridType } from '@/payload-types'
import type { Category } from '@/payload-types'

export const CategoryGrid: React.FC<CategoryGridType> = async ({
  heading,
  intro,
  source = 'auto',
  categories: manualCategories,
  showIcon = true,
  showProductCount = true,
  layout = 'grid-3',
  limit = 10,
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
        cache: 'no-store', // Always fetch fresh data
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
        {(heading || intro) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {heading}
              </h2>
            )}
            {intro && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {intro}
              </p>
            )}
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
                className="group bg-white border-2 border-gray-200 rounded-2xl p-6 text-center hover:-translate-y-1 hover:border-teal-500 hover:shadow-lg transition-all duration-300"
              >
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
                  <p className="text-sm text-gray-500">
                    {productCount}+ producten
                  </p>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
