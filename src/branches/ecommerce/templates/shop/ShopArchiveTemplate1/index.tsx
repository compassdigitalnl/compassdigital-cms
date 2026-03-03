'use client'

import { useState, useMemo, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import { useAddToCartToast } from '@/branches/ecommerce/components/ui/AddToCartToast'
import type { Product } from '@/payload-types'

// Meilisearch-powered search
import { useShopSearch, type ShopSearchHit } from '@/branches/ecommerce/hooks/useShopSearch'
import {
  facetsToFilterGroups,
  searchStateToActiveFilters,
  activeFiltersToSearchUpdates,
} from '@/branches/ecommerce/lib/shop/facetsToFilters'

// Types & Utils
import type { BreadcrumbItem } from '@/branches/shared/components/layout/breadcrumbs/Breadcrumbs'

// Modern Components
import { CategoryHero } from '@/branches/ecommerce/components/shop/CategoryHero/CategoryHero'
import { Breadcrumbs } from '@/branches/shared/components/layout/breadcrumbs/Breadcrumbs'
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
import { RichText } from '@/branches/shared/components/common/RichText'

// ============================================
// INTERFACES
// ============================================

interface FilterOrderConfig {
  filterId: string
  enabled: boolean
  displayName?: string
}

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
  loading?: boolean
  shopFilterOrder?: FilterOrderConfig[]
  categoryContent?: any
}

// ============================================
// HELPERS
// ============================================

/** Map a Meilisearch hit to ProductCard-compatible stock status */
function hitStockStatus(hit: ShopSearchHit): 'in-stock' | 'low' | 'out' | 'on-backorder' {
  // Grouped products: trust Meilisearch stockStatus directly (calculated from children during indexing)
  if (hit.productType === 'grouped') {
    if (hit.stockStatus === 'in-stock') return 'in-stock'
    if (hit.stockStatus === 'on-backorder') return 'on-backorder'
    return 'out'
  }
  // Simple products: check stock + backorder fields
  if (hit.stockStatus === 'on-backorder') return 'on-backorder'
  if (hit.stockStatus === 'out' || (!hit.backordersAllowed && hit.stock <= 0)) return 'out'
  if (hit.stock > 0 && hit.stock <= 5) return 'low'
  return 'in-stock'
}

// ============================================
// COMPONENT
// ============================================

