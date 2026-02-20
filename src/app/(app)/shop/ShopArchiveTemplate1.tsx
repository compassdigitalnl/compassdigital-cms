'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import type { Product } from '@/payload-types'
import {
  Grid3X3,
  List,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Layers,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  XCircle,
  Award,
  Ruler,
  Euro,
  PackageCheck,
  Package,
  SlidersHorizontal,
  Minus,
  Plus,
} from 'lucide-react'

interface ShopArchiveTemplate1Props {
  products: Product[]
  category?: any
  totalProducts: number
}

export default function ShopArchiveTemplate1({
  products,
  category,
  totalProducts,
}: ShopArchiveTemplate1Props) {
  const { addItem } = useCart()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('relevance')
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Filters state
  const [filters, setFilters] = useState({
    brands: [] as string[],
    priceMin: 0,
    priceMax: 1000,
    materials: [] as string[],
    ratings: [] as number[],
    stock: [] as string[],
  })

  // Active filters
  const [activeFilters, setActiveFilters] = useState<Array<{ key: string; value: string }>>([])

  // Prevent body scroll when mobile filters are open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showMobileFilters])

  // Extract unique values for filters
  const brands = Array.from(
    new Set(products.map((p) => p.brand).filter((b): b is string => !!b))
  )
  const materials = Array.from(
    new Set(
      products.flatMap((p) =>
        Array.isArray(p.specifications)
          ? p.specifications
              .flatMap((group: any) => group.attributes || [])
              .filter((attr: any) => attr.name?.toLowerCase() === 'materiaal')
              .map((attr: any) => attr.value)
          : []
      )
    )
  )

  const stepQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1
      const newQty = Math.max(1, current + delta)
      return { ...prev, [productId]: newQty }
    })
  }

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const qty = quantities[product.id] || 1
    addItem({
      product,
      quantity: qty,
    })
  }

  const handleRemoveFilter = (key: string, value: string) => {
    setActiveFilters((prev) => prev.filter((f) => !(f.key === key && f.value === value)))
  }

  const clearAllFilters = () => {
    setActiveFilters([])
    setFilters({
      brands: [],
      priceMin: 0,
      priceMax: 1000,
      materials: [],
      ratings: [],
      stock: [],
    })
  }

  // Calculate stats
  const stats = {
    totalProducts,
    brands: brands.length,
    inStock: products.filter((p) => p.stock > 0).length,
  }

  // Filters Component (reusable for sidebar and mobile drawer)
  const FiltersContent = () => (
    <div>
      {/* Filter: Merken */}
      {brands.length > 0 && (
        <div className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden mb-4">
          <div className="p-4 md:px-5 flex items-center justify-between cursor-pointer">
            <h3 className="font-[var(--font-heading)] text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Award className="w-4 h-4 text-[var(--color-primary)]" /> Merk
            </h3>
            <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
          </div>
          <div className="px-4 md:px-5 pb-4">
            {brands.slice(0, 6).map((brand) => (
              <div
                key={brand}
                className="flex items-center gap-2.5 py-1.5 md:py-2 text-sm text-[var(--color-text-primary)] cursor-pointer"
              >
                <div className="w-[18px] h-[18px] border-2 border-[var(--color-border)] rounded-md flex-shrink-0" />
                {brand}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter: Materiaal */}
      {materials.length > 0 && (
        <div className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden mb-4">
          <div className="p-4 md:px-5 flex items-center justify-between">
            <h3 className="font-[var(--font-heading)] text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--color-primary)]" /> Materiaal
            </h3>
            <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
          </div>
          <div className="px-4 md:px-5 pb-4">
            {materials.slice(0, 4).map((material) => (
              <div
                key={material}
                className="flex items-center gap-2.5 py-1.5 md:py-2 text-sm text-[var(--color-text-primary)] cursor-pointer"
              >
                <div className="w-[18px] h-[18px] border-2 border-[var(--color-border)] rounded-md flex-shrink-0" />
                {material}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter: Beschikbaarheid */}
      <div className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden mb-4">
        <div className="p-4 md:px-5 flex items-center justify-between">
          <h3 className="font-[var(--font-heading)] text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-[var(--color-primary)]" /> Beschikbaarheid
          </h3>
          <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
        </div>
        <div className="px-4 md:px-5 pb-4">
          <div className="flex items-center gap-2.5 py-1.5 md:py-2 text-sm text-[var(--color-text-primary)] cursor-pointer">
            <div className="w-[18px] h-[18px] border-2 border-[var(--color-border)] rounded-md flex-shrink-0" />
            Op voorraad
            <span className="ml-auto text-xs text-[var(--color-text-muted)]">{stats.inStock}</span>
          </div>
        </div>
      </div>

      {/* Reset Filters */}
      {activeFilters.length > 0 && (
        <div
          onClick={clearAllFilters}
          className="flex items-center justify-center gap-1.5 p-3 text-[13px] text-[var(--color-text-muted)] cursor-pointer transition-colors hover:text-[var(--color-text-primary)]"
        >
          <XCircle className="w-4 h-4" /> Alle filters wissen
        </div>
      )}
    </div>
  )

  return (
    <div className="font-body max-w-[100vw] overflow-x-hidden">
      {/* ========================================
          MOBILE CATEGORY HERO
          ======================================== */}
      <section className="lg:hidden bg-gradient-to-br from-[#1A1F36] via-[#232942] to-[#0D2137] px-4 md:px-6 py-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/15 border border-blue-500/30 px-3 py-1 rounded-full text-[11px] font-semibold text-blue-400 tracking-wide uppercase mb-3">
            <Package className="w-3 h-3" /> Categorie
          </div>
          <h1 className="font-heading text-[28px] md:text-4xl font-extrabold text-white tracking-tight mb-2">
            {category?.name || 'Alle Producten'}
          </h1>
          <p className="text-sm text-white/50 leading-relaxed mb-5">
            {category?.description || 'Professionele medische producten van topkwaliteit'}
          </p>

          {/* Mobile Stats */}
          <div className="flex gap-5 md:gap-8">
            <div>
              <div className="font-heading text-[20px] md:text-[22px] font-extrabold text-white">
                {stats.totalProducts}
              </div>
              <div className="text-[11px] text-white/40 mt-0.5">Producten</div>
            </div>
            <div>
              <div className="font-heading text-[20px] md:text-[22px] font-extrabold text-white">
                {stats.brands}
              </div>
              <div className="text-[11px] text-white/40 mt-0.5">Merken</div>
            </div>
            <div>
              <div className="font-heading text-[20px] md:text-[22px] font-extrabold text-white">
                {Math.round((stats.inStock / stats.totalProducts) * 100)}
                <span className="text-[#60A5FA]">%</span>
              </div>
              <div className="text-[11px] text-white/40 mt-0.5">Op voorraad</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          DESKTOP CATEGORY HERO
          ======================================== */}
      <section className="hidden lg:block bg-gradient-to-br from-[#1A1F36] via-[#232942] to-[#0D2137] py-12 relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute -top-1/2 -right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-radial from-blue-500/10 to-transparent" />

        <div className="max-w-[1240px] mx-auto px-6 relative z-10 flex items-center justify-between gap-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#60A5FA] tracking-wider uppercase mb-4">
              <Package className="w-4 h-4" /> Categorie
            </div>
            <h1 className="font-heading text-4xl font-extrabold text-white tracking-tight mb-2.5">
              {category?.name || 'Alle Producten'}
            </h1>
            <p className="text-base text-white/50 leading-relaxed max-w-[520px]">
              {category?.description || 'Professionele medische producten van topkwaliteit'}
            </p>
          </div>

          <div className="flex gap-8">
            <div className="text-center">
              <div className="font-heading text-[28px] font-extrabold text-white">
                {stats.totalProducts}
              </div>
              <div className="text-xs text-white/40 mt-0.5">Producten</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-[28px] font-extrabold text-white">
                {stats.brands}
              </div>
              <div className="text-xs text-white/40 mt-0.5">Merken</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-[28px] font-extrabold text-white">
                {Math.round((stats.inStock / stats.totalProducts) * 100)}
                <span className="text-[#60A5FA]">%</span>
              </div>
              <div className="text-xs text-white/40 mt-0.5">Op voorraad</div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Layout */}
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-24 pt-7 pb-24">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-7">
          {/* DESKTOP Sidebar Filters */}
          <aside className="hidden lg:block lg:sticky lg:top-[90px]">
            <FiltersContent />
          </aside>

          {/* Main Product Content */}
          <main>
            {/* Mobile Toolbar */}
            <div className="lg:hidden mb-4">
              <div className="mb-3 text-[13px] text-[var(--color-text-muted)]">
                <strong className="text-[var(--color-text-primary)] font-bold">
                  {products.length}
                </strong>{' '}
                van {totalProducts} producten
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3.5 py-3 bg-white border-[1.5px] border-[var(--color-border)] rounded-lg font-body text-sm font-semibold text-[var(--color-text-primary)] cursor-pointer outline-none"
              >
                <option value="relevance">Relevantie</option>
                <option value="price-asc">Prijs: laag → hoog</option>
                <option value="price-desc">Prijs: hoog → laag</option>
                <option value="newest">Nieuwste</option>
                <option value="rating">Best beoordeeld</option>
              </select>
            </div>

            {/* Desktop Toolbar */}
            <div className="hidden lg:flex items-center justify-between mb-5 gap-4 flex-wrap">
              <div>
                <div className="text-sm text-[var(--color-text-muted)]">
                  <strong className="text-[var(--color-text-primary)] font-bold">
                    {products.length}
                  </strong>{' '}
                  van {totalProducts} producten
                </div>
                {activeFilters.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-2">
                    {activeFilters.map((filter, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleRemoveFilter(filter.key, filter.value)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs font-semibold text-[var(--color-primary)] cursor-pointer transition-all hover:bg-blue-500/20"
                      >
                        {filter.value}
                        <X className="w-3 h-3" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="py-2.5 px-3.5 pr-9 bg-white border-[1.5px] border-[var(--color-border)] rounded-xl font-body text-[13px] font-semibold text-[var(--color-text-primary)] cursor-pointer outline-none"
                >
                  <option value="relevance">Relevantie</option>
                  <option value="price-asc">Prijs: laag → hoog</option>
                  <option value="price-desc">Prijs: hoog → laag</option>
                  <option value="newest">Nieuwste</option>
                  <option value="rating">Best beoordeeld</option>
                </select>

                <div className="flex border-[1.5px] border-[var(--color-border)] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`w-10 h-[38px] border-none flex items-center justify-center cursor-pointer border-r border-[var(--color-border)] ${
                      viewMode === 'grid' ? 'bg-blue-500/10' : 'bg-white'
                    }`}
                  >
                    <Grid3X3
                      className="w-4 h-4"
                      style={{ color: viewMode === 'grid' ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                    />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`w-10 h-[38px] border-none flex items-center justify-center cursor-pointer ${
                      viewMode === 'list' ? 'bg-blue-500/10' : 'bg-white'
                    }`}
                  >
                    <List
                      className="w-4 h-4"
                      style={{ color: viewMode === 'list' ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid - Responsive */}
            <div className="grid gap-3 lg:gap-5">
              <style>{`
                @media (min-width: 640px) {
                  .product-grid {
                    grid-template-columns: repeat(2, 1fr) !important;
                  }
                }
                @media (min-width: 1024px) {
                  .product-grid {
                    grid-template-columns: ${viewMode === 'grid' ? 'repeat(3, 1fr)' : '1fr'} !important;
                  }
                }
              `}</style>
              <div className="product-grid grid grid-cols-1 gap-3 lg:gap-5">
                {products.map((product) => {
                  const imageUrl =
                    typeof product.images?.[0]?.image === 'object' && product.images[0].image !== null
                      ? product.images[0].image.url
                      : null
                  const qty = quantities[product.id] || 1

                  return (
                    <Link
                      key={product.id}
                      href={`/shop/${product.slug}`}
                      className="bg-white rounded-2xl overflow-hidden border border-[var(--color-border)] transition-all duration-[350ms] relative no-underline text-inherit flex flex-col hover:shadow-lg"
                    >
                      {/* Product Image */}
                      <div
                        className={`bg-[var(--color-background)] flex items-center justify-center relative flex-shrink-0 ${
                          viewMode === 'grid' ? 'w-full h-[180px] md:h-[200px]' : 'w-[120px] min-h-[140px] lg:w-full lg:h-auto lg:min-h-0'
                        }`}
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-12 h-12 lg:w-16 lg:h-16 text-[var(--color-text-muted)]" />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-3.5 md:p-4 lg:p-[18px] flex flex-col flex-1">
                        {product.brand && (
                          <div className="text-[10px] lg:text-[11px] font-bold uppercase text-[var(--color-primary)] tracking-wider mb-1 md:mb-1.5">
                            {product.brand}
                          </div>
                        )}
                        <div className="font-semibold text-[13px] lg:text-sm text-[var(--color-text-primary)] mb-1 leading-snug line-clamp-2">
                          {product.title}
                        </div>
                        {product.sku && (
                          <div className="font-mono text-[10px] lg:text-[11px] text-[var(--color-text-muted)] mb-2">
                            Art. {product.sku}
                          </div>
                        )}

                        <div className="flex justify-between items-end mt-auto">
                          <div>
                            <div className="font-heading text-lg lg:text-xl font-extrabold text-[var(--color-text-primary)]">
                              €{product.price.toFixed(2).replace('.', ',')}
                            </div>
                            <div className="text-[10px] lg:text-[11px] text-[var(--color-text-muted)] mt-px">
                              excl. BTW
                            </div>
                            {product.volumePricing && product.volumePricing.length > 0 && (
                              <div className="inline-flex items-center gap-1 text-[10px] lg:text-[11px] text-[var(--color-primary)] font-semibold mt-1">
                                <Layers className="w-3 h-3" /> Staffelprijzen
                              </div>
                            )}
                          </div>

                          {/* Quick Add */}
                          <div className="flex items-center gap-1.5 md:gap-2">
                            <div className="flex items-center border-[1.5px] border-[var(--color-border)] rounded-lg overflow-hidden">
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  stepQuantity(product.id, -1)
                                }}
                                className="min-w-[32px] min-h-[32px] border-none bg-[var(--color-background)] cursor-pointer text-sm text-[var(--color-text-primary)] flex items-center justify-center"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                value={qty}
                                readOnly
                                className="w-7 h-8 border-none text-center font-mono text-xs text-[var(--color-text-primary)] outline-none"
                              />
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  stepQuantity(product.id, 1)
                                }}
                                className="min-w-[32px] min-h-[32px] border-none bg-[var(--color-background)] cursor-pointer text-sm text-[var(--color-text-primary)] flex items-center justify-center"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={(e) => handleAddToCart(product, e)}
                              className="min-w-[38px] min-h-[38px] rounded-xl bg-[var(--color-primary)] text-white border-none cursor-pointer flex items-center justify-center transition-all shadow-[0_2px_8px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_12px_rgba(59,130,246,0.4)]"
                              aria-label="Add to cart"
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Stock Status */}
                        {product.stock > 0 && (
                          <div
                            className={`flex items-center gap-1.5 text-[11px] lg:text-xs font-medium mt-2.5 md:mt-3 pt-2.5 md:pt-3 border-t border-[var(--color-border)] ${
                              product.stock > 20 ? 'text-[#10B981]' : 'text-[#F59E0B]'
                            }`}
                          >
                            <div
                              className={`w-1.5 h-1.5 lg:w-[6px] lg:h-[6px] rounded-full ${
                                product.stock > 20 ? 'bg-[#10B981]' : 'bg-[#F59E0B]'
                              }`}
                            />
                            {product.stock > 20 ? 'Op voorraad' : `Nog ${product.stock} op voorraad`}
                          </div>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Pagination Placeholder */}
            {products.length > 0 && (
              <div className="flex items-center justify-center gap-1.5 pt-8 lg:pt-10">
                <button
                  disabled
                  className="w-[42px] h-[42px] rounded-xl border-[1.5px] border-[var(--color-border)] bg-white flex items-center justify-center text-sm font-semibold text-[var(--color-text-primary)] cursor-pointer opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-[42px] h-[42px] rounded-xl bg-[var(--color-primary)] border-[1.5px] border-[var(--color-primary)] text-white flex items-center justify-center text-sm font-semibold cursor-pointer">
                  1
                </button>
                <button className="w-[42px] h-[42px] rounded-xl border-[1.5px] border-[var(--color-border)] bg-white flex items-center justify-center text-sm font-semibold text-[var(--color-text-primary)] cursor-pointer">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ========================================
          MOBILE FLOATING FILTER BUTTON
          ======================================== */}
      <button
        onClick={() => setShowMobileFilters(true)}
        className="lg:hidden fixed bottom-6 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[color-mix(in_srgb,var(--color-primary)_85%,black)] text-white border-none cursor-pointer flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.15),0_4px_12px_rgba(59,130,246,0.3)] z-[999] transition-all hover:scale-105"
        aria-label="Open filters"
      >
        <SlidersHorizontal className="w-5 h-5" />
        {activeFilters.length > 0 && (
          <div className="absolute -top-1 -right-1 min-w-[22px] h-[22px] rounded-full bg-[#EF4444] text-white text-[11px] font-bold flex items-center justify-center px-1.5 border-2 border-white">
            {activeFilters.length}
          </div>
        )}
      </button>

      {/* ========================================
          MOBILE FILTER DRAWER
          ======================================== */}
      {showMobileFilters && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-[9999]">
          {/* Backdrop */}
          <div
            onClick={() => setShowMobileFilters(false)}
            className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 animate-[fadeIn_0.2s]"
          />

          {/* Drawer */}
          <div className="absolute top-0 right-0 bottom-0 w-[85%] max-w-[360px] bg-[var(--color-background,#F9FAFB)] shadow-[-4px_0_24px_rgba(0,0,0,0.15)] animate-[slideInRight_0.3s] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between bg-white">
              <div>
                <h2 className="font-heading text-lg font-bold text-[var(--color-text-primary)]">
                  Filters
                </h2>
                {activeFilters.length > 0 && (
                  <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {activeFilters.length} actief
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="min-w-[40px] min-h-[40px] border-none bg-none cursor-pointer flex items-center justify-center text-[var(--color-text-muted)]"
                aria-label="Close filters"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Filters Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4">
              <FiltersContent />
            </div>

            {/* Footer - Apply Button */}
            <div className="p-4 border-t border-[var(--color-border)] bg-white">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full min-h-[48px] px-3.5 py-3.5 bg-[var(--color-primary)] text-white border-none rounded-xl text-[15px] font-bold cursor-pointer font-body"
              >
                Toon {products.length} producten
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
