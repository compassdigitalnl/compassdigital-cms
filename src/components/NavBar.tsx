'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ProductCategory, Product } from '@/payload-types'
import { MegaMenu } from './MegaMenu'

interface NavBarProps {
  categories: ProductCategory[]
  specialItems: any[]
  manualItems: any[]
  ctaButton: any
  categorySettings: {
    showIcons?: boolean
    megaMenuStyle?: 'subcategories' | 'with-products' | 'full'
    showProductCount?: boolean
    maxProductsInMegaMenu?: number
  }
  mode: 'manual' | 'categories' | 'hybrid'
}

export function NavBar({
  categories,
  specialItems,
  manualItems,
  ctaButton,
  categorySettings,
  mode,
}: NavBarProps) {
  const [hoveredCategory, setHoveredCategory] = useState<ProductCategory | null>(null)
  const [megaMenuData, setMegaMenuData] = useState<{
    subcategories: ProductCategory[]
    products?: Product[]
  } | null>(null)
  const [isLoadingMegaMenu, setIsLoadingMegaMenu] = useState(false)

  // Handle category hover - fetch subcategories and products
  const handleCategoryHover = async (category: ProductCategory) => {
    setHoveredCategory(category)
    setIsLoadingMegaMenu(true)

    try {
      // Fetch subcategories
      const subcatParams = new URLSearchParams({
        'where[parent][equals]': category.id,
        'where[visible][equals]': 'true',
        sort: 'order',
        limit: '20',
        depth: '0',
      })

      const subcatResponse = await fetch(`/api/product-categories?${subcatParams.toString()}`)
      const subcatData = await subcatResponse.json()
      const subcategories = subcatData.docs || []

      // Fetch products if needed (for with-products or full style)
      let products: Product[] = []
      if (
        categorySettings.megaMenuStyle === 'with-products' ||
        categorySettings.megaMenuStyle === 'full'
      ) {
        const maxProducts = categorySettings.maxProductsInMegaMenu || 3
        const productParams = new URLSearchParams({
          'where[categories][in]': category.id,
          'where[status][equals]': 'published',
          'where[featured][equals]': 'true',
          sort: '-createdAt',
          limit: maxProducts.toString(),
          depth: '2', // Populate images
        })

        const productResponse = await fetch(`/api/products?${productParams.toString()}`)
        const productData = await productResponse.json()
        products = productData.docs || []
      }

      setMegaMenuData({ subcategories, products })
    } catch (error) {
      console.error('Error fetching mega menu data:', error)
      setMegaMenuData({ subcategories: [] })
    } finally {
      setIsLoadingMegaMenu(false)
    }
  }

  const handleCloseMegaMenu = () => {
    setHoveredCategory(null)
    setMegaMenuData(null)
  }

  // Render category nav item
  const renderCategoryItem = (category: ProductCategory) => {
    const href = `/shop?category=${category.slug}`
    const isHovered = hoveredCategory?.id === category.id

    return (
      <div
        key={category.id}
        className="relative"
        onMouseEnter={() => handleCategoryHover(category)}
        onMouseLeave={handleCloseMegaMenu}
      >
        <Link
          href={href}
          className="px-4 py-3.5 text-sm font-medium text-gray-900 hover:text-primary hover:bg-primary/5 cursor-pointer transition-all relative whitespace-nowrap flex items-center gap-2"
        >
          {categorySettings.showIcons && category.icon && (
            <span className="text-base">{category.icon}</span>
          )}
          <span>{category.name}</span>
          {/* Show loading indicator while fetching */}
          {isHovered && isLoadingMegaMenu && (
            <span className="text-xs text-gray-400 animate-pulse">...</span>
          )}
        </Link>

        {/* Mega menu */}
        {isHovered && megaMenuData && !isLoadingMegaMenu && (
          <MegaMenu
            category={category}
            subcategories={megaMenuData.subcategories}
            products={megaMenuData.products}
            style={categorySettings.megaMenuStyle || 'subcategories'}
            showProductCount={categorySettings.showProductCount}
            onClose={handleCloseMegaMenu}
          />
        )}
      </div>
    )
  }

  // Render special item (Aanbiedingen, etc.)
  const renderSpecialItem = (item: any) => {
    const highlightClass = item.highlight
      ? 'text-coral-600 hover:bg-coral-50 font-bold'
      : 'text-gray-900 hover:text-primary hover:bg-primary/5'

    return (
      <Link
        key={item.url}
        href={item.url}
        className={`px-4 py-3.5 text-sm font-medium cursor-pointer transition-all relative whitespace-nowrap flex items-center gap-2 ${highlightClass}`}
      >
        {item.icon && <span className="text-base">{item.icon}</span>}
        <span>{item.label}</span>
      </Link>
    )
  }

  // Render manual item (for manual/hybrid mode)
  const renderManualItem = (item: any, index: number) => {
    let href = '#'
    if (item.type === 'page' && item.page) {
      const page = item.page as any
      href = `/${page.slug === 'home' ? '' : page.slug}`
    } else if (item.type === 'external' && item.url) {
      href = item.url
    }

    return (
      <div key={index} className="relative group">
        <Link
          href={href}
          className="px-4 py-3.5 text-sm font-medium text-gray-900 hover:text-primary hover:bg-primary/5 cursor-pointer transition-all relative whitespace-nowrap flex items-center gap-2"
        >
          {item.icon && <span className="text-base">{item.icon}</span>}
          <span>{item.label}</span>
          {item.children && item.children.length > 0 && <span className="text-xs">▼</span>}
        </Link>

        {/* Submenu (if exists) */}
        {item.children && item.children.length > 0 && (
          <div className="absolute left-0 top-full mt-0 bg-white border shadow-lg rounded-lg py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            {item.children.filter(Boolean).map((child: any, childIndex: number) => {
              if (!child) return null

              const childPage = child.page as any
              const childHref = childPage
                ? `/${childPage.slug === 'home' ? '' : childPage.slug}`
                : '#'

              return (
                <Link
                  key={childIndex}
                  href={childHref}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  {child.label}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // Separate special items by position
  const specialItemsStart = specialItems?.filter((item) => item.position === 'start') || []
  const specialItemsEnd = specialItems?.filter((item) => item.position === 'end') || []

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 flex gap-0 justify-center items-center">
        {/* Special items at start */}
        {specialItemsStart.map(renderSpecialItem)}

        {/* Category items (for categories/hybrid mode) */}
        {(mode === 'categories' || mode === 'hybrid') && categories.map(renderCategoryItem)}

        {/* Manual items (for manual/hybrid mode) */}
        {(mode === 'manual' || mode === 'hybrid') &&
          manualItems?.map((item, index) => renderManualItem(item, index))}

        {/* Special items at end */}
        {specialItemsEnd.map(renderSpecialItem)}

        {/* CTA Button (optional) */}
        {ctaButton?.show && ctaButton.text && (
          <Link
            href={ctaButton.link || '#'}
            className="ml-4 px-6 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            {ctaButton.text}
          </Link>
        )}
      </div>
    </nav>
  )
}
