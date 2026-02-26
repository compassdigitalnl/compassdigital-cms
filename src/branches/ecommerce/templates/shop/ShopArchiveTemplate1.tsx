'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Filter, Zap } from 'lucide-react'
import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import type { Product } from '@/payload-types'

// Modern Components
import { CategoryHero } from '@/branches/ecommerce/components/shop/CategoryHero/CategoryHero'
import { Breadcrumb, type BreadcrumbItem } from '@/branches/shared/components/layout/breadcrumbs/Breadcrumb/Breadcrumb'
import { SubcategoryChips, type SubcategoryChip } from '@/branches/ecommerce/components/shop/SubcategoryChips/Component'
import { FilterSidebar } from '@/branches/ecommerce/components/shop/FilterSidebar/FilterSidebar'
import { ShopToolbar } from '@/branches/ecommerce/components/shop/SortDropdown/ShopToolbar'
import { ProductCard } from '@/branches/ecommerce/components/products/ProductCard/Component'
import { QuickAddToCart } from '@/branches/ecommerce/components/products/QuickAddToCart/Component'
import { Pagination } from '@/branches/shared/components/ui/Pagination/Component'
import { BulkActionBar } from '@/branches/ecommerce/components/shop/BulkActionBar/Component'
import { SearchQueryHeader } from '@/branches/ecommerce/components/shop/SearchQueryHeader/Component'

// Types
import type { FilterGroup, ActiveFilter } from '@/branches/ecommerce/components/shop/FilterSidebar/types'
import type { SortOption, ViewMode } from '@/branches/ecommerce/components/shop/SortDropdown/types'
import type { StockStatus } from '@/branches/ecommerce/components/products/ProductCard/types'

interface ShopArchiveTemplate1Props {
  products: Product[]
  category?: {
    id: string
    name: string
    slug: string
    description?: string
    icon?: string
    badgeText?: string
  }
  subcategories?: Array<{
    name: string
    slug: string
    count: number
  }>
  totalProducts: number
  currentPage?: number
  totalPages?: number
  breadcrumbs?: BreadcrumbItem[]
  searchQuery?: string
  didYouMean?: string
  enableQuickOrder?: boolean
  enableBulkActions?: boolean
}

