'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import type { Product } from '@/payload-types'

// Modern Components
import { CategoryHero } from '@/branches/ecommerce/components/shop/CategoryHero/CategoryHero'
import { Breadcrumbs, type BreadcrumbItem } from '@/branches/shared/components/layout/breadcrumbs/Breadcrumbs'
import { SubcategoryChips, type SubcategoryChip } from '@/branches/ecommerce/components/shop/SubcategoryChips/Component'
import { FilterSidebar } from '@/branches/ecommerce/components/shop/FilterSidebar/FilterSidebar'
import { ShopToolbar } from '@/branches/ecommerce/components/shop/SortDropdown/ShopToolbar'
import { ProductCard } from '@/branches/ecommerce/components/products/ProductCard/Component'

// Types
import type { FilterGroup, ActiveFilter } from '@/branches/ecommerce/components/shop/FilterSidebar/types'
import type { SortOption, ViewMode } from '@/branches/ecommerce/components/shop/SortDropdown/types'
import type { StockStatus } from '@/branches/ecommerce/components/products/ProductCard/types'

// Icons
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
}

export default function ShopArchiveTemplate1({
  products,
  category,
  subcategories,
  totalProducts,
  currentPage = 1,
  totalPages = 1,
  breadcrumbs = [],
}: ShopArchiveTemplate1Props) {
  const { addItem } = useCart()

  // ========================================
  // STATE MANAGEMENT
  // ========================================

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState('relevance')
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])

  // ========================================
  // FILTER CONFIGURATION
  // ========================================

  // Extract unique values from products
  const brands = Array.from(new Set(products.map((p) => p.brand).filter((b): b is string => !!b)))

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

  const inStockCount = products.filter((p) => p.stock > 0).length

  // Build filter groups
  const filterGroups: FilterGroup[] = [
    // Brand Filter
    ...(brands.length > 0
      ? [
          {
            id: 'brands',
            label: 'Merk',
            icon: 'award',
            type: 'checkbox' as const,
            defaultOpen: true,
            options: brands.map((brand) => ({
              value: brand,
              label: brand,
              count: products.filter((p) => p.brand === brand).length,
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
    brands: brands.length,
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

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      const imageUrl =
        typeof product.images?.[0] === 'object' && product.images[0] !== null
          ? product.images[0].url || undefined
          : undefined

      addItem({
        id: product.id,
        title: product.title,
        slug: product.slug || '',
        price: product.price,
        unitPrice: product.salePrice || product.price,
        quantity: 1,
        stock: (product.stock ?? 0) || 0,
        sku: product.sku || undefined,
        image: imageUrl,
      })
    }
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <div
      className="font-body overflow-x-hidden"
      style={{ maxWidth: 'var(--container-width, 1792px)', margin: '0 auto' }}
    >
      {/* ========================================
          BREADCRUMBS
          ======================================== */}
      {breadcrumbs.length > 0 && (
        <div className="px-4 md:px-6 lg:px-24 pt-6">
          <Breadcrumbs items={breadcrumbs} currentPage={category?.name} />
        </div>
      )}

      {/* ========================================
          CATEGORY HERO
          ======================================== */}
      {category && (
        <section className="px-4 md:px-6 lg:px-24 pt-6 pb-8">
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
          SUBCATEGORY CHIPS
          ======================================== */}
      {subcategoryChips.length > 0 && (
        <div className="px-4 md:px-6 lg:px-24 pb-6">
          <SubcategoryChips chips={subcategoryChips} />
        </div>
      )}

      {/* ========================================
          SHOP LAYOUT (FILTERS + PRODUCTS)
          ======================================== */}
      <div className="mx-auto px-4 md:px-6 lg:px-24 pb-24">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-7">
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
                SHOP TOOLBAR (Sort + View Toggle)
                ======================================== */}
            <ShopToolbar
              sortValue={sortBy}
              sortOptions={sortOptions}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewChange={setViewMode}
              resultCount={products.length}
              totalCount={totalProducts}
              showViewToggle={true}
              className="mb-6"
            />

            {/* ========================================
                PRODUCT GRID
                ======================================== */}
            <div
              className={`grid gap-5 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {products.map((product) => {
                // Extract product image
                const productImage =
                  typeof product.images?.[0]?.image === 'object' && product.images[0].image !== null
                    ? {
                        url: product.images[0].image.url || '',
                        alt: product.images[0].image.alt || product.title,
                      }
                    : undefined

                // Determine stock status
                let stockStatus: StockStatus = 'in-stock'
                if (product.stock === 0) {
                  stockStatus = 'out'
                } else if (product.stock < 10) {
                  stockStatus = 'low'
                }

                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.title}
                    slug={product.slug || ''}
                    sku={product.sku || ''}
                    brand={{ name: product.brand || '', slug: '' }}
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
                    stock={product.stock}
                    stockStatus={stockStatus}
                    variant={viewMode}
                    onAddToCart={handleAddToCart}
                  />
                )
              })}
            </div>

            {/* ========================================
                PAGINATION
                ======================================== */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-10">
                <Link
                  href={`?page=${Math.max(1, currentPage - 1)}`}
                  className={`w-11 h-11 rounded-xl border-[1.5px] border-[var(--color-border)] bg-white flex items-center justify-center text-sm font-semibold text-[var(--color-text-primary)] transition-all hover:border-[var(--color-primary)] ${
                    currentPage === 1 ? 'opacity-30 pointer-events-none' : ''
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Link>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first, last, current, and adjacent pages
                  const isVisible =
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)

                  if (!isVisible) {
                    // Show ellipsis
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span
                          key={page}
                          className="w-11 h-11 flex items-center justify-center text-sm text-[var(--color-text-muted)]"
                        >
                          ...
                        </span>
                      )
                    }
                    return null
                  }

                  return (
                    <Link
                      key={page}
                      href={`?page=${page}`}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-semibold transition-all ${
                        page === currentPage
                          ? 'bg-[var(--color-primary)] border-[1.5px] border-[var(--color-primary)] text-white'
                          : 'border-[1.5px] border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:border-[var(--color-primary)]'
                      }`}
                    >
                      {page}
                    </Link>
                  )
                })}

                <Link
                  href={`?page=${Math.min(totalPages, currentPage + 1)}`}
                  className={`w-11 h-11 rounded-xl border-[1.5px] border-[var(--color-border)] bg-white flex items-center justify-center text-sm font-semibold text-[var(--color-text-primary)] transition-all hover:border-[var(--color-primary)] ${
                    currentPage === totalPages ? 'opacity-30 pointer-events-none' : ''
                  }`}
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
