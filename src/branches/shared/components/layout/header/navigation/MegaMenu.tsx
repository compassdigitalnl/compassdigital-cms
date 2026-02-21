'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ProductCategory, Product, Media } from '@/payload-types'

interface MegaMenuProps {
  category: ProductCategory
  subcategories: ProductCategory[]
  products?: Product[]
  style: 'subcategories' | 'with-products' | 'full'
  showProductCount?: boolean
  onClose: () => void
}

export function MegaMenu({
  category,
  subcategories,
  products,
  style,
  showProductCount,
  onClose,
}: MegaMenuProps) {
  const promoBanner = category.promoBanner

  // Determine grid columns based on style
  const getGridClass = () => {
    if (style === 'full' && promoBanner?.enabled) return 'grid-cols-3'
    if (style === 'with-products' && products && products.length > 0) return 'grid-cols-2'
    return 'grid-cols-1'
  }

  return (
    <div
      className="absolute left-0 right-0 top-full mt-0 bg-white border-t shadow-2xl z-50 animate-fadeIn"
      onMouseLeave={onClose}
      style={{
        animation: 'fadeIn 200ms ease-out',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className={`grid ${getGridClass()} gap-8`}>
          {/* Column 1: Subcategories */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
              Categorieën
            </h3>
            <ul className="space-y-2">
              {subcategories.length === 0 ? (
                <li className="text-sm text-gray-500">Geen subcategorieën beschikbaar</li>
              ) : (
                <>
                  {subcategories.map((subcat) => (
                    <li key={subcat.id}>
                      <Link
                        href={`/shop?category=${subcat.slug}`}
                        className="group flex items-center justify-between text-sm text-gray-700 hover:text-primary transition-colors py-1"
                        onClick={onClose}
                      >
                        <span className="group-hover:translate-x-1 transition-transform">
                          {subcat.name}
                        </span>
                        {showProductCount && (
                          <span className="text-xs text-gray-400">
                            {/* Product count will be populated from API */}
                            —
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                  {/* "View all" link */}
                  <li className="pt-3 mt-3 border-t border-gray-200">
                    <Link
                      href={`/shop?category=${category.slug}`}
                      className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                      onClick={onClose}
                    >
                      <span>Alles bekijken</span>
                      <span>→</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Column 2: Popular Products (only if with-products or full) */}
          {(style === 'with-products' || style === 'full') && products && products.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                Populaire producten
              </h3>
              <div className="space-y-4">
                {products.slice(0, 3).map((product) => {
                  const imageUrl =
                    product.images && product.images.length > 0
                      ? typeof product.images[0]?.image === 'object'
                        ? (product.images[0].image as Media)?.url || ''
                        : ''
                      : ''

                  return (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      className="group flex gap-3 hover:bg-gray-50 rounded-lg p-2 transition-all"
                      onClick={onClose}
                    >
                      {/* Product image */}
                      {imageUrl ? (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                          <Image
                            src={imageUrl}
                            alt={product.title || ''}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">📦</span>
                        </div>
                      )}

                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                          {product.title}
                        </h4>
                        {product.price && (
                          <p className="text-sm font-bold text-gray-900 mt-1">
                            €{product.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Column 3: Promo Banner (only if full style) */}
          {style === 'full' && promoBanner?.enabled && (
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 flex flex-col justify-between">
              {promoBanner.image && typeof promoBanner.image === 'object' && (
                <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={(promoBanner.image as Media).url || ''}
                    alt={promoBanner.title || ''}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              {promoBanner.title && (
                <h3 className="text-lg font-bold text-gray-900 mb-2">{promoBanner.title}</h3>
              )}
              {promoBanner.subtitle && (
                <p className="text-sm text-gray-600 mb-4">{promoBanner.subtitle}</p>
              )}
              {promoBanner.buttonText && promoBanner.buttonLink && (
                <Link
                  href={promoBanner.buttonLink}
                  className="inline-block px-4 py-2 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors text-center"
                  onClick={onClose}
                >
                  {promoBanner.buttonText}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