export default function ShopArchiveTemplate1({
  products,
  category,
  subcategories,
  totalProducts,
  currentPage = 1,
  totalPages = 1,
  breadcrumbs = [],
  searchQuery,
  didYouMean,
  enableQuickOrder = true,
  enableBulkActions = true,
}: ShopArchiveTemplate1Props) {
  const { addItem } = useCart()

  // ========================================
  // STATE MANAGEMENT
  // ========================================

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState('relevance')
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])
  const [itemsPerPage, setItemsPerPage] = useState(24)
  const [quickOrderMode, setQuickOrderMode] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // ========================================
  // FILTER CONFIGURATION
  // ========================================

  // Extract unique values from products
  const brandStrings: string[] = []
  products.forEach((p) => {
    if (typeof p.brand === 'string' && !brandStrings.includes(p.brand)) {
      brandStrings.push(p.brand)
    }
  })

  const materials = Array.from(
    new Set(
      products.flatMap((p) =>
        Array.isArray(p.specifications)
          ? p.specifications
              .flatMap((group: any) => group.attributes || [])
              .filter((attr: any) => attr.name?.toLowerCase() === 'materiaal')
              .map((attr: any) => attr.value)
          : [],
      ),
    ),
  )

  const inStockCount = products.filter((p) => (p.stock ?? 0) > 0).length

  // Build filter groups
  const filterGroups: FilterGroup[] = [
    // Brand Filter
    ...(brandStrings.length > 0
      ? [
          {
            id: 'brands',
            label: 'Merk',
            icon: 'award',
            type: 'checkbox' as const,
            defaultOpen: true,
            options: brandStrings.map((brand) => ({
              value: brand,
              label: brand,
              count: products.filter((p) => typeof p.brand === 'string' && p.brand === brand).length,
            })),
          },
        ]
      : []),

    // Material Filter
    ...(materials.length > 0
      ? [
          {
            id: 'materials',
            label: 'Materiaal',
            icon: 'layers',
            type: 'checkbox' as const,
            defaultOpen: false,
            options: materials.map((material) => ({
              value: material,
              label: material,
              count: products.filter((p) =>
                Array.isArray(p.specifications)
                  ? p.specifications.some((group: any) =>
                      (group.attributes || []).some(
                        (attr: any) =>
                          attr.name?.toLowerCase() === 'materiaal' && attr.value === material,
                      ),
                    )
                  : false,
              ).length,
            })),
          },
        ]
      : []),

    // Stock Filter
    {
      id: 'stock',
      label: 'Beschikbaarheid',
      icon: 'package-check',
      type: 'checkbox' as const,
      defaultOpen: false,
      options: [
        {
          value: 'in-stock',
          label: 'Op voorraad',
          count: inStockCount,
        },
      ],
    },

    // Price Range Filter
    {
      id: 'price',
      label: 'Prijs',
      icon: 'euro',
      type: 'range' as const,
      defaultOpen: false,
      range: {
        min: 0,
        max: Math.max(...products.map((p) => p.price), 1000),
        step: 10,
      },
    },
  ]

  // Sort Options
  const sortOptions: SortOption[] = [
    { value: 'relevance', label: 'Relevantie' },
    { value: 'price-asc', label: 'Prijs: laag → hoog' },
    { value: 'price-desc', label: 'Prijs: hoog → laag' },
    { value: 'newest', label: 'Nieuwste' },
    { value: 'rating', label: 'Best beoordeeld' },
  ]

  // ========================================
  // SUBCATEGORY CHIPS
  // ========================================

  const subcategoryChips: SubcategoryChip[] = subcategories
    ? [
        // "All" chip
        {
          label: `Alle ${category?.name || 'producten'}`,
          href: `/shop/${category?.slug || ''}`,
          active: true, // Set active based on current route in real implementation
          count: totalProducts,
        },
        // Subcategory chips
        ...subcategories.map((sub) => ({
          label: sub.name,
          href: `/shop/${category?.slug || ''}/${sub.slug}`,
          count: sub.count,
        })),
      ]
    : []

  // ========================================
  // STATS FOR HERO
  // ========================================

  const stats = {
    totalProducts,
    brands: brandStrings.length,
    inStock: inStockCount,
  }

  // ========================================
  // FILTERING & SORTING
  // ========================================

  // Apply filters to products
  const filteredProducts = products.filter((product) => {
    // Check each active filter
    for (const filter of activeFilters) {
      // Brand filter
      if (filter.groupId === 'brands') {
        const productBrand = typeof product.brand === 'string' ? product.brand : ''
        if (!filter.values.includes(productBrand)) {
          return false
        }
      }

      // Material filter
      if (filter.groupId === 'materials') {
        const productMaterials = Array.isArray(product.specifications)
          ? product.specifications
              .flatMap((group: any) => group.attributes || [])
              .filter((attr: any) => attr.name?.toLowerCase() === 'materiaal')
              .map((attr: any) => attr.value)
          : []

        const hasMatchingMaterial = filter.values.some((value) =>
          productMaterials.includes(value),
        )
        if (!hasMatchingMaterial) {
          return false
        }
      }

      // Stock filter
      if (filter.groupId === 'stock') {
        if (filter.values.includes('in-stock')) {
          if ((product.stock ?? 0) <= 0) {
            return false
          }
        }
      }

      // Price range filter
      if (filter.groupId === 'price' && filter.range) {
        const price = product.price
        if (price < filter.range.min || price > filter.range.max) {
          return false
        }
      }
    }

    return true
  })

  // Apply sorting to filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'newest':
        // Assuming products have a createdAt field
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'rating':
        // TODO: Implement rating sorting when rating field is available
        return 0
      case 'relevance':
      default:
        return 0
    }
  })

  // ========================================
  // HANDLERS
  // ========================================

  const handleFilterChange = (filters: ActiveFilter[]) => {
    setActiveFilters(filters)
  }

  const handleResetFilters = () => {
    setActiveFilters([])
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  // Helper to convert Product to CartItem format (with correct CartContext API)
  const productToCartItem = (product: Product, quantity: number = 1) => {
    const imageUrl =
      typeof product.images?.[0] === 'object' && product.images[0] !== null
        ? product.images[0].url || undefined
        : undefined

    return {
      id: product.id,
      title: product.title,
      slug: product.slug || '',
      price: product.price,
      unitPrice: product.salePrice || product.price, // Fix: Added unitPrice from fix branch
      quantity,
      stock: (product.stock ?? 0) || 0,
      sku: product.sku || undefined,
      image: imageUrl,
    }
  }

  const handleAddToCart = (productId: string, quantity: number = 1) => {
    const product = products.find((p) => String(p.id) === productId)
    if (product) {
      addItem(productToCartItem(product, quantity))
    }
  }

  const handlePageChange = (page: number) => {
    // TODO: Implement page change logic (URL update or API call)
    console.log('Page changed to:', page)
  }

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value)
    // TODO: Refetch products with new page size
  }

  const handleBulkAddToCart = (products: Product[]) => {
    products.forEach((product) => {
      addItem(productToCartItem(product, 1))
    })
    setSelectedProducts([])
  }

  const handleBulkQuote = (products: Product[]) => {
    // TODO: Navigate to quote page with selected products
    console.log('Request quote for:', products)
  }

  const handleToggleProductSelection = (product: Product) => {
    setSelectedProducts((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product],
    )
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <div
      className="font-body overflow-x-hidden"
      style={{
        maxWidth: 'var(--container-width, 1792px)',
        margin: '0 auto',
        fontFamily: 'var(--font)',
      }}
    >
      {/* ========================================
          BREADCRUMBS
          ======================================== */}
      {breadcrumbs.length > 0 && (
        <div className="px-[var(--sp-4)] md:px-[var(--sp-6)] lg:px-[var(--sp-12)] pt-[var(--sp-6)]">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              ...breadcrumbs,
              ...(category ? [{ label: category.name }] : []),
            ]}
            variant="pills"
          />
        </div>
      )}

      {/* ========================================
          CATEGORY HERO
          ======================================== */}
      {category && (
        <section className="px-[var(--sp-4)] md:px-[var(--sp-6)] lg:px-[var(--sp-12)] pt-[var(--sp-6)] pb-[var(--sp-8)]">
          <CategoryHero
            category={{
              name: category.name,
              slug: category.slug,
              description: category.description,
              icon: category.icon,
              badgeText: category.badgeText,
            }}
            productCount={stats.totalProducts}
            brandCount={stats.brands}
          />
        </section>
      )}

      {/* ========================================
          SEARCH QUERY HEADER
          ======================================== */}
      {searchQuery && (
        <div className="px-[var(--sp-4)] md:px-[var(--sp-6)] lg:px-[var(--sp-12)] pb-[var(--sp-6)]">
          <SearchQueryHeader
            query={searchQuery}
            resultCount={products.length}
            totalCount={totalProducts}
            didYouMean={didYouMean}
            onClearSearch={() => {
              /* TODO: Clear search */
            }}
          />
        </div>
      )}

      {/* ========================================
          SUBCATEGORY CHIPS
          ======================================== */}
      {subcategoryChips.length > 0 && (
        <div className="px-[var(--sp-4)] md:px-[var(--sp-6)] lg:px-[var(--sp-12)] pb-[var(--sp-6)]">
          <SubcategoryChips chips={subcategoryChips} />
        </div>
      )}

      {/* ========================================
          SHOP LAYOUT (FILTERS + PRODUCTS)
          ======================================== */}
      <div className="mx-auto px-[var(--sp-4)] md:px-[var(--sp-6)] lg:px-[var(--sp-12)] pb-[var(--sp-12)]">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-[var(--sp-6)]">
          {/* ========================================
              DESKTOP SIDEBAR FILTERS
              ======================================== */}
          <FilterSidebar
            filters={filterGroups}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onResetAll={handleResetFilters}
            sticky={true}
            stickyTop={90}
            className="hidden lg:block"
          />

          {/* ========================================
              MOBILE FILTER DRAWER
              ======================================== */}
          {isMobileFilterOpen && (
            <div className="mobile-filter-overlay" onClick={() => setIsMobileFilterOpen(false)}>
              <div className="mobile-filter-drawer" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="mobile-filter-header">
                  <h2 className="mobile-filter-title">Filters</h2>
                  <button
                    className="mobile-filter-close"
                    onClick={() => setIsMobileFilterOpen(false)}
                    aria-label="Sluit filters"
                  >
                    ✕
                  </button>
                </div>

                {/* Filter Content */}
                <div className="mobile-filter-content">
                  <FilterSidebar
                    filters={filterGroups}
                    activeFilters={activeFilters}
                    onFilterChange={handleFilterChange}
                    onResetAll={handleResetFilters}
                    sticky={false}
                  />
                </div>

                {/* Footer with Apply Button */}
                <div className="mobile-filter-footer">
                  <button
                    className="mobile-filter-apply"
                    onClick={() => setIsMobileFilterOpen(false)}
                  >
                    Toon {sortedProducts.length} producten
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================
              MAIN PRODUCT CONTENT
              ======================================== */}
          <main>
            {/* ========================================
                SHOP TOOLBAR (Sort + View Toggle + Quick Order)
                ======================================== */}
            <div className="flex items-center justify-between gap-3 mb-[var(--sp-6)]">
              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-[var(--sp-3)] py-[var(--sp-2)] bg-[var(--white)] border border-[var(--grey)] rounded-lg text-[13px] font-semibold text-[var(--text)] hover:border-[var(--teal)] transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
              </button>

              <ShopToolbar
                sortValue={sortBy}
                sortOptions={sortOptions}
                onSortChange={handleSortChange}
                viewMode={viewMode}
                onViewChange={setViewMode}
                resultCount={sortedProducts.length}
                totalCount={totalProducts}
                showViewToggle={!quickOrderMode}
                className="flex-1"
              />

              {/* Quick Order Toggle */}
              {enableQuickOrder && (
                <button
                  type="button"
                  onClick={() => setQuickOrderMode(!quickOrderMode)}
                  className={`flex items-center gap-2 px-[var(--sp-3)] py-[var(--sp-2)] rounded-lg text-[13px] font-semibold transition-all ${
                    quickOrderMode
                      ? 'bg-[var(--teal)] text-white'
                      : 'bg-[var(--white)] border border-[var(--grey)] text-[var(--text)] hover:border-[var(--teal)]'
                  }`}
                  aria-pressed={quickOrderMode}
                >
                  <Zap className="w-4 h-4" />
                  <span className="hidden sm:inline">Snelbestellen</span>
                </button>
              )}
            </div>

            {/* ========================================
                QUICK ORDER TABLE
                ======================================== */}
            {quickOrderMode && (
              <div className="mb-[var(--sp-6)] p-[var(--sp-6)] bg-[var(--bg)] border border-[var(--grey)] rounded-xl">
                <p className="text-[var(--text)] mb-[var(--sp-4)]">
                  Quick Order mode - Implementation requires full state management
                </p>
                <button
                  onClick={() => setQuickOrderMode(false)}
                  className="px-[var(--sp-4)] py-[var(--sp-2)] bg-[var(--navy)] text-white rounded-lg hover:bg-[var(--navy-dark)] transition-colors"
                >
                  Back to Grid View
                </button>
              </div>
            )}

            {/* ========================================
                PRODUCT GRID
                ======================================== */}
            {!quickOrderMode && (
              <div
                className={`product-grid ${
                  viewMode === 'grid' ? 'product-grid--grid' : 'product-grid--list'
                }`}
              >
                {sortedProducts.map((product) => {
                  // Extract product image
                  const firstImage = product.images?.[0]
                  let productImage: { url: string; alt: string } | undefined

                  if (firstImage && typeof firstImage === 'object' && 'url' in firstImage) {
                    productImage = {
                      url: firstImage.url || '',
                      alt: firstImage.alt || product.title,
                    }
                  }

                  // Determine stock status
                  const stock = product.stock ?? 0
                  let stockStatus: StockStatus = 'in-stock'
                  if (stock === 0) {
                    stockStatus = 'out'
                  } else if (stock < 10) {
                    stockStatus = 'low'
                  }

                  const isSelected = selectedProducts.some((p) => String(p.id) === String(product.id))

                  return (
                    <div key={product.id} className="product-grid-item">
                      {/* Selection Checkbox */}
                      {enableBulkActions && (
                        <div className="product-selection-checkbox">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleProductSelection(product)}
                            onClick={(e) => e.stopPropagation()}
                            className="selection-checkbox"
                            aria-label={`Selecteer ${product.title}`}
                          />
                        </div>
                      )}

                      <ProductCard
                        id={String(product.id)}
                        name={product.title}
                        slug={product.slug || ''}
                        sku={product.sku || ''}
                        brand={{
                          name: typeof product.brand === 'string' ? product.brand : '',
                          slug: '',
                        }}
                        image={productImage}
                        price={product.price}
                        compareAtPrice={undefined} // TODO: Add sale price logic if available
                        volumePricing={
                          product.volumePricing
                            ? product.volumePricing.map((tier: any) => ({
                                minQty: tier.minQuantity,
                                price: tier.price,
                                discountPercent: tier.discount || 0,
                              }))
                            : undefined
                        }
                        rating={undefined} // TODO: Add rating if available
                        reviewCount={0}
                        stock={stock}
                        stockStatus={stockStatus}
                        variant={viewMode}
                        onAddToCart={
                          enableQuickOrder ? undefined : (id) => handleAddToCart(id, 1)
                        }
                      />

                      {/* Quick Add Button (overlayed on card) */}
                      {enableQuickOrder && (
                        <div className="product-quick-add">
                          <QuickAddToCart
                            productId={String(product.id)}
                            productName={product.title}
                            stock={stock}
                            stockStatus={stockStatus}
                            onAddToCart={handleAddToCart}
                            compact={viewMode === 'grid'}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* ========================================
                PAGINATION
                ======================================== */}
            {!quickOrderMode && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalProducts}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                showPerPageSelector={true}
                perPageOptions={[12, 24, 48, 96]}
                onItemsPerPageChange={handleItemsPerPageChange}
                variant="default"
                showArrows={true}
                className="mt-[var(--sp-8)]"
              />
            )}
          </main>
        </div>
      </div>

      {/* ========================================
          BULK ACTION BAR (STICKY BOTTOM)
          ======================================== */}
      {enableBulkActions && (
        <BulkActionBar
          selectedProducts={selectedProducts}
          onAddToCart={handleBulkAddToCart}
          onRequestQuote={handleBulkQuote}
          onClearSelection={() => setSelectedProducts([])}
        />
      )}

      {/* ========================================
          CUSTOM STYLES
          ======================================== */}
      <style jsx>{`
        /* Product Grid Layouts */
        .product-grid {
          display: grid;
          gap: var(--sp-5);
          position: relative;
        }

        .product-grid--grid {
          grid-template-columns: 1fr;
        }

        @media (min-width: 640px) {
          .product-grid--grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .product-grid--grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .product-grid--list {
          grid-template-columns: 1fr;
        }

        /* Product Grid Item (wrapper for card + quick add) */
        .product-grid-item {
          position: relative;
        }

        /* Selection Checkbox */
        .product-selection-checkbox {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 10;
        }

        .selection-checkbox {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          border: 2px solid var(--grey);
          cursor: pointer;
          transition: all 0.2s;
        }

        .selection-checkbox:checked {
          background: var(--teal);
          border-color: var(--teal);
        }

        .selection-checkbox:focus {
          outline: 3px solid var(--teal-glow);
          outline-offset: 2px;
        }

        /* Quick Add Overlay */
        .product-quick-add {
          position: absolute;
          bottom: 18px;
          right: 18px;
          z-index: 5;
          opacity: 0;
          transform: translateY(8px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .product-grid-item:hover .product-quick-add {
          opacity: 1;
          transform: translateY(0);
        }

        /* List view - always show */
        .product-grid--list .product-quick-add {
          opacity: 1;
          transform: translateY(0);
          position: static;
          margin-top: 12px;
        }

        /* Mobile - always show on small screens */
        @media (max-width: 768px) {
          .product-quick-add {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ═══════════════════════════════════
           MOBILE FILTER DRAWER
           ═══════════════════════════════════ */

        .mobile-filter-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 22, 40, 0.6);
          backdrop-filter: blur(4px);
          z-index: 9999;
          animation: fade-in 0.3s ease;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .mobile-filter-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 85%;
          max-width: 380px;
          background: var(--white);
          box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          animation: slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .mobile-filter-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid var(--grey);
          background: var(--bg);
        }

        .mobile-filter-title {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 700;
          color: var(--navy);
          margin: 0;
        }

        .mobile-filter-close {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--white);
          border: 1px solid var(--grey);
          border-radius: 8px;
          font-size: 20px;
          color: var(--navy);
          cursor: pointer;
          transition: all 0.2s;
        }

        .mobile-filter-close:hover {
          background: var(--teal-glow);
          border-color: var(--teal);
          color: var(--teal);
        }

        .mobile-filter-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .mobile-filter-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--grey);
          background: var(--white);
        }

        .mobile-filter-apply {
          width: 100%;
          padding: 14px 24px;
          background: var(--teal);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mobile-filter-apply:hover {
          background: var(--teal-dark);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 137, 123, 0.3);
        }

        .mobile-filter-apply:active {
          transform: translateY(0);
        }

        /* Hide scrollbar but keep functionality */
        .mobile-filter-content::-webkit-scrollbar {
          width: 6px;
        }

        .mobile-filter-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .mobile-filter-content::-webkit-scrollbar-thumb {
          background: var(--grey);
          border-radius: 3px;
        }

        .mobile-filter-content::-webkit-scrollbar-thumb:hover {
          background: var(--grey-mid);
        }
      `}</style>
    </div>
  )
}
