'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import { useAddToCartToast } from '@/branches/ecommerce/components/ui/AddToCartToast'
import type { Product } from '@/payload-types'

// Types & Utils
import type { ExtendedProduct, AttributeFieldNames } from './types'
import { SHOP_CONSTANTS, DEFAULT_ATTRIBUTE_NAMES } from './types'
import {
  getBrandName,
  extractProductImage,
  getEffectivePrice,
  getCompareAtPrice,
  getPriceRange,
  buildUrlWithParams,
  parseFilterFromUrl,
  getStockStatus,
} from './utils'
import { useProductFilters } from './useProductFilters'

// Modern Components
import { CategoryHero } from '@/branches/ecommerce/components/shop/CategoryHero/CategoryHero'
import { Breadcrumbs, type BreadcrumbItem } from '@/branches/shared/components/layout/breadcrumbs/Breadcrumbs'
import { SubcategoryChips, type SubcategoryChip } from '@/branches/ecommerce/components/shop/SubcategoryChips/Component'
import { FilterSidebar } from '@/branches/ecommerce/components/shop/FilterSidebar/FilterSidebar'
import { MobileFilterDrawer } from '@/branches/ecommerce/components/shop/FilterSidebar/MobileFilterDrawer'
import { ShopToolbar } from '@/branches/ecommerce/components/shop/SortDropdown/ShopToolbar'
import { ProductCard } from '@/branches/ecommerce/components/products/ProductCard/Component'
import { RecentlyViewed } from '@/branches/ecommerce/components/shop/RecentlyViewed/RecentlyViewed'

// Types
import type { FilterGroup, ActiveFilter } from '@/branches/ecommerce/components/shop/FilterSidebar/types'
import type { SortOption, ViewMode } from '@/branches/ecommerce/components/shop/SortDropdown/types'

// Icons
import { ChevronLeft, ChevronRight, PackageX, RotateCcw, Loader2 } from 'lucide-react'

// ============================================
// INTERFACES
// ============================================

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
  attributeNames?: AttributeFieldNames
  loading?: boolean
}

// ============================================
// COMPONENT
// ============================================

