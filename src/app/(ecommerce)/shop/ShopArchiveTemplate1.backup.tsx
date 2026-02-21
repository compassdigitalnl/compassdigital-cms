'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/branches/ecommerce/contexts/CartContext'
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
        <div
          style={{
            background: 'var(--color-surface, white)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Award className="w-4 h-4" style={{ color: 'var(--color-primary)' }} /> Merk
            </h3>
            <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <div style={{ padding: '0 18px 16px' }}>
            {brands.slice(0, 6).map((brand) => (
              <div
                key={brand}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '7px 0',
                  fontSize: '14px',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid var(--color-border)',
                    borderRadius: '5px',
                    flexShrink: 0,
                  }}
                />
                {brand}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter: Materiaal */}
      {materials.length > 0 && (
        <div
          style={{
            background: 'var(--color-surface, white)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Layers className="w-4 h-4" style={{ color: 'var(--color-primary)' }} /> Materiaal
            </h3>
            <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <div style={{ padding: '0 18px 16px' }}>
            {materials.slice(0, 4).map((material) => (
              <div
                key={material}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '7px 0',
                  fontSize: '14px',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid var(--color-border)',
                    borderRadius: '5px',
                    flexShrink: 0,
                  }}
                />
                {material}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter: Beschikbaarheid */}
      <div
        style={{
          background: 'var(--color-surface, white)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <PackageCheck className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />{' '}
            Beschikbaarheid
          </h3>
          <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
        </div>
        <div style={{ padding: '0 18px 16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '7px 0',
              fontSize: '14px',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                border: '2px solid var(--color-border)',
                borderRadius: '5px',
                flexShrink: 0,
              }}
            />
            Op voorraad
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--color-text-muted)' }}>
              {stats.inStock}
            </span>
          </div>
        </div>
      </div>

      {/* Reset Filters */}
      {activeFilters.length > 0 && (
        <div
          onClick={clearAllFilters}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '12px',
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
        >
          <XCircle className="w-4 h-4" /> Alle filters wissen
        </div>
      )}
    </div>
  )

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* ========================================
          MOBILE CATEGORY HERO
          ======================================== */}
      <section className="lg:hidden"
        style={{
          background: 'linear-gradient(135deg, #1A1F36 0%, #232942 50%, #0D2137 100%)',
          padding: '32px 16px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(59,130,246,0.15)',
              border: '1px solid rgba(59,130,246,0.3)',
              padding: '5px 12px',
              borderRadius: '100px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#60A5FA',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            <Package className="w-3 h-3" /> Categorie
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '28px',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.02em',
              marginBottom: '8px',
            }}
          >
            {category?.name || 'Alle Producten'}
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: '20px' }}>
            {category?.description || 'Professionele medische producten van topkwaliteit'}
          </p>

          {/* Mobile Stats */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: 'white',
                }}
              >
                {stats.totalProducts}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                Producten
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: 'white',
                }}
              >
                {stats.brands}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                Merken
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: 'white',
                }}
              >
                {Math.round((stats.inStock / stats.totalProducts) * 100)}
                <span style={{ color: '#60A5FA' }}>%</span>
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                Op voorraad
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          DESKTOP CATEGORY HERO
          ======================================== */}
      <section className="hidden lg:block"
        style={{
          background: 'linear-gradient(135deg, #1A1F36 0%, #232942 50%, #0D2137 100%)',
          padding: '48px 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '0 24px',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '40px',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(59,130,246,0.15)',
                border: '1px solid rgba(59,130,246,0.3)',
                padding: '6px 14px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#60A5FA',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              <Package className="w-4 h-4" /> Categorie
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '36px',
                fontWeight: 800,
                color: 'white',
                letterSpacing: '-0.02em',
                marginBottom: '10px',
              }}
            >
              {category?.name || 'Alle Producten'}
            </h1>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: '520px' }}>
              {category?.description || 'Professionele medische producten van topkwaliteit'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '28px',
                  fontWeight: 800,
                  color: 'white',
                }}
              >
                {stats.totalProducts}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                Producten
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '28px',
                  fontWeight: 800,
                  color: 'white',
                }}
              >
                {stats.brands}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                Merken
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '28px',
                  fontWeight: 800,
                  color: 'white',
                }}
              >
                {Math.round((stats.inStock / stats.totalProducts) * 100)}
                <span style={{ color: '#60A5FA' }}>%</span>
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                Op voorraad
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Layout */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '28px 16px 100px' }} className="lg:px-24">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-7" style={{ display: 'block' }}>
          {/* DESKTOP Sidebar Filters */}
          <aside className="hidden lg:block" style={{ position: 'sticky', top: '90px' }}>
            <FiltersContent />
          </aside>

          {/* Main Product Content */}
          <main>
            {/* Mobile Toolbar */}
            <div className="lg:hidden" style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '12px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                <strong style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>
                  {products.length}
                </strong>{' '}
                van {totalProducts} producten
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'var(--color-surface, white)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="relevance">Relevantie</option>
                <option value="price-asc">Prijs: laag → hoog</option>
                <option value="price-desc">Prijs: hoog → laag</option>
                <option value="newest">Nieuwste</option>
                <option value="rating">Best beoordeeld</option>
              </select>
            </div>

            {/* Desktop Toolbar */}
            <div className="hidden lg:flex"
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                  <strong style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>
                    {products.length}
                  </strong>{' '}
                  van {totalProducts} producten
                </div>
                {activeFilters.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {activeFilters.map((filter, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleRemoveFilter(filter.key, filter.value)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          background: 'rgba(59,130,246,0.08)',
                          border: '1px solid rgba(59,130,246,0.2)',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--color-primary)',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        {filter.value}
                        <X className="w-3 h-3" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '10px 36px 10px 14px',
                    background: 'var(--color-surface, white)',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="relevance">Relevantie</option>
                  <option value="price-asc">Prijs: laag → hoog</option>
                  <option value="price-desc">Prijs: hoog → laag</option>
                  <option value="newest">Nieuwste</option>
                  <option value="rating">Best beoordeeld</option>
                </select>
                <div
                  style={{
                    display: 'flex',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setViewMode('grid')}
                    style={{
                      width: '40px',
                      height: '38px',
                      border: 'none',
                      background: viewMode === 'grid' ? 'rgba(59,130,246,0.08)' : 'var(--color-surface, white)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRight: '1px solid var(--color-border)',
                    }}
                  >
                    <Grid3X3
                      className="w-4 h-4"
                      style={{ color: viewMode === 'grid' ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                    />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    style={{
                      width: '40px',
                      height: '38px',
                      border: 'none',
                      background: viewMode === 'list' ? 'rgba(59,130,246,0.08)' : 'var(--color-surface, white)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
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
            <div
              className="grid gap-3 lg:gap-5"
              style={{
                gridTemplateColumns: viewMode === 'grid' ? '1fr' : '1fr',
              }}
            >
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
              <div
                className="product-grid grid gap-3 lg:gap-5"
                style={{
                  gridTemplateColumns: '1fr',
                }}
              >
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
                      style={{
                        background: 'var(--color-surface, white)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid var(--color-border)',
                        transition: 'all 0.35s',
                        position: 'relative',
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'flex',
                        flexDirection: viewMode === 'grid' ? 'column' : 'row',
                      }}
                    >
                      {/* Product Image */}
                      <div
                        style={{
                          width: viewMode === 'grid' ? '100%' : '120px',
                          height: viewMode === 'grid' ? '180px' : 'auto',
                          minHeight: viewMode === 'list' ? '140px' : undefined,
                          background: 'var(--color-background)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          flexShrink: 0,
                        }}
                        className="lg:w-auto lg:h-auto lg:min-h-0"
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <Package className="w-12 h-12 lg:w-16 lg:h-16" style={{ color: 'var(--color-text-muted)' }} />
                        )}
                      </div>

                      {/* Product Info */}
                      <div
                        style={{
                          padding: '14px',
                          display: 'flex',
                          flexDirection: 'column',
                          flex: 1,
                        }}
                        className="lg:p-18"
                      >
                        {product.brand && (
                          <div
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              color: 'var(--color-primary)',
                              letterSpacing: '0.05em',
                              marginBottom: '5px',
                            }}
                            className="lg:text-11 lg:mb-6"
                          >
                            {product.brand}
                          </div>
                        )}
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: '13px',
                            color: 'var(--color-text-primary)',
                            marginBottom: '4px',
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                          className="lg:text-14"
                        >
                          {product.title}
                        </div>
                        {product.sku && (
                          <div
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '10px',
                              color: 'var(--color-text-muted)',
                              marginBottom: '8px',
                            }}
                            className="lg:text-11"
                          >
                            Art. {product.sku}
                          </div>
                        )}

                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            marginTop: 'auto',
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '18px',
                                fontWeight: 800,
                                color: 'var(--color-text-primary)',
                              }}
                              className="lg:text-20"
                            >
                              €{product.price.toFixed(2).replace('.', ',')}
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '1px' }} className="lg:text-11">
                              excl. BTW
                            </div>
                            {product.volumePricing && product.volumePricing.length > 0 && (
                              <div
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  fontSize: '10px',
                                  color: 'var(--color-primary)',
                                  fontWeight: 600,
                                  marginTop: '3px',
                                }}
                                className="lg:text-11 lg:gap-4"
                              >
                                <Layers className="w-3 h-3" /> Staffelprijzen
                              </div>
                            )}
                          </div>

                          {/* Quick Add */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                            }}
                            className="lg:gap-6"
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '1.5px solid var(--color-border)',
                                borderRadius: '8px',
                                overflow: 'hidden',
                              }}
                            >
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  stepQuantity(product.id, -1)
                                }}
                                style={{
                                  minWidth: '32px',
                                  minHeight: '32px',
                                  border: 'none',
                                  background: 'var(--color-background)',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  color: 'var(--color-text-primary)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                value={qty}
                                readOnly
                                style={{
                                  width: '28px',
                                  height: '32px',
                                  border: 'none',
                                  textAlign: 'center',
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '12px',
                                  color: 'var(--color-text-primary)',
                                  outline: 'none',
                                }}
                              />
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  stepQuantity(product.id, 1)
                                }}
                                style={{
                                  minWidth: '32px',
                                  minHeight: '32px',
                                  border: 'none',
                                  background: 'var(--color-background)',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  color: 'var(--color-text-primary)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={(e) => handleAddToCart(product, e)}
                              style={{
                                minWidth: '38px',
                                minHeight: '38px',
                                borderRadius: '10px',
                                background: 'var(--color-primary)',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s',
                                boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
                              }}
                              aria-label="Add to cart"
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Stock Status */}
                        {product.stock > 0 && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              fontSize: '11px',
                              color: product.stock > 20 ? '#10B981' : '#F59E0B',
                              fontWeight: 500,
                              marginTop: '10px',
                              paddingTop: '10px',
                              borderTop: '1px solid var(--color-border)',
                            }}
                            className="lg:text-12 lg:mt-12 lg:pt-12"
                          >
                            <div
                              style={{
                                width: '5px',
                                height: '5px',
                                background: product.stock > 20 ? '#10B981' : '#F59E0B',
                                borderRadius: '50%',
                              }}
                              className="lg:w-6 lg:h-6"
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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  paddingTop: '32px',
                }}
                className="lg:pt-40"
              >
                <button
                  disabled
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--color-border)',
                    background: 'var(--color-surface, white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    opacity: 0.3,
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'var(--color-primary)',
                    border: '1.5px solid var(--color-primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  1
                </button>
                <button
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--color-border)',
                    background: 'var(--color-surface, white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                  }}
                >
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
        className="lg:hidden"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '16px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 85%, black) 100%)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15), 0 4px 12px rgba(59,130,246,0.3)',
          zIndex: 999,
          transition: 'all 0.3s',
        }}
        aria-label="Open filters"
      >
        <SlidersHorizontal className="w-5 h-5" />
        {activeFilters.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              minWidth: '22px',
              height: '22px',
              borderRadius: '50%',
              background: '#EF4444',
              color: 'white',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 6px',
              border: '2px solid white',
            }}
          >
            {activeFilters.length}
          </div>
        )}
      </button>

      {/* ========================================
          MOBILE FILTER DRAWER
          ======================================== */}
      {showMobileFilters && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setShowMobileFilters(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              animation: 'fadeIn 0.2s',
            }}
          />

          {/* Drawer */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '85%',
              maxWidth: '360px',
              background: 'var(--color-background, #F9FAFB)',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
              animation: 'slideInRight 0.3s',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--color-surface, white)',
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  Filters
                </h2>
                {activeFilters.length > 0 && (
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {activeFilters.length} actief
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowMobileFilters(false)}
                style={{
                  minWidth: '40px',
                  minHeight: '40px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-muted)',
                }}
                aria-label="Close filters"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Filters Content - Scrollable */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
              }}
            >
              <FiltersContent />
            </div>

            {/* Footer - Apply Button */}
            <div
              style={{
                padding: '16px',
                borderTop: '1px solid var(--color-border)',
                background: 'var(--color-surface, white)',
              }}
            >
              <button
                onClick={() => setShowMobileFilters(false)}
                style={{
                  width: '100%',
                  minHeight: '48px',
                  padding: '14px',
                  background: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                }}
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