export default function ShopArchiveTemplate1({
  products,
  category,
  subcategories,
  totalProducts: serverTotalProducts,
  breadcrumbs = [],
  shopFilterOrder = [],
  categoryContent,
}: ShopArchiveTemplate1Props) {
  const pathname = usePathname()
  const { addItem } = useCart()
  const { showToast } = useAddToCartToast()

  // ========================================
  // MEILISEARCH SEARCH HOOK
  // ========================================

  const {
    hits,
    total,
    totalPages,
    page: currentPage,
    facets,
    loading: searchLoading,
    error: searchError,
    setSort,
    setPage,
    resetFilters,
    searchState,
    setBrandNames,
    setManufacturers,
    setProductLines,
    setStockStatus,
    setPriceRange,
    setSpecFilter,
    setQuery,
  } = useShopSearch({
    limit: 24,
    initialCategoryIds: category?.id ? [Number(category.id)] : undefined,
  })

  // ========================================
  // LOCAL UI STATE
  // ========================================

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Use Meilisearch results when available, fall back to server products
  const useMeilisearch = !searchError && hits.length > 0 || (!searchError && !searchLoading)
  const displayProducts = useMeilisearch ? hits : []
  const displayTotal = useMeilisearch ? total : serverTotalProducts
  const displayTotalPages = useMeilisearch ? totalPages : 1

  // ========================================
  // FILTER GROUPS (from Meilisearch facets)
  // ========================================

  const filterGroups = useMemo<FilterGroup[]>(() => {
    return facetsToFilterGroups(facets, searchState)
  }, [facets, searchState])

  // Apply admin-configured filter ordering and visibility
  const orderedFilterGroups = useMemo<FilterGroup[]>(() => {
    if (!shopFilterOrder || shopFilterOrder.length === 0) {
      return filterGroups
    }

    const filterMap = new Map(filterGroups.map(group => [group.id, group]))
    const orderedGroups: FilterGroup[] = []

    for (const config of shopFilterOrder) {
      const filter = filterMap.get(config.filterId)
      if (filter && config.enabled !== false) {
        const customizedFilter = config.displayName
          ? { ...filter, label: config.displayName }
          : filter
        orderedGroups.push(customizedFilter)
      }
    }

    // Add any filters not in configuration (fallback for new/dynamic filters)
    for (const filter of filterGroups) {
      const isConfigured = shopFilterOrder.some(config => config.filterId === filter.id)
      if (!isConfigured) {
        orderedGroups.push(filter)
      }
    }

    return orderedGroups
  }, [filterGroups, shopFilterOrder])

  // Active filters derived from search state
  const activeFilters = useMemo(() => {
    return searchStateToActiveFilters(searchState)
  }, [searchState])

  // Sort Options
  const sortOptions: SortOption[] = [
    { value: 'relevance', label: 'Relevantie' },
    { value: 'price-asc', label: 'Prijs: laag → hoog' },
    { value: 'price-desc', label: 'Prijs: hoog → laag' },
    { value: 'newest', label: 'Nieuwste' },
    { value: 'name-asc', label: 'Naam: A → Z' },
    { value: 'name-desc', label: 'Naam: Z → A' },
  ]

  // Default open state - all filters expanded
  const allFilterIds = useMemo(() => orderedFilterGroups.map(f => f.id), [orderedFilterGroups])

  // ========================================
  // SUBCATEGORY CHIPS
  // ========================================

  const currentSlug = pathname.split('/').filter(Boolean).pop()

  const subcategoryChips: SubcategoryChip[] = useMemo(() => {
    if (!subcategories || subcategories.length === 0) return []

    return [
      // "All" chip — link back to current category (or /shop root)
      {
        label: `Alle ${category?.name || 'producten'}`,
        href: category?.slug ? `/${category.slug}` : '/shop',
        active: currentSlug === category?.slug || currentSlug === 'shop',
        count: displayTotal,
      },
      // Subcategory chips — each links to /{sub.slug} (caught by [slug] route)
      ...subcategories.map(sub => ({
        label: sub.name,
        href: `/${sub.slug}`,
        active: currentSlug === sub.slug,
        count: sub.count || undefined,
      })),
    ]
  }, [subcategories, category, displayTotal, currentSlug])

  // ========================================
  // STATS FOR HERO
  // ========================================

  const stats = useMemo(() => {
    const brandCount = facets ? Object.keys(facets.brands || {}).length : 0
    const inStockCount = facets?.stockStatus?.['in-stock'] || 0
    return {
      totalProducts: displayTotal,
      brands: brandCount,
      inStock: inStockCount,
    }
  }, [displayTotal, facets])

  // ========================================
  // HANDLERS
  // ========================================

  const handleFilterChange = useCallback(
    (filters: ActiveFilter[]) => {
      // Convert ActiveFilter[] back to search state updates
      const updates = activeFiltersToSearchUpdates(filters, facets)

      // Apply each update to the search hook
      if (updates.manufacturers !== undefined) setManufacturers(updates.manufacturers)
      if (updates.productLines !== undefined) setProductLines(updates.productLines)
      if (updates.brandNames !== undefined) setBrandNames(updates.brandNames)
      if (updates.stockStatus !== undefined) setStockStatus(updates.stockStatus)
      if (updates.minPrice !== undefined || updates.maxPrice !== undefined) {
        setPriceRange(updates.minPrice ?? null, updates.maxPrice ?? null)
      }
      // Apply spec filters
      if (updates.specs) {
        // Get all current spec keys from search state + new spec keys
        const allSpecKeys = new Set([
          ...Object.keys(searchState.specs),
          ...Object.keys(updates.specs),
        ])
        for (const key of allSpecKeys) {
          const newValues = updates.specs[key] || []
          const oldValues = searchState.specs[key] || []
          if (JSON.stringify(newValues) !== JSON.stringify(oldValues)) {
            setSpecFilter(key, newValues)
          }
        }
      }
    },
    [facets, searchState.specs, setManufacturers, setProductLines, setBrandNames, setStockStatus, setPriceRange, setSpecFilter],
  )

  const handleResetFilters = useCallback(() => {
    resetFilters()
  }, [resetFilters])

  const handleSortChange = useCallback(
    (value: string) => {
      setSort(value)
    },
    [setSort],
  )

  const handleViewChange = useCallback((value: ViewMode) => {
    setViewMode(value)
  }, [])

  const handleRemoveFilter = useCallback(
    (groupId: string) => {
      const newFilters = activeFilters.filter(f => f.groupId !== groupId)
      handleFilterChange(newFilters)
    },
    [activeFilters, handleFilterChange],
  )

  const handleAddToCart = useCallback(
    (productId: string, quantity: number = 1) => {
      const hit = hits.find(h => String(h.id) === productId)
      if (!hit) return

      const price = hit.effectivePrice ?? hit.price ?? 0

      addItem({
        id: hit.id,
        title: hit.title,
        slug: hit.slug || '',
        price,
        unitPrice: price,
        quantity,
        stock: hit.stock ?? 0,
        sku: hit.sku || undefined,
        image: hit.image || undefined,
        backordersAllowed: hit.backordersAllowed ?? false,
      })

      showToast({
        id: String(hit.id),
        name: hit.title,
        image: hit.image || undefined,
        quantity,
        price,
      })
    },
    [hits, addItem, showToast],
  )

  // ========================================
  // PAGINATION HANDLER
  // ========================================

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [setPage],
  )

  // ========================================
  // RENDER
  // ========================================

  return (
    <div
      className="font-body overflow-x-hidden px-4 lg:px-0"
      style={{ maxWidth: 'var(--container-width, 1792px)', margin: '0 auto' }}
      data-testid="shop-archive-template"
    >
      {/* ========================================
          BREADCRUMBS
          ======================================== */}
      <Breadcrumbs items={breadcrumbs} currentPage={category?.name || 'Shop'} />

      {/* ========================================
          CATEGORY HERO
          ======================================== */}
      <section>
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
          inStockPercent={displayTotal > 0 ? Math.round((stats.inStock / displayTotal) * 100) : 0}
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
      <div className="mx-auto pt-6 pb-24">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-7">
          {/* ========================================
              DESKTOP SIDEBAR FILTERS
              ======================================== */}
          <FilterSidebar
            filters={orderedFilterGroups}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onResetAll={handleResetFilters}
            sticky={true}
            stickyTop={90}
            defaultOpen={allFilterIds}
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
              sortValue={searchState.sort}
              sortOptions={sortOptions}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewChange={handleViewChange}
              resultCount={displayProducts.length}
              totalCount={displayTotal}
              showViewToggle={true}
              className="mb-6"
              activeFilters={activeFilters.map(f => ({ groupId: f.groupId, label: f.label }))}
              onRemoveFilter={handleRemoveFilter}
              onResetFilters={handleResetFilters}
              onOpenMobileFilters={() => setMobileFiltersOpen(true)}
            />

            {/* ========================================
                LOADING STATE
                ======================================== */}
            {searchLoading && (
              <div className="flex items-center justify-center py-16" data-testid="loading-state">
                <Loader2 className="w-8 h-8 text-theme-teal animate-spin" />
              </div>
            )}

            {/* ========================================
                ERROR STATE
                ======================================== */}
            {searchError && !searchLoading && (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <PackageX className="w-16 h-16 text-theme-grey-mid mb-4" />
                <h3 className="text-xl font-bold text-theme-navy mb-2">
                  Zoeken tijdelijk niet beschikbaar
                </h3>
                <p className="text-theme-grey-mid mb-6 max-w-md">
                  De zoekservice is even niet bereikbaar. Probeer het later opnieuw.
                </p>
              </div>
            )}

            {/* ========================================
                PRODUCT GRID
                ======================================== */}
            {!searchLoading && !searchError && (
              <>
                {displayProducts.length === 0 ? (
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
                    {displayProducts.map((hit: ShopSearchHit) => {
                      const stockStatus = hitStockStatus(hit)
                      const effectivePrice = hit.effectivePrice ?? hit.price
                      const hasDiscount = hit.compareAtPrice != null && effectivePrice != null && hit.compareAtPrice > effectivePrice
                      const isGrouped = hit.productType === 'grouped'
                      const priceLabel = isGrouped && effectivePrice != null ? 'Vanaf' : undefined

                      // Grouped products can't be added to cart directly — user must pick variant on product page
                      const canAddToCart = !isGrouped && stockStatus !== 'out'

                      return (
                        <ProductCard
                          key={hit.id}
                          id={String(hit.id)}
                          name={hit.title}
                          slug={hit.slug || ''}
                          sku={hit.sku || ''}
                          brand={{ name: hit.brand || '', slug: '' }}
                          image={hit.image ? { url: hit.image, alt: hit.title } : undefined}
                          price={effectivePrice}
                          priceLabel={priceLabel}
                          compareAtPrice={hasDiscount ? hit.compareAtPrice! : undefined}
                          stock={hit.stock ?? 0}
                          stockStatus={stockStatus}
                          stockText={stockStatus === 'on-backorder' ? 'Op bestelling' : undefined}
                          variant={viewMode}
                          onAddToCart={canAddToCart ? handleAddToCart : undefined}
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
            {!searchLoading && displayTotalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-10" data-testid="pagination">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`w-11 h-11 rounded-xl border-[1.5px] border-[var(--color-border)] bg-white flex items-center justify-center text-sm font-semibold text-[var(--color-text-primary)] transition-all hover:border-[var(--color-primary)] ${
                    currentPage === 1 ? 'opacity-30 pointer-events-none' : ''
                  }`}
                  aria-label="Vorige pagina"
                  data-testid="pagination-prev"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                {Array.from({ length: displayTotalPages }, (_, i) => i + 1).map(page => {
                  const isVisible =
                    page === 1 ||
                    page === displayTotalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)

                  if (!isVisible) {
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
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-semibold transition-all ${
                        page === currentPage
                          ? 'bg-[var(--color-primary)] border-[1.5px] border-[var(--color-primary)] text-white'
                          : 'border-[1.5px] border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:border-[var(--color-primary)]'
                      }`}
                      data-testid={`pagination-page-${page}`}
                    >
                      {page}
                    </button>
                  )
                })}

                <button
                  onClick={() => handlePageChange(Math.min(displayTotalPages, currentPage + 1))}
                  disabled={currentPage === displayTotalPages}
                  className={`w-11 h-11 rounded-xl border-[1.5px] border-[var(--color-border)] bg-white flex items-center justify-center text-sm font-semibold text-[var(--color-text-primary)] transition-all hover:border-[var(--color-primary)] ${
                    currentPage === displayTotalPages ? 'opacity-30 pointer-events-none' : ''
                  }`}
                  aria-label="Volgende pagina"
                  data-testid="pagination-next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ========================================
                CATEGORY CONTENT (Rich Text)
                ======================================== */}
            {categoryContent && (
              <div className="mt-12 pt-10 border-t border-[var(--color-border)]">
                <RichText data={categoryContent} enableGutter={false} enableProse={true} />
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
        filters={orderedFilterGroups}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onResetAll={handleResetFilters}
        defaultOpen={allFilterIds}
        resultCount={displayTotal}
      />
    </div>
  )
}
