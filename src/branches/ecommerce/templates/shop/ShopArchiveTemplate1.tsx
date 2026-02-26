'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Filter, Zap } from 'lucide-react'
import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import type { Product } from '@/payload-types'

// Modern Components
import { CategoryHero } from '@/branches/ecommerce/components/shop/CategoryHero/CategoryHero'
import { Breadcrumbs, type BreadcrumbItem } from '@/branches/shared/components/layout/breadcrumbs/Breadcrumbs'
import { SubcategoryChips, type SubcategoryChip } from '@/branches/ecommerce/components/shop/SubcategoryChips/Component'
import { FilterSidebar } from '@/branches/ecommerce/components/shop/FilterSidebar/FilterSidebar'
import { ShopToolbar } from '@/branches/ecommerce/components/shop/SortDropdown/ShopToolbar'
import { ProductCard } from '@/branches/ecommerce/components/products/ProductCard/Component'
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
  // HANDLERS
  // ========================================

  const handleFilterChange = (filters: ActiveFilter[]) => {
    setActiveFilters(filters)
    // TODO: Apply filters to products (server-side or client-side filtering)
  }

  const handleResetFilters = () => {
    setActiveFilters([])
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    // TODO: Apply sorting to products
  }

  // Helper to convert Product to CartItem format
  const productToCartItem = (product: Product, quantity: number = 1) => {
    const firstImage = product.images?.[0]
    let imageUrl: string | undefined

    if (firstImage && typeof firstImage === 'object' && 'url' in firstImage) {
      imageUrl = firstImage.url || undefined
    }

    return {
      id: product.id,
      slug: product.slug || '',
      title: product.title,
      price: product.price,
      stock: product.stock ?? 0,
      sku: product.sku || undefined,
      image: imageUrl,
      quantity,
    }
  }

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => String(p.id) === productId)
    if (product) {
      addItem(productToCartItem(product, 1))
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
          <Breadcrumbs items={breadcrumbs} currentPage={category?.name} />
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
                resultCount={products.length}
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
                className={`grid gap-[var(--sp-5)] ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {products.map((product) => {
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
                    <div
                      key={product.id}
                      className="relative"
                      onClick={() =>
                        enableBulkActions && handleToggleProductSelection(product)
                      }
                    >
                      {/* Selection Checkbox */}
                      {enableBulkActions && (
                        <div className="absolute top-3 left-3 z-10">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleProductSelection(product)}
                            className="w-5 h-5 rounded border-2 border-[var(--grey)] checked:bg-[var(--teal)] checked:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/30"
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
                        onAddToCart={handleAddToCart}
                      />
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
    </div>
  )
}