export default function ShopArchiveTemplate1({
  products,
  category,
  subcategories,
  totalProducts,
  currentPage = 1,
  totalPages = 1,
  breadcrumbs = [],
  attributeNames = DEFAULT_ATTRIBUTE_NAMES,
  loading = false,
}: ShopArchiveTemplate1Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { addItem } = useCart()
  const { showToast } = useAddToCartToast()

  // ========================================
  // URL STATE SYNC
  // ========================================

  // Initialize state from URL params
  const initialViewMode = (searchParams.get('view') as ViewMode) || 'grid'
  const initialSortBy = searchParams.get('sort') || 'relevance'

  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode)
  const [sortBy, setSortBy] = useState(initialSortBy)
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)

  // Parse filters from URL on mount
  useEffect(() => {
    const urlFilters: ActiveFilter[] = []

    // Parse brand filters
    const brands = parseFilterFromUrl(searchParams, 'brand')
    if (brands.length > 0) {
      urlFilters.push({ groupId: 'brands', label: 'Merk', values: brands })
    }

    // Parse material filters
    const materials = parseFilterFromUrl(searchParams, 'material')
    if (materials.length > 0) {
      urlFilters.push({ groupId: 'materials', label: 'Materiaal', values: materials })
    }

    // Parse size filters
    const sizes = parseFilterFromUrl(searchParams, 'size')
    if (sizes.length > 0) {
      urlFilters.push({ groupId: 'sizes', label: 'Maat', values: sizes })
    }

    // Parse stock filter
    const stock = parseFilterFromUrl(searchParams, 'stock')
    if (stock.length > 0) {
      urlFilters.push({ groupId: 'stock', label: 'Beschikbaarheid', values: stock })
    }

    // Parse price range
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    if (minPrice && maxPrice) {
      urlFilters.push({ groupId: 'price', label: 'Prijs', values: [minPrice, maxPrice] })
    }

    setActiveFilters(urlFilters)
  }, [searchParams])

  // Update URL when filters/sort change
  const updateUrl = useCallback(
    (newFilters: ActiveFilter[], newSortBy: string, newViewMode: ViewMode) => {
      const params: Record<string, string | string[]> = {}

      // Add filters to params
      newFilters.forEach(filter => {
        switch (filter.groupId) {
          case 'brands':
            params.brand = filter.values
            break
          case 'materials':
            params.material = filter.values
            break
          case 'sizes':
            params.size = filter.values
            break
          case 'stock':
            params.stock = filter.values
            break
          case 'price':
            if (filter.values.length === 2) {
              params.minPrice = filter.values[0]
              params.maxPrice = filter.values[1]
            }
            break
        }
      })

      // Add sort and view
      if (newSortBy !== 'relevance') {
        params.sort = newSortBy
      }
      if (newViewMode !== 'grid') {
        params.view = newViewMode
      }

      // Preserve current page if applicable
      if (currentPage > 1) {
        params.page = String(currentPage)
      }

      const newUrl = buildUrlWithParams(pathname, params)
      router.push(newUrl, { scroll: false })
    },
    [router, pathname, currentPage],
  )

  // ========================================
  // PRODUCT FILTERING & SORTING
  // ========================================

  const { filteredProducts, extractedAttributes, filterCounts } = useProductFilters({
    products: products as ExtendedProduct[],
    activeFilters,
    sortBy,
    attributeNames,
  })

  // ========================================
  // FILTER CONFIGURATION
  // ========================================

  const filterGroups = useMemo<FilterGroup[]>(() => {
    const groups: FilterGroup[] = []

    // Brand Filter
    if (extractedAttributes.brands.length > 0) {
      groups.push({
        id: 'brands',
        label: 'Merk',
        icon: 'award',
        type: 'checkbox' as const,
        defaultOpen: true,
        options: extractedAttributes.brands.map(brand => ({
          value: brand,
          label: brand,
          count: products.filter(p => getBrandName(p.brand) === brand).length,
        })),
      })
    }

    // Material Filter
    if (extractedAttributes.materials.length > 0) {
      groups.push({
        id: 'materials',
        label: 'Materiaal',
        icon: 'layers',
        type: 'checkbox' as const,
        defaultOpen: false,
        options: extractedAttributes.materials.map(material => ({
          value: material,
          label: material,
          count: products.filter(p => {
            const ext = p as ExtendedProduct
            return (
              ext.specifications?.some(group =>
                (group.attributes || []).some(
                  attr =>
                    attributeNames.material
                      .map(n => n.toLowerCase())
                      .includes(attr.name?.toLowerCase()) && attr.value === material,
                ),
              ) || false
            )
          }).length,
        })),
      })
    }

    // Size Filter
    if (extractedAttributes.sizes.length > 0) {
      groups.push({
        id: 'sizes',
        label: 'Maat',
        icon: 'ruler',
        type: 'checkbox' as const,
        defaultOpen: false,
        options: extractedAttributes.sizes.map(size => ({
          value: size,
          label: size,
          count: products.filter(p => {
            const ext = p as ExtendedProduct
            return (
              ext.specifications?.some(group =>
                (group.attributes || []).some(
                  attr =>
                    attributeNames.size
                      .map(n => n.toLowerCase())
                      .includes(attr.name?.toLowerCase()) && attr.value === size,
                ),
              ) || false
            )
          }).length,
        })),
      })
    }

    // Stock Filter
    groups.push({
      id: 'stock',
      label: 'Beschikbaarheid',
      icon: 'package-check',
      type: 'checkbox' as const,
      defaultOpen: false,
      options: [
        {
          value: 'in-stock',
          label: 'Op voorraad',
          count: filterCounts.inStock,
        },
        {
          value: 'low',
          label: 'Beperkte voorraad',
          count: filterCounts.lowStock,
        },
        {
          value: 'out',
          label: 'Niet op voorraad',
          count: filterCounts.outOfStock,
        },
      ],
    })

    // Price Range Filter
    const priceRange = getPriceRange(products)
    groups.push({
      id: 'price',
      label: 'Prijs',
      icon: 'euro',
      type: 'range' as const,
      defaultOpen: false,
      range: {
        min: priceRange.min,
        max: priceRange.max,
        step: 10,
      },
    })

    return groups
  }, [products, extractedAttributes, filterCounts, attributeNames])

  // Sort Options
  const sortOptions: SortOption[] = [
    { value: 'relevance', label: 'Relevantie' },
    { value: 'price-asc', label: 'Prijs: laag → hoog' },
    { value: 'price-desc', label: 'Prijs: hoog → laag' },
    { value: 'newest', label: 'Nieuwste' },
    { value: 'name-asc', label: 'Naam: A → Z' },
    { value: 'name-desc', label: 'Naam: Z → A' },
    // Only show rating sort if products have ratings
    ...(products.some(p => (p as ExtendedProduct).rating)
      ? [{ value: 'rating', label: 'Best beoordeeld' }]
      : []),
  ]

  // ========================================
  // SUBCATEGORY CHIPS
  // ========================================

  const currentSlug = pathname.split('/').filter(Boolean).pop()

  const subcategoryChips: SubcategoryChip[] = useMemo(() => {
    if (!subcategories) return []

    const basePath = category?.slug ? `/${category.slug}` : '/shop'

    return [
      // "All" chip
      {
        label: `Alle ${category?.name || 'producten'}`,
        href: basePath,
        active: currentSlug === category?.slug || currentSlug === 'shop',
        count: totalProducts,
      },
      // Subcategory chips
      ...subcategories.map(sub => ({
        label: sub.name,
        href: `${basePath}/${sub.slug}`,
        active: currentSlug === sub.slug,
        count: sub.count,
      })),
    ]
  }, [subcategories, category, totalProducts, currentSlug])

  // ========================================
  // STATS FOR HERO
  // ========================================

  const stats = useMemo(
    () => ({
      totalProducts,
      brands: extractedAttributes.brands.length,
      inStock: filterCounts.inStock,
    }),
    [totalProducts, extractedAttributes.brands.length, filterCounts.inStock],
  )

  // ========================================
  // HANDLERS
  // ========================================

  const handleFilterChange = useCallback(
    (filters: ActiveFilter[]) => {
      setIsFiltering(true)
      setActiveFilters(filters)
      updateUrl(filters, sortBy, viewMode)
      setTimeout(() => setIsFiltering(false), 300)
    },
    [sortBy, viewMode, updateUrl],
  )

  const handleResetFilters = useCallback(() => {
    setIsFiltering(true)
    setActiveFilters([])
    updateUrl([], sortBy, viewMode)
    setTimeout(() => setIsFiltering(false), 300)
  }, [sortBy, viewMode, updateUrl])

  const handleSortChange = useCallback(
    (value: string) => {
      setSortBy(value)
      updateUrl(activeFilters, value, viewMode)
    },
    [activeFilters, viewMode, updateUrl],
  )

  const handleViewChange = useCallback(
    (value: ViewMode) => {
      setViewMode(value)
      updateUrl(activeFilters, sortBy, value)
    },
    [activeFilters, sortBy, updateUrl],
  )

  const handleAddToCart = useCallback(
    (productId: string, quantity: number = 1) => {
      const product = products.find(p => String(p.id) === productId)
      if (!product) return

      const productImage = extractProductImage(product)
      const unitPrice = getEffectivePrice(product)

      addItem({
        id: product.id,
        title: product.title,
        slug: product.slug || '',
        price: product.price,
        unitPrice: unitPrice,
        quantity,
        stock: product.stock ?? 0,
        sku: product.sku || undefined,
        image: productImage?.url,
      })

      // Show toast notification
      showToast({
        id: String(product.id),
        name: product.title,
        image: productImage?.url,
        quantity,
        price: unitPrice,
      })
    },
    [products, addItem, showToast],
  )

  // ========================================
  // RENDER
  // ========================================

  return (
    <div
      className="font-body overflow-x-hidden"
      style={{ maxWidth: 'var(--container-width, 1792px)', margin: '0 auto' }}
      data-testid="shop-archive-template"
    >
      {/* ========================================
          BREADCRUMBS
          ======================================== */}
      <div className="px-6 pt-6">
        <Breadcrumbs items={breadcrumbs} currentPage={category?.name || 'Shop'} />
      </div>

      {/* ========================================
          CATEGORY HERO
          ======================================== */}
      <section className="pt-6 pb-8">
        <CategoryHero
          category={{
            name: category?.name || 'Shop',
            slug: category?.slug || 'shop',
            description:
              category?.description || 'Bekijk ons volledige assortiment professionele producten.',
            icon: category?.icon || 'shopping-bag',
            badgeText: category?.badgeText || (category ? 'PRODUCTCATEGORIE' : 'ASSORTIMENT'),
          }}
          productCount={stats.totalProducts}
          brandCount={stats.brands}
          inStockPercent={totalProducts > 0 ? Math.round((stats.inStock / totalProducts) * 100) : 0}
        />
      </section>

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
              onViewChange={handleViewChange}
              resultCount={filteredProducts.length}
              totalCount={totalProducts}
              showViewToggle={true}
              className="mb-6"
              activeFilters={activeFilters.map(f => ({ groupId: f.groupId, label: f.label }))}
              onRemoveFilter={groupId => {
                setActiveFilters(prev => prev.filter(f => f.groupId !== groupId))
              }}
              onResetFilters={handleResetFilters}
              onOpenMobileFilters={() => setMobileFiltersOpen(true)}
            />

            {/* ========================================
                LOADING STATE
                ======================================== */}
            {(loading || isFiltering) && (
              <div className="flex items-center justify-center py-16" data-testid="loading-state">
                <Loader2 className="w-8 h-8 text-theme-teal animate-spin" />
              </div>
            )}

            {/* ========================================
                PRODUCT GRID
                ======================================== */}
            {!loading && !isFiltering && (
              <>
                {filteredProducts.length === 0 ? (
                  /* No Results State */
                  <div
                    className="flex flex-col items-center justify-center py-16 px-6 text-center"
                    data-testid="no-results"
                  >
                    <PackageX className="w-16 h-16 text-theme-grey-mid mb-4" />
                    <h3 className="text-xl font-bold text-theme-navy mb-2">
                      Geen producten gevonden
                    </h3>
                    <p className="text-theme-grey-mid mb-6 max-w-md">
                      Er zijn geen producten die voldoen aan je zoekcriteria. Probeer je filters aan
                      te passen.
                    </p>
                    {activeFilters.length > 0 && (
                      <button
                        onClick={handleResetFilters}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-theme-teal text-white rounded-xl font-semibold hover:bg-opacity-90 transition-all"
                        data-testid="reset-filters-button"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset alle filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div
                    className={`grid gap-5 ${
                      viewMode === 'grid'
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                        : 'grid-cols-1'
                    }`}
                    data-testid="product-grid"
                  >
                    {filteredProducts.map(product => {
                      const extProduct = product as ExtendedProduct
                      const productImage = extractProductImage(product)
                      const stockStatus = getStockStatus(product.stock)
                      const effectivePrice = getEffectivePrice(product)
                      const compareAtPrice = getCompareAtPrice(product)

                      return (
                        <ProductCard
                          key={product.id}
                          id={String(product.id)}
                          name={product.title}
                          slug={product.slug || ''}
                          sku={product.sku || ''}
                          brand={{ name: getBrandName(product.brand) || '', slug: '' }}
                          image={productImage}
                          price={effectivePrice}
                          compareAtPrice={compareAtPrice}
                          volumePricing={
                            extProduct.volumePricing
                              ? extProduct.volumePricing.map(tier => ({
                                  minQty: tier.minQuantity,
                                  price: tier.price,
                                  discountPercent: tier.discount || 0,
                                }))
                              : undefined
                          }
                          rating={extProduct.rating?.average}
                          reviewCount={extProduct.rating?.count || 0}
                          stock={product.stock ?? 0}
                          stockStatus={stockStatus}
                          variant={viewMode}
                          onAddToCart={handleAddToCart}
                        />
                      )
                    })}
                  </div>
                )}
              </>
            )}

            {/* ========================================
                PAGINATION
                ======================================== */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-10" data-testid="pagination">
                <Link
                  href={buildUrlWithParams(pathname, {
                    page: String(Math.max(1, currentPage - 1)),
                    sort: sortBy !== 'relevance' ? sortBy : undefined,
                    view: viewMode !== 'grid' ? viewMode : undefined,
                  })}
                  className={`w-11 h-11 rounded-xl border-[1.5px] border-[var(--color-border)] bg-white flex items-center justify-center text-sm font-semibold text-[var(--color-text-primary)] transition-all hover:border-[var(--color-primary)] ${
                    currentPage === 1 ? 'opacity-30 pointer-events-none' : ''
                  }`}
                  aria-label="Previous page"
                  data-testid="pagination-prev"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Link>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
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
                      href={buildUrlWithParams(pathname, {
                        page: String(page),
                        sort: sortBy !== 'relevance' ? sortBy : undefined,
                        view: viewMode !== 'grid' ? viewMode : undefined,
                      })}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-semibold transition-all ${
                        page === currentPage
                          ? 'bg-[var(--color-primary)] border-[1.5px] border-[var(--color-primary)] text-white'
                          : 'border-[1.5px] border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:border-[var(--color-primary)]'
                      }`}
                      data-testid={`pagination-page-${page}`}
                    >
                      {page}
                    </Link>
                  )
                })}

                <Link
                  href={buildUrlWithParams(pathname, {
                    page: String(Math.min(totalPages, currentPage + 1)),
                    sort: sortBy !== 'relevance' ? sortBy : undefined,
                    view: viewMode !== 'grid' ? viewMode : undefined,
                  })}
                  className={`w-11 h-11 rounded-xl border-[1.5px] border-[var(--color-border)] bg-white flex items-center justify-center text-sm font-semibold text-[var(--color-text-primary)] transition-all hover:border-[var(--color-primary)] ${
                    currentPage === totalPages ? 'opacity-30 pointer-events-none' : ''
                  }`}
                  aria-label="Next page"
                  data-testid="pagination-next"
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

      {/* ========================================
          MOBILE FILTER DRAWER
          ======================================== */}
      <MobileFilterDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filterGroups}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onResetAll={handleResetFilters}
        defaultOpen={['brands']}
        resultCount={filteredProducts.length}
      />
    </div>
  )
}
