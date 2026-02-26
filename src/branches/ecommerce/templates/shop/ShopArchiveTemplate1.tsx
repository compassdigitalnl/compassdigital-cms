'use client'

import { useState, useMemo } from 'react'
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
import { RecentlyViewed } from '@/branches/ecommerce/components/shop/RecentlyViewed/RecentlyViewed'

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

  // Helper to extract brand name as string
  const getBrandName = (brand: any): string | null => {
    if (typeof brand === 'string') return brand
    if (typeof brand === 'object' && brand !== null && 'name' in brand) return brand.name
    return null
  }

  // Extract unique values from products
  const brands = Array.from(new Set(products.map((p) => getBrandName(p.brand)).filter((b): b is string => b !== null)))

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

  const sizes = Array.from(
    new Set(
      products.flatMap((p) =>
        Array.isArray(p.specifications)
          ? p.specifications
              .flatMap((group: any) => group.attributes || [])
              .filter((attr: any) => attr.name?.toLowerCase() === 'maat' || attr.name?.toLowerCase() === 'size')
              .map((attr: any) => attr.value)
          : [],
      ),
    ),
  )

  const inStockCount = products.filter((p) => (p.stock ?? 0) > 0).length
  const withinThreeDaysCount = products.filter((p) => (p.stock ?? 0) > 0 || (p as any).leadTime <= 3).length
  const onOrderCount = products.filter((p) => (p.stock ?? 0) === 0).length

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
            options: brands.map((b) => ({
              value: b,
              label: b,
              count: products.filter((p) => getBrandName(p.brand) === b).length,
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

    // Size Filter
    ...(sizes.length > 0
      ? [
          {
            id: 'sizes',
            label: 'Maat',
            icon: 'ruler',
            type: 'checkbox' as const,
            defaultOpen: false,
            options: sizes.map((size) => ({
              value: size,
              label: size,
              count: products.filter((p) =>
                Array.isArray(p.specifications)
                  ? p.specifications.some((group: any) =>
                      (group.attributes || []).some(
                        (attr: any) =>
                          (attr.name?.toLowerCase() === 'maat' || attr.name?.toLowerCase() === 'size') && attr.value === size,
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
        {
          value: 'within-3-days',
          label: 'Binnen 3 dagen',
          count: withinThreeDaysCount,
        },
        {
          value: 'on-order',
          label: 'Op bestelling',
          count: onOrderCount,
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
          href: category?.slug ? `/${category.slug}` : '/shop',
          active: true,
          count: totalProducts,
        },
        // Subcategory chips
        ...subcategories.map((sub) => ({
          label: sub.name,
          href: `/${sub.slug}`,
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
  // CLIENT-SIDE FILTERING & SORTING
  // ========================================

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Apply active filters
    for (const filter of activeFilters) {
      if (filter.groupId === 'brands') {
        result = result.filter((p) => filter.values.includes(getBrandName(p.brand) || ''))
      } else if (filter.groupId === 'materials') {
        result = result.filter((p) =>
          Array.isArray(p.specifications)
            ? p.specifications.some((group: any) =>
                (group.attributes || []).some(
                  (attr: any) =>
                    attr.name?.toLowerCase() === 'materiaal' && filter.values.includes(attr.value),
                ),
              )
            : false,
        )
      } else if (filter.groupId === 'sizes') {
        result = result.filter((p) =>
          Array.isArray(p.specifications)
            ? p.specifications.some((group: any) =>
                (group.attributes || []).some(
                  (attr: any) =>
                    (attr.name?.toLowerCase() === 'maat' || attr.name?.toLowerCase() === 'size') &&
                    filter.values.includes(attr.value),
                ),
              )
            : false,
        )
      } else if (filter.groupId === 'stock') {
        result = result.filter((p) => {
          const stock = p.stock ?? 0
          if (filter.values.includes('in-stock') && stock > 0) return true
          if (filter.values.includes('within-3-days') && (stock > 0 || (p as any).leadTime <= 3)) return true
          if (filter.values.includes('on-order') && stock === 0) return true
          return false
        })
      } else if (filter.groupId === 'price' && filter.values.length === 2) {
        const min = parseFloat(filter.values[0])
        const max = parseFloat(filter.values[1])
        result = result.filter((p) => p.price >= min && p.price <= max)
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'rating':
        // Keep original order when no rating data
        break
      default:
        // 'relevance' — keep original order
        break
    }

    return result
  }, [products, activeFilters, sortBy])

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

  const handleAddToCart = (productId: string, quantity: number = 1) => {
    const product = products.find((p) => String(p.id) === productId)
    if (product) {
      const firstCartImg = product.images?.[0]
      const cartImgObj = typeof firstCartImg === 'object' && firstCartImg !== null
        ? (typeof (firstCartImg as any).image === 'object' && (firstCartImg as any).image !== null
            ? (firstCartImg as any).image
            : null)
        : null
      const imageUrl = cartImgObj?.url || undefined

      addItem({
        id: product.id,
        title: product.title,
        slug: product.slug || '',
        price: product.price,
        unitPrice: product.salePrice || product.price,
        quantity,
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
      style={{ maxWidth: '1240px', margin: '0 auto' }}
    >
      {/* ========================================
          BREADCRUMBS
          ======================================== */}
      {breadcrumbs.length > 0 && (
        <div className="px-6 pt-6">
          <Breadcrumbs items={breadcrumbs} currentPage={category?.name} />
        </div>
      )}

      {/* ========================================
          CATEGORY HERO
          ======================================== */}
      {category && (
        <section className="pt-6 pb-8">
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
            inStockPercent={totalProducts > 0 ? Math.round((inStockCount / totalProducts) * 100) : 0}
          />
        </section>
      )}

      {/* ========================================
          SUBCATEGORY CHIPS
          ======================================== */}
      {subcategoryChips.length > 0 && (
        <div className="pb-6">
          <SubcategoryChips chips={subcategoryChips} />
        </div>
      )}

      {/* ========================================
          SHOP LAYOUT (FILTERS + PRODUCTS)
          ======================================== */}
      <div className="mx-auto px-6 pb-24">
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
              resultCount={filteredProducts.length}
              totalCount={totalProducts}
              showViewToggle={true}
              className="mb-6"
              activeFilters={activeFilters.map((f) => ({ groupId: f.groupId, label: f.label }))}
              onRemoveFilter={(groupId) => {
                setActiveFilters((prev) => prev.filter((f) => f.groupId !== groupId))
              }}
              onResetFilters={handleResetFilters}
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
              {filteredProducts.map((product) => {
                // Extract product image (safe type narrowing)
                const firstImg = product.images?.[0]
                const imgObj = typeof firstImg === 'object' && firstImg !== null
                  ? (typeof (firstImg as any).image === 'object' && (firstImg as any).image !== null
                      ? (firstImg as any).image
                      : null)
                  : null
                const productImage = imgObj
                  ? { url: imgObj.url || '', alt: imgObj.alt || product.title }
                  : undefined

                // Determine stock status
                const stockNum = product.stock ?? 0
                let stockStatus: StockStatus = 'in-stock'
                if (stockNum === 0) {
                  stockStatus = 'out'
                } else if (stockNum < 10) {
                  stockStatus = 'low'
                }

                return (
                  <ProductCard
                    key={product.id}
                    id={String(product.id)}
                    name={product.title}
                    slug={product.slug || ''}
                    sku={product.sku || ''}
                    brand={{ name: getBrandName(product.brand) || '', slug: '' }}
                    image={productImage}
                    price={product.price}
                    compareAtPrice={undefined}
                    volumePricing={
                      product.volumePricing
                        ? product.volumePricing.map((tier: any) => ({
                            minQty: tier.minQuantity,
                            price: tier.price,
                            discountPercent: tier.discount || 0,
                          }))
                        : undefined
                    }
                    rating={undefined}
                    reviewCount={0}
                    stock={stockNum}
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

        {/* ========================================
            RECENTLY VIEWED
            ======================================== */}
        <RecentlyViewed className="mt-4" />
      </div>
    </div>
  )
}
